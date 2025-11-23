/**
 * Helper para melhorar o carregamento de dados com tratamento robusto de erros
 * Use este arquivo para padronizar como as telas carregam dados da API
 */

interface LoadDataOptions {
  retries?: number;
  retryDelay?: number;
  onError?: (error: any) => void;
}

/**
 * Carrega dados com retry automático
 * @param apiCall - Função que chama a API
 * @param options - Opções de carregamento
 * @returns Dados carregados ou array vazio em caso de erro
 */
export async function loadDataWithRetry<T>(
  apiCall: () => Promise<T>,
  options: LoadDataOptions = {}
): Promise<T | T[]> {
  const { retries = 2, retryDelay = 1000, onError } = options;
  
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const data = await apiCall();
      return data;
    } catch (error) {
      lastError = error;
      console.error(`Tentativa ${attempt + 1}/${retries + 1} falhou:`, error);
      
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }
  
  // Se chegou aqui, todas as tentativas falharam
  console.error('Todas as tentativas falharam:', lastError);
  onError?.(lastError);
  return [];
}

/**
 * Converte dados da API para formato seguro (sempre um array)
 * @param data - Dados recebidos da API
 * @returns Array de dados ou array vazio
 */
export function ensureArray<T>(data: any): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === 'object') {
    return [data];
  }
  return [];
}

/**
 * Trata erro de forma amigável
 * @param error - Erro capturado
 * @returns Mensagem de erro em português
 */
export function getErrorMessage(error: any): string {
  if (error instanceof Error) {
    // Erros conhecidos
    if (error.message.includes('401')) return 'Sem autenticação. Faça login novamente.';
    if (error.message.includes('403')) return 'Acesso negado.';
    if (error.message.includes('404')) return 'Recurso não encontrado.';
    if (error.message.includes('500')) return 'Erro no servidor. Tente novamente.';
    if (error.message.includes('Network')) return 'Erro de conexão. Verifique sua internet.';
    return error.message;
  }
  return 'Erro ao carregar dados. Tente novamente.';
}

/**
 * Hook para padrão de carregamento de dados
 */
export function useLoadData<T>(
  apiCall: () => Promise<T>,
  options: LoadDataOptions = {}
) {
  const [data, setData] = React.useState<T | T[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await loadDataWithRetry(apiCall, {
        ...options,
        onError: (err) => {
          setError(getErrorMessage(err));
          options.onError?.(err);
        },
      });
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);

  React.useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

// ====== Import necessário =====
import React from 'react';

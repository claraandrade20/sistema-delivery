// Tratamento de erros centralizado

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number = 500,
    message: string = 'Erro desconhecido',
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Códigos de erro padronizados
export const ErrorCodes = {
  // Autenticação
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validação
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Recursos
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Servidor
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  
  // Rede
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  
  // Negócio
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  INVALID_ORDER: 'INVALID_ORDER',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  DELIVERY_NOT_AVAILABLE: 'DELIVERY_NOT_AVAILABLE',
} as const;

// Mapeamento de mensagens de erro
export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.INVALID_CREDENTIALS]: 'Email ou senha inválidos',
  [ErrorCodes.UNAUTHORIZED]: 'Você não tem permissão para acessar este recurso',
  [ErrorCodes.TOKEN_EXPIRED]: 'Sua sessão expirou. Faça login novamente',
  
  [ErrorCodes.VALIDATION_ERROR]: 'Dados inválidos. Verifique os campos',
  [ErrorCodes.INVALID_INPUT]: 'Entrada inválida',
  
  [ErrorCodes.NOT_FOUND]: 'Recurso não encontrado',
  [ErrorCodes.ALREADY_EXISTS]: 'Este item já existe',
  [ErrorCodes.CONFLICT]: 'Conflito ao processar a solicitação',
  
  [ErrorCodes.INTERNAL_ERROR]: 'Erro interno do servidor',
  [ErrorCodes.SERVICE_UNAVAILABLE]: 'Serviço indisponível no momento',
  [ErrorCodes.TIMEOUT]: 'Solicitação expirou',
  
  [ErrorCodes.NETWORK_ERROR]: 'Erro de conexão',
  [ErrorCodes.CONNECTION_FAILED]: 'Falha ao conectar ao servidor',
  
  [ErrorCodes.INSUFFICIENT_STOCK]: 'Estoque insuficiente',
  [ErrorCodes.INVALID_ORDER]: 'Pedido inválido',
  [ErrorCodes.PAYMENT_FAILED]: 'Falha ao processar pagamento',
  [ErrorCodes.DELIVERY_NOT_AVAILABLE]: 'Entrega não disponível para este endereço',
};

/**
 * Tratador centralizado de erros
 */
export class ErrorHandler {
  /**
   * Converte erros de diferentes fontes em AppError
   */
  static handle(error: any): AppError {
    if (error instanceof AppError) {
      return error;
    }

    // Erro de fetch/API
    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        return new AppError(
          ErrorCodes.NETWORK_ERROR,
          0,
          ErrorMessages[ErrorCodes.NETWORK_ERROR]
        );
      }
    }

    // Erro genérico
    if (error instanceof Error) {
      return new AppError(
        ErrorCodes.INTERNAL_ERROR,
        500,
        error.message || ErrorMessages[ErrorCodes.INTERNAL_ERROR],
        error
      );
    }

    // Erro desconhecido
    return new AppError(
      ErrorCodes.INTERNAL_ERROR,
      500,
      ErrorMessages[ErrorCodes.INTERNAL_ERROR]
    );
  }

  /**
   * Formata mensagem de erro para exibição
   */
  static formatMessage(error: AppError): string {
    return ErrorMessages[error.code] || error.message;
  }

  /**
   * Retorna mensagem de erro amigável
   */
  static getUserMessage(error: any): string {
    const appError = this.handle(error);
    return this.formatMessage(appError);
  }

  /**
   * Log de erro com contexto
   */
  static logError(error: any, context: string = ''): void {
    const appError = this.handle(error);
    
    console.error(`[${new Date().toISOString()}] Error in ${context}:`, {
      code: appError.code,
      statusCode: appError.statusCode,
      message: appError.message,
      details: appError.details,
      stack: appError.stack,
    });
  }

  /**
   * Verifica se é um erro recuperável
   */
  static isRecoverable(error: AppError): boolean {
    // Erros de rede e timeout são recuperáveis
    const recoverableCodes = [
      ErrorCodes.NETWORK_ERROR,
      ErrorCodes.CONNECTION_FAILED,
      ErrorCodes.SERVICE_UNAVAILABLE,
      ErrorCodes.TIMEOUT,
    ];

    return recoverableCodes.includes(error.code as any);
  }

  /**
   * Verifica se é um erro de autenticação
   */
  static isAuthError(error: AppError): boolean {
    const authCodes = [
      ErrorCodes.INVALID_CREDENTIALS,
      ErrorCodes.UNAUTHORIZED,
      ErrorCodes.TOKEN_EXPIRED,
    ];

    return authCodes.includes(error.code as any);
  }
}

/**
 * Hook para tratamento de erro em requisições
 */
export const handleApiError = (error: any): AppError => {
  if (error.response) {
    // Erro com resposta do servidor
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return new AppError(
          ErrorCodes.VALIDATION_ERROR,
          status,
          data.erro || ErrorMessages[ErrorCodes.VALIDATION_ERROR],
          data
        );
      case 401:
        return new AppError(
          ErrorCodes.UNAUTHORIZED,
          status,
          ErrorMessages[ErrorCodes.UNAUTHORIZED]
        );
      case 403:
        return new AppError(
          ErrorCodes.UNAUTHORIZED,
          status,
          ErrorMessages[ErrorCodes.UNAUTHORIZED]
        );
      case 404:
        return new AppError(
          ErrorCodes.NOT_FOUND,
          status,
          data.erro || ErrorMessages[ErrorCodes.NOT_FOUND]
        );
      case 409:
        return new AppError(
          ErrorCodes.CONFLICT,
          status,
          data.erro || ErrorMessages[ErrorCodes.CONFLICT]
        );
      case 500:
        return new AppError(
          ErrorCodes.INTERNAL_ERROR,
          status,
          data.erro || ErrorMessages[ErrorCodes.INTERNAL_ERROR]
        );
      default:
        return new AppError(
          ErrorCodes.INTERNAL_ERROR,
          status,
          data.erro || 'Erro desconhecido'
        );
    }
  }

  // Erro sem resposta do servidor (problema de rede)
  return new AppError(
    ErrorCodes.NETWORK_ERROR,
    0,
    ErrorMessages[ErrorCodes.NETWORK_ERROR]
  );
};

/**
 * Retry com backoff exponencial
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      
      // Se não é recuperável, lança imediatamente
      if (!ErrorHandler.isRecoverable(appError)) {
        throw appError;
      }

      // Se foi a última tentativa, lança o erro
      if (attempt === maxAttempts - 1) {
        throw appError;
      }

      // Aguarda antes de tentar novamente
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new AppError(
    ErrorCodes.INTERNAL_ERROR,
    500,
    'Falha após múltiplas tentativas'
  );
};

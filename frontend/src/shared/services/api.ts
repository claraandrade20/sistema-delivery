// Configuração da API
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Helper para fazer requisições
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  console.log(`[API] ${options.method || 'GET'} ${endpoint}`);
  console.log(`[API] Token: ${token ? 'presente' : 'ausente'}`);
  
  // Use a Headers instance so we can safely call .set(...) for Authorization
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const optionsHeaders = options.headers;
  if (optionsHeaders instanceof Headers) {
    optionsHeaders.forEach((value, key) => headers.set(key, value));
  } else if (Array.isArray(optionsHeaders)) {
    optionsHeaders.forEach(([key, value]) => headers.set(key, value));
  } else if (optionsHeaders) {
    Object.entries(optionsHeaders).forEach(([key, value]) => headers.set(key, String(value)));
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    console.log(`[API] Authorization header definido`);
  } else {
    console.log(`[API] AVISO: Token não encontrado no localStorage`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        // Verificar diferentes formatos de erro que o servidor pode retornar
        const errorMessage = errorData.error || errorData.erro || errorData.message || `Erro ${response.status}`;
        throw new Error(errorMessage);
      } catch (parseError) {
        // Se não conseguir fazer parse do JSON, usar erro genérico
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
    }

    // Para respostas 204 (No Content)
    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error: any) {
    // Log de erro sem interromper
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// ========== Autenticação ==========

export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },

  register: async (name: string, email: string, phone: string, password: string) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getMe: async () => {
    return fetchAPI('/auth/me');
  },

  getUsers: async () => {
    return fetchAPI('/auth/users');
  },
};

// ========== Produtos ==========

export const produtosAPI = {
  listar: async (params?: { restaurantId?: string; categoryId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.restaurantId) queryParams.set('restaurantId', params.restaurantId);
    if (params?.categoryId) queryParams.set('categoryId', params.categoryId);
    
    const query = queryParams.toString();
    return fetchAPI(`/produtos${query ? `?${query}` : ''}`);
  },

  buscarPorId: async (id: string) => {
    return fetchAPI(`/produtos/${id}`);
  },

  criar: async (produto: any) => {
    return fetchAPI('/produtos', {
      method: 'POST',
      body: JSON.stringify(produto),
    });
  },

  atualizar: async (id: string, produto: any) => {
    return fetchAPI(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(produto),
    });
  },

  deletar: async (id: string) => {
    return fetchAPI(`/produtos/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========== Pedidos ==========

export const pedidosAPI = {
  listar: async (params?: { customerId?: string; restaurantId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.customerId) queryParams.set('customerId', params.customerId);
    if (params?.restaurantId) queryParams.set('restaurantId', params.restaurantId);
    
    const query = queryParams.toString();
    return fetchAPI(`/pedidos${query ? `?${query}` : ''}`);
  },

  buscarPorId: async (id: string) => {
    return fetchAPI(`/pedidos/${id}`);
  },

  criar: async (pedido: any) => {
    return fetchAPI('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedido),
    });
  },

  atualizarStatus: async (id: string, status: string) => {
    return fetchAPI(`/pedidos/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  atualizar: async (id: string, pedido: any) => {
    return fetchAPI(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pedido),
    });
  },
};

// ========== Endereços ==========

export const enderecosAPI = {
  listar: async (params?: { userId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.userId) queryParams.set('userId', params.userId);
    
    const query = queryParams.toString();
    return fetchAPI(`/enderecos${query ? `?${query}` : ''}`);
  },

  buscarPorId: async (id: string) => {
    return fetchAPI(`/enderecos/${id}`);
  },

  criar: async (endereco: any) => {
    return fetchAPI('/enderecos', {
      method: 'POST',
      body: JSON.stringify(endereco),
    });
  },

  atualizar: async (id: string, endereco: any) => {
    return fetchAPI(`/enderecos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(endereco),
    });
  },

  deletar: async (id: string) => {
    return fetchAPI(`/enderecos/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========== Horários de Funcionamento ==========

export const horariosAPI = {
  buscar: async (restaurantId: number) => {
    return fetchAPI(`/horarios/${restaurantId}`);
  },

  atualizar: async (restaurantId: number, horarios: any[]) => {
    return fetchAPI(`/horarios/${restaurantId}`, {
      method: 'PUT',
      body: JSON.stringify(horarios),
    });
  },
};

// ========== Cupons ==========

export const cuponsAPI = {
  listar: async () => {
    return fetchAPI('/cupons');
  },

  buscarPorId: async (id: string) => {
    return fetchAPI(`/cupons/${id}`);
  },

  buscarPorCodigo: async (codigo: string) => {
    return fetchAPI(`/cupons/codigo/${codigo}`);
  },

  criar: async (cupom: any) => {
    return fetchAPI('/cupons', {
      method: 'POST',
      body: JSON.stringify(cupom),
    });
  },

  atualizar: async (id: string, cupom: any) => {
    return fetchAPI(`/cupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cupom),
    });
  },

  deletar: async (id: string) => {
    return fetchAPI(`/cupons/${id}`, {
      method: 'DELETE',
    });
  },

  usar: async (codigo: string) => {
    return fetchAPI('/cupons/usar', {
      method: 'POST',
      body: JSON.stringify({ codigo }),
    });
  },
};

// ========== Categorias ==========

export const categoriasAPI = {
  listar: async (params?: { restaurantId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.restaurantId) queryParams.set('restaurantId', params.restaurantId);
    
    const query = queryParams.toString();
    return fetchAPI(`/categorias${query ? `?${query}` : ''}`);
  },

  buscarPorId: async (id: string) => {
    return fetchAPI(`/categorias/${id}`);
  },

  criar: async (categoria: any) => {
    return fetchAPI('/categorias', {
      method: 'POST',
      body: JSON.stringify(categoria),
    });
  },

  atualizar: async (id: string, categoria: any) => {
    return fetchAPI(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoria),
    });
  },

  alternarStatus: async (id: string) => {
    return fetchAPI(`/categorias/${id}/status`, {
      method: 'PATCH',
    });
  },

  deletar: async (id: string) => {
    return fetchAPI(`/categorias/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========== Clientes ==========

export const clientesAPI = {
  listar: async () => {
    return fetchAPI('/clientes');
  },

  buscarPorId: async (id: string) => {
    return fetchAPI(`/clientes/${id}`);
  },

  atualizar: async (id: string, cliente: any) => {
    return fetchAPI(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cliente),
    });
  },

  alternarStatus: async (id: string) => {
    return fetchAPI(`/clientes/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  deletar: async (id: string) => {
    return fetchAPI(`/clientes/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========== Funcionários ==========

export const funcionariosAPI = {
  listar: async () => {
    return fetchAPI('/funcionarios');
  },

  buscarPorId: async (id: string) => {
    return fetchAPI(`/funcionarios/${id}`);
  },

  criar: async (funcionario: any) => {
    return fetchAPI('/funcionarios', {
      method: 'POST',
      body: JSON.stringify(funcionario),
    });
  },

  atualizar: async (id: string, funcionario: any) => {
    return fetchAPI(`/funcionarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(funcionario),
    });
  },

  alternarStatus: async (id: string) => {
    return fetchAPI(`/funcionarios/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  deletar: async (id: string) => {
    return fetchAPI(`/funcionarios/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========== Restaurantes ==========

export const restaurantesAPI = {
  listar: async () => {
    return fetchAPI('/restaurantes');
  },

  buscarPorId: async (id: string) => {
    return fetchAPI(`/restaurantes/${id}`);
  },

  criar: async (restaurante: any) => {
    return fetchAPI('/restaurantes', {
      method: 'POST',
      body: JSON.stringify(restaurante),
    });
  },

  atualizar: async (id: string, restaurante: any) => {
    return fetchAPI(`/restaurantes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(restaurante),
    });
  },

  alternarStatus: async (id: string) => {
    return fetchAPI(`/restaurantes/${id}/status`, {
      method: 'PATCH',
    });
  },

  deletar: async (id: string) => {
    return fetchAPI(`/restaurantes/${id}`, {
      method: 'DELETE',
    });
  },

  listarProdutos: async (id: string, params?: { categoriaId?: string; disponivel?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.categoriaId) query.append('categoriaId', params.categoriaId);
    if (params?.disponivel !== undefined) query.append('disponivel', params.disponivel.toString());
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchAPI(`/restaurantes/${id}/produtos${queryString}`);
  },

  listarCategorias: async (id: string, ativo?: boolean) => {
    const query = ativo !== undefined ? `?ativo=${ativo}` : '';
    return fetchAPI(`/restaurantes/${id}/categorias${query}`);
  },

  obterEstatisticas: async (id: string) => {
    return fetchAPI(`/restaurantes/${id}/estatisticas`);
  },
};

export default {
  auth: authAPI,
  produtos: produtosAPI,
  pedidos: pedidosAPI,
  enderecos: enderecosAPI,
  horarios: horariosAPI,
  cupons: cuponsAPI,
  categorias: categoriasAPI,
  clientes: clientesAPI,
  funcionarios: funcionariosAPI,
  restaurantes: restaurantesAPI,
};

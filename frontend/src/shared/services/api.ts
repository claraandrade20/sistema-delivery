// Configuração da API
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Helper para fazer requisições
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
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
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ erro: 'Erro desconhecido' }));
    throw new Error(error.erro || `Erro ${response.status}`);
  }

  // Para respostas 204 (No Content)
  if (response.status === 204) {
    return null;
  }

  return response.json();
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

export default {
  auth: authAPI,
  produtos: produtosAPI,
  pedidos: pedidosAPI,
};

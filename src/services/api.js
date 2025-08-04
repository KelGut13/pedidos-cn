import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Configurar axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Servicios de Pedidos
export const pedidosService = {
  // Obtener todos los pedidos
  getAll: async () => {
    const response = await apiClient.get('/pedidos');
    return response.data;
  },

  // Obtener pedido por ID
  getById: async (id) => {
    const response = await apiClient.get(`/pedidos/${id}`);
    return response.data;
  },

  // Obtener estadísticas
  getEstadisticas: async () => {
    const response = await apiClient.get('/pedidos/estadisticas');
    return response.data;
  },

  // Obtener pedidos por estado
  getByEstado: async (estado) => {
    const response = await apiClient.get(`/pedidos/estado/${estado}`);
    return response.data;
  },

  // Crear nuevo pedido
  create: async (pedidoData) => {
    const response = await apiClient.post('/pedidos', pedidoData);
    return response.data;
  },

  // Actualizar pedido
  update: async (id, pedidoData) => {
    const response = await apiClient.put(`/pedidos/${id}`, pedidoData);
    return response.data;
  },

  // Actualizar estado del pedido
  updateEstado: async (id, estado) => {
    const response = await apiClient.put(`/pedidos/${id}/estado`, { estado });
    return response.data;
  },

  // Eliminar pedido
  delete: async (id) => {
    const response = await apiClient.delete(`/pedidos/${id}`);
    return response.data;
  }
};

// Servicios de Usuarios
export const usuariosService = {
  getAll: async () => {
    const response = await apiClient.get('/usuarios');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/usuarios/${id}`);
    return response.data;
  }
};

// Servicios de Productos
export const productosService = {
  getAll: async () => {
    const response = await apiClient.get('/productos');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/productos/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await apiClient.get(`/productos/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getStockBajo: async (limite = 10) => {
    const response = await apiClient.get(`/productos/stock-bajo?limite=${limite}`);
    return response.data;
  }
};

// Servicio de salud de la API
export const healthService = {
  checkDatabase: async () => {
    const response = await apiClient.get('/health/db');
    return response.data;
  }
};

export default apiClient;

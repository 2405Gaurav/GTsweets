import axios from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Sweet,
  SearchParams,
  PurchaseRequest,
  RestockRequest,
  CreateSweetRequest,
  UpdateSweetRequest,
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export const sweetsApi = {
  getAll: async (): Promise<Sweet[]> => {
    const response = await api.get<Sweet[]>('/sweets');
    return response.data;
  },

  search: async (params: SearchParams): Promise<{ sweets: Sweet[]; count: number }> => {
    const response = await api.get('/sweets/search', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Sweet> => {
    const response = await api.get<Sweet>(`/sweets/${id}`);
    return response.data;
  },

  create: async (data: CreateSweetRequest): Promise<Sweet> => {
    const response = await api.post<Sweet>('/sweets', data);
    return response.data;
  },

  update: async (id: string, data: UpdateSweetRequest): Promise<Sweet> => {
    const response = await api.put<Sweet>(`/sweets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string; sweet: Sweet }> => {
    const response = await api.delete(`/sweets/${id}`);
    return response.data;
  },

  purchase: async (id: string, data: PurchaseRequest): Promise<{ message: string; sweet: Sweet }> => {
    const response = await api.post(`/sweets/${id}/purchase`, data);
    return response.data;
  },

  restock: async (id: string, data: RestockRequest): Promise<{ message: string; sweet: Sweet }> => {
    const response = await api.post(`/sweets/${id}/restock`, data);
    return response.data;
  },
};

export default api;

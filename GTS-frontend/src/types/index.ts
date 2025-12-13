export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Sweet {
  _id: string;
  name: string;
  category: 'cake' | 'candy' | 'chocolate' | 'lollipop' | 'cookie';
  price: number;
  quantity: number;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

export interface SearchParams {
  q?: string;
  priceMin?: number;
  priceMax?: number;
}

export interface PurchaseRequest {
  quantity: number;
}

export interface RestockRequest {
  quantity: number;
}

export interface CreateSweetRequest {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl?: string;
}

export interface UpdateSweetRequest {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  description?: string;
  imageUrl?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'customer' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

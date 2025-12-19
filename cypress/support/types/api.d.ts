export interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  body?: Record<string, unknown> | undefined;
  failOnStatusCode?: boolean;
  auth?: boolean;
}

export interface UserData {
  nome: string;
  email: string;
  password: string;
  administrador: string;
}

export interface ProductData {
  nome: string;
  descricao: string;
  preco: string;
  quantidade: number;
}

export interface CartItem {
  idProduto: string;
  quantidade: number;
}

export interface CartData {
  produtos: CartItem[];
}

// Tipos de resposta da API
export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
}

export interface SuccessMessageResponse {
  message: string;
}

export interface ErrorResponse {
  message?: string;
  email?: string;
  password?: string;
}

export interface LoginResponse {
  message: string;
  authorization: string;
}

export interface ProductResponse {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
}

export interface UserResponse {
  _id: string;
  nome: string;
  email: string;
  password: string;
  administrador: string;
}

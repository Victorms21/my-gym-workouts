export interface User {
  id: number;
  email: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  data: User;
  access_token: string;
  token_type: string;
}

// Legacy support - can be removed later
export interface LegacyAuthResponse {
  user: User;
  token: string;
}

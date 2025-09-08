export interface Model {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  megaLink: string;
  views: number;
  createdAt: string;
  slug: string
}

export type SortOption = 'recent' | 'popular';
export type AdNetwork = 'linkvertise' | 'admaven';

export interface User {
  id: number;
  name: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
  expiredPremium: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}


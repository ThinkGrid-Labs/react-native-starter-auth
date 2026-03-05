export interface User {
  id: string;
  email: string;
  name?: string;
  [key: string]: unknown;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthConfig {
  /** Base URL of your auth API e.g. https://api.myapp.com */
  baseURL: string;
  /** Override individual endpoint paths (defaults shown) */
  endpoints?: {
    login?: string;         // POST  /auth/login
    register?: string;      // POST  /auth/register
    logout?: string;        // POST  /auth/logout
    refresh?: string;       // POST  /auth/refresh
    forgotPassword?: string;// POST  /auth/forgot-password
  };
  /** Keychain service name used to namespace stored credentials */
  keychainService?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

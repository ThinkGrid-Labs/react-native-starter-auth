import * as Keychain from 'react-native-keychain';
import { AuthConfig, AuthTokens, User } from '../types/auth';

// ─── Secure token storage (Keychain / Secure Enclave) ───────────────────────

const DEFAULT_SERVICE = 'rn_starter_auth';

export const storeTokens = async (
  tokens: AuthTokens,
  service: string = DEFAULT_SERVICE,
): Promise<void> => {
  await Keychain.setGenericPassword('auth_tokens', JSON.stringify(tokens), { service });
};

export const getStoredTokens = async (
  service: string = DEFAULT_SERVICE,
): Promise<AuthTokens | null> => {
  const result = await Keychain.getGenericPassword({ service });
  if (!result) {
    return null;
  }
  try {
    return JSON.parse(result.password) as AuthTokens;
  } catch {
    return null;
  }
};

export const clearStoredTokens = async (service: string = DEFAULT_SERVICE): Promise<void> => {
  await Keychain.resetGenericPassword({ service });
};

// ─── HTTP client ─────────────────────────────────────────────────────────────

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

const buildEndpoints = (overrides: AuthConfig['endpoints'] = {}) => ({
  login: overrides.login ?? '/auth/login',
  register: overrides.register ?? '/auth/register',
  logout: overrides.logout ?? '/auth/logout',
  refresh: overrides.refresh ?? '/auth/refresh',
  forgotPassword: overrides.forgotPassword ?? '/auth/forgot-password',
});

async function request<T>(
  baseURL: string,
  path: string,
  options: RequestInit,
  accessToken?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${baseURL}${path}`, { ...options, headers });

  let body: ApiResponse<T>;
  try {
    body = await response.json();
  } catch {
    throw new Error(`Server error: ${response.status}`);
  }

  if (!response.ok) {
    throw new Error((body as { message?: string }).message ?? `Request failed: ${response.status}`);
  }

  return (body as ApiResponse<T>).data ?? (body as unknown as T);
}

// ─── Auth API factory ────────────────────────────────────────────────────────

export const createAuthApi = (config: AuthConfig) => {
  const { baseURL, endpoints: endpointOverrides } = config;
  const ep = buildEndpoints(endpointOverrides);

  return {
    login: (email: string, password: string) =>
      request<LoginResponse>(baseURL, ep.login, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (name: string, email: string, password: string) =>
      request<RegisterResponse>(baseURL, ep.register, {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),

    logout: (accessToken: string) =>
      request<void>(baseURL, ep.logout, { method: 'POST' }, accessToken),

    refresh: (refreshToken: string) =>
      request<RefreshResponse>(baseURL, ep.refresh, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),

    forgotPassword: (email: string) =>
      request<void>(baseURL, ep.forgotPassword, {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
  };
};

export type AuthApi = ReturnType<typeof createAuthApi>;

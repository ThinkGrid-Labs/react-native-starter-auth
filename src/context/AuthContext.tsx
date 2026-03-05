import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {
  AuthConfig,
  AuthContextValue,
  AuthState,
  User,
} from '../types/auth';
import {
  clearStoredTokens,
  createAuthApi,
  getStoredTokens,
  storeTokens,
} from '../services/authService';

// ─── State & reducer ─────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type Action =
  | { type: 'RESTORE_SESSION'; user: User; accessToken: string; refreshToken?: string }
  | { type: 'LOGIN_SUCCESS'; user: User; accessToken: string; refreshToken?: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; isLoading: boolean };

function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'RESTORE_SESSION':
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.user,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken ?? null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'SET_ERROR':
      return { ...state, error: action.error, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: React.ReactNode;
  /**
   * Auth API configuration. Pass your backend baseURL here.
   *
   * @example
   * <AuthProvider config={{ baseURL: 'https://api.myapp.com' }}>
   */
  config: AuthConfig;
}

export const AuthProvider = ({ children, config }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const api = useMemo(() => createAuthApi(config), [config]);
  const keychainService = config.keychainService;

  // Restore persisted session from Keychain on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const tokens = await getStoredTokens(keychainService);
        if (!tokens) {
          dispatch({ type: 'SET_LOADING', isLoading: false });
          return;
        }

        // Attempt silent token refresh if refreshToken exists
        if (tokens.refreshToken) {
          try {
            const refreshed = await api.refresh(tokens.refreshToken);
            const newTokens = {
              accessToken: refreshed.accessToken,
              refreshToken: refreshed.refreshToken ?? tokens.refreshToken,
            };
            await storeTokens(newTokens, keychainService);

            // We have valid tokens but no cached user — re-fetch or use stored
            // For now, mark as authenticated so app can re-fetch profile
            dispatch({
              type: 'RESTORE_SESSION',
              user: { id: '', email: '' }, // app should fetch profile on Home screen
              accessToken: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
            });
            return;
          } catch {
            // Refresh failed — treat as logged out
          }
        }

        await clearStoredTokens(keychainService);
        dispatch({ type: 'SET_LOADING', isLoading: false });
      } catch {
        dispatch({ type: 'SET_LOADING', isLoading: false });
      }
    };

    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch({ type: 'SET_LOADING', isLoading: true });
      try {
        const { user, accessToken, refreshToken } = await api.login(email, password);
        await storeTokens({ accessToken, refreshToken }, keychainService);
        dispatch({ type: 'LOGIN_SUCCESS', user, accessToken, refreshToken });
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          error: err instanceof Error ? err.message : 'Login failed.',
        });
      }
    },
    [api, keychainService],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      dispatch({ type: 'SET_LOADING', isLoading: true });
      try {
        const { user, accessToken, refreshToken } = await api.register(name, email, password);
        await storeTokens({ accessToken, refreshToken }, keychainService);
        dispatch({ type: 'LOGIN_SUCCESS', user, accessToken, refreshToken });
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          error: err instanceof Error ? err.message : 'Registration failed.',
        });
      }
    },
    [api, keychainService],
  );

  const logout = useCallback(async () => {
    try {
      if (state.accessToken) {
        await api.logout(state.accessToken).catch(() => {/* best-effort */});
      }
    } finally {
      await clearStoredTokens(keychainService);
      dispatch({ type: 'LOGOUT' });
    }
  }, [api, keychainService, state.accessToken]);

  const forgotPassword = useCallback(
    async (email: string) => {
      dispatch({ type: 'SET_LOADING', isLoading: true });
      try {
        await api.forgotPassword(email);
        dispatch({ type: 'SET_LOADING', isLoading: false });
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          error: err instanceof Error ? err.message : 'Failed to send reset email.',
        });
      }
    },
    [api],
  );

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, register, logout, forgotPassword, clearError }),
    [state, login, register, logout, forgotPassword, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
};

export default AuthProvider;

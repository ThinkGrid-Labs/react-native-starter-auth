// Context & hook
export { AuthProvider, useAuth } from './context/AuthContext';

// Types
export type {
  AuthConfig,
  AuthContextValue,
  AuthState,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  User,
} from './types/auth';

// Secure storage helpers (for advanced use — e.g. attaching token to your own API calls)
export {
  clearStoredTokens,
  createAuthApi,
  getStoredTokens,
  storeTokens,
} from './services/authService';

// Ready-made screens
export { default as LoginScreen } from './screens/Login/Login';
export { default as RegisterScreen } from './screens/Register/Register';
export { default as ForgotPasswordScreen } from './screens/ForgotPassword/ForgotPassword';
export { default as HomeScreen } from './screens/Home/Home';
export { default as StartupScreen } from './screens/Startup/Startup';

// Ready-made navigators
export { default as AuthNavigator } from './navigators/AuthNavigator';
export { default as MainNavigator } from './navigators/Main';
export { default as ApplicationNavigator } from './navigators/Application';

// Reusable UI components
export { default as Brand } from './components/Brand/Brand';
export { default as Button } from './components/Button/Button';
export { default as Input } from './components/Input/Input';

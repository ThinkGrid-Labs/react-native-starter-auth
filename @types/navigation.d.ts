import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

// ─── Auth stack (unauthenticated) ────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;

// ─── Main stack (authenticated) ──────────────────────────────────────────────

export type MainParamsList = {
  Home: undefined;
};

export type MainScreenProps<T extends keyof MainParamsList> =
  StackScreenProps<MainParamsList, T>;

// ─── Root application stack ───────────────────────────────────────────────────

export type ApplicationStackParamList = {
  Startup: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainParamsList>;
};

export type ApplicationScreenProps =
  StackScreenProps<ApplicationStackParamList>;

# @think-grid-labs/react-native-starter-auth

A reusable React Native authentication library — drop complete Login, Register, and Forgot Password flows into any project. Tokens stored securely in the device Keychain. Zero Redux.

---

## Install

```bash
npm install @think-grid-labs/react-native-starter-auth
# or
yarn add @think-grid-labs/react-native-starter-auth
```

### Peer dependencies

Install these in your project if you don't have them already:

```bash
yarn add react-native-keychain \
         @react-navigation/native \
         @react-navigation/stack \
         react-native-gesture-handler \
         react-native-reanimated \
         react-native-screens \
         react-native-safe-area-context \
         @react-native-masked-view/masked-view
```

```bash
# iOS
cd ios && pod install
```

---

## Quickstart

Wrap your root component with `AuthProvider`, then drop in `ApplicationNavigator`:

```tsx
// App.tsx
import React from 'react';
import { AuthProvider, ApplicationNavigator } from '@think-grid-labs/react-native-starter-auth';

export default function App() {
  return (
    <AuthProvider config={{ baseURL: 'https://api.yourapp.com' }}>
      <ApplicationNavigator />
    </AuthProvider>
  );
}
```

On launch the library will:
- Show a splash screen while checking the Keychain for a saved session
- Silently refresh the access token if a refresh token exists
- Navigate to **Login** (no session) or your **Home** screen (valid session)

---

## Using your own navigator

If you have an existing `NavigationContainer`, skip `ApplicationNavigator` and use the sub-navigators directly:

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthNavigator, useAuth } from '@think-grid-labs/react-native-starter-auth';
import MyAppNavigator from './MyAppNavigator'; // your protected screens

const Root = createStackNavigator();

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // or your own splash

  return (
    <Root.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated
        ? <Root.Screen name="App" component={MyAppNavigator} />
        : <Root.Screen name="Auth" component={AuthNavigator} />
      }
    </Root.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider config={{ baseURL: 'https://api.yourapp.com' }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
```

---

## Using individual screens

Mount only the screens you need inside your own stack:

```tsx
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '@think-grid-labs/react-native-starter-auth';

<Stack.Screen name="Login" component={LoginScreen} />
<Stack.Screen name="Register" component={RegisterScreen} />
<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
```

---

## `useAuth` hook

Access auth state and actions anywhere inside `<AuthProvider>`:

```tsx
import { useAuth } from '@think-grid-labs/react-native-starter-auth';

function ProfileScreen() {
  const {
    user,            // { id, email, name, ... } | null
    accessToken,     // string | null
    isAuthenticated, // boolean
    isLoading,       // boolean
    error,           // string | null
    login,           // (email, password) => Promise<void>
    register,        // (name, email, password) => Promise<void>
    logout,          // () => Promise<void>
    forgotPassword,  // (email) => Promise<void>
    clearError,      // () => void
  } = useAuth();
}
```

### Attaching the token to your own API calls

```tsx
const { accessToken } = useAuth();

const fetchOrders = () =>
  fetch('https://api.yourapp.com/orders', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
```

---

## Configuration

### `AuthProvider` config

| Option | Type | Default | Description |
|---|---|---|---|
| `baseURL` | `string` | — | **Required.** Your API base URL |
| `endpoints.login` | `string` | `/auth/login` | POST — sign in |
| `endpoints.register` | `string` | `/auth/register` | POST — sign up |
| `endpoints.logout` | `string` | `/auth/logout` | POST — sign out |
| `endpoints.refresh` | `string` | `/auth/refresh` | POST — refresh access token |
| `endpoints.forgotPassword` | `string` | `/auth/forgot-password` | POST — send reset email |
| `keychainService` | `string` | `rn_starter_auth` | Keychain namespace (useful for multi-tenant apps) |

```tsx
<AuthProvider
  config={{
    baseURL: 'https://api.yourapp.com',
    endpoints: {
      login: '/v1/users/sign-in',
      register: '/v1/users/sign-up',
      refresh: '/v1/tokens/refresh',
    },
    keychainService: 'com.yourapp.auth',
  }}
>
```

---

## Expected API response shape

Every endpoint must return JSON with a `data` wrapper:

**POST `/auth/login`** and **POST `/auth/register`**
```json
{
  "data": {
    "user": { "id": "abc", "email": "jane@example.com", "name": "Jane" },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

**POST `/auth/refresh`**
```json
{
  "data": { "accessToken": "eyJ...", "refreshToken": "eyJ..." }
}
```

**POST `/auth/logout`** and **POST `/auth/forgot-password`**
```json
{ "data": null }
```

> If your API uses a different wrapper (e.g. `{ result: ... }`), edit the `request()` function in `src/services/authService.ts`.

---

## Reusable UI components

```tsx
import { Input, Button } from '@think-grid-labs/react-native-starter-auth';

<Input
  label="Email"
  placeholder="you@example.com"
  keyboardType="email-address"
  value={email}
  onChangeText={setEmail}
  error={emailError}        // shows red border + message below
/>

<Input
  label="Password"
  secureTextEntry           // adds show/hide toggle automatically
  value={password}
  onChangeText={setPassword}
/>

<Button title="Sign In" onPress={handleLogin} loading={isLoading} />
<Button title="Back" variant="ghost" onPress={goBack} />
```

---

## Full exports

```ts
// Core
AuthProvider              // wrap your app
useAuth                   // hook

// Navigators
ApplicationNavigator      // all-in-one: Startup → Auth | Main
AuthNavigator             // Login / Register / ForgotPassword stack
MainNavigator             // Home stack

// Screens
LoginScreen
RegisterScreen
ForgotPasswordScreen
HomeScreen
StartupScreen             // splash + session restore

// UI
Input
Button
Brand

// Advanced — Keychain helpers & API factory
storeTokens               // (tokens, service?) => Promise<void>
getStoredTokens           // (service?) => Promise<AuthTokens | null>
clearStoredTokens         // (service?) => Promise<void>
createAuthApi             // (config: AuthConfig) => { login, register, logout, refresh, forgotPassword }

// Types
AuthConfig
AuthContextValue
AuthState
AuthTokens
User
```

---

## Security

| What | Storage |
|---|---|
| `accessToken` | iOS Keychain (Secure Enclave) / Android Keystore |
| `refreshToken` | Same — never AsyncStorage |
| Password | Never stored — only transmitted over HTTPS |

---

## License

MIT

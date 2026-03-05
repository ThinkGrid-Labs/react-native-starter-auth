# Example App — @think-grid-labs/react-native-starter-auth

This app demonstrates all integration patterns for the library.

## Running the example

```bash
cd example

yarn install
cd ios && pod install && cd ..

yarn ios
# or
yarn android
```

## Switching demos

Open [src/App.tsx](src/App.tsx) and change the `DEMO` constant:

| Value | What it shows |
|---|---|
| `'drop-in'` | `AuthProvider` + `ApplicationNavigator` — full auth in 5 lines |
| `'custom-nav'` | `AuthNavigator` inside your own `NavigationContainer` |
| `'individual-screens'` | `LoginScreen`, `RegisterScreen`, `ForgotPasswordScreen` in a custom stack |
| `'components'` | `Input` and `Button` components in isolation |

## Backend

Change `AUTH_CONFIG.baseURL` in `src/App.tsx` to point at your own API.
See the [main README](../README.md#expected-api-response-shape) for the expected request/response format.

import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { AuthProvider } from '../context/AuthContext';
import * as Keychain from 'react-native-keychain';

export const TEST_CONFIG = { baseURL: 'https://api.test.com' };

export const TEST_USER = { id: 'u1', email: 'jane@test.com', name: 'Jane' };
export const TEST_TOKENS = { accessToken: 'access-abc', refreshToken: 'refresh-xyz' };

/** Simulate a valid Keychain session + successful silent refresh */
export const mockStoredSession = () => {
  (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
    username: 'auth_tokens',
    password: JSON.stringify(TEST_TOKENS),
  });
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        data: { accessToken: 'refreshed-access', refreshToken: 'refreshed-refresh' },
      }),
  });
};

/** Simulate a successful login/register API response */
export const mockAuthSuccess = () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        data: { user: TEST_USER, ...TEST_TOKENS },
      }),
  });
};

/** Simulate an API error response */
export const mockAuthError = (message = 'Invalid credentials') => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    json: () => Promise.resolve({ message }),
  });
};

interface WrapperOptions extends RenderOptions {
  /** Pre-seed auth state (sets keychain + mocks refresh) */
  authenticated?: boolean;
}

export const renderWithAuth = (ui: React.ReactElement, options: WrapperOptions = {}) => {
  const { authenticated = false, ...rest } = options;
  if (authenticated) mockStoredSession();
  return render(
    <AuthProvider config={TEST_CONFIG}>{ui}</AuthProvider>,
    rest,
  );
};

/** Mock navigation prop for screens that receive it directly */
export const mockNavigation = () => ({
  navigate: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
  dispatch: jest.fn(),
});

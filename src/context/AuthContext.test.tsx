import React from 'react';
import { Text } from 'react-native';
import { act, render, screen, waitFor } from '@testing-library/react-native';
import * as Keychain from 'react-native-keychain';
import { AuthProvider, useAuth } from './AuthContext';
import {
  mockAuthError,
  mockAuthSuccess,
  mockStoredSession,
  TEST_CONFIG,
  TEST_TOKENS,
} from '../__tests__/test-utils';

// ─── Helper: renders a component that exposes auth state via text ─────────────

const AuthStateDisplay = () => {
  const { isAuthenticated, isLoading, error, user, accessToken } = useAuth();
  return (
    <>
      <Text testID="loading">{String(isLoading)}</Text>
      <Text testID="authenticated">{String(isAuthenticated)}</Text>
      <Text testID="error">{error ?? ''}</Text>
      <Text testID="user">{user?.email ?? ''}</Text>
      <Text testID="token">{accessToken ?? ''}</Text>
    </>
  );
};

const AuthActionsDisplay = () => {
  const { login, register, logout, forgotPassword, clearError, isLoading, error } = useAuth();
  return (
    <>
      <Text testID="loading">{String(isLoading)}</Text>
      <Text testID="error">{error ?? ''}</Text>
      <Text testID="login-btn" onPress={() => login('a@b.com', 'pass')} />
      <Text testID="register-btn" onPress={() => register('Alice', 'a@b.com', 'pass123')} />
      <Text testID="logout-btn" onPress={() => logout()} />
      <Text testID="forgot-btn" onPress={() => forgotPassword('a@b.com')} />
      <Text testID="clear-btn" onPress={() => clearError()} />
    </>
  );
};

const wrap = (ui: React.ReactElement) =>
  render(<AuthProvider config={TEST_CONFIG}>{ui}</AuthProvider>);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AuthProvider — initial state', () => {
  it('starts with isLoading true, not authenticated', async () => {
    wrap(<AuthStateDisplay />);
    expect(screen.getByTestId('loading').props.children).toBe('true');
    // Flush deferred effects + async session restore (no stored tokens → loading: false)
    await act(async () => {});
    expect(screen.getByTestId('loading').props.children).toBe('false');
    expect(screen.getByTestId('authenticated').props.children).toBe('false');
  });
});

describe('AuthProvider — session restore', () => {
  it('restores session from Keychain + silent refresh on mount', async () => {
    mockStoredSession();
    wrap(<AuthStateDisplay />);
    await waitFor(() => expect(screen.getByTestId('authenticated').props.children).toBe('true'));
    expect(screen.getByTestId('token').props.children).toBe('refreshed-access');
  });

  it('logs out when refresh token is invalid', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
      username: 'auth_tokens',
      password: JSON.stringify(TEST_TOKENS),
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Expired' }),
    });

    wrap(<AuthStateDisplay />);
    await waitFor(() => expect(screen.getByTestId('authenticated').props.children).toBe('false'));
    expect(Keychain.resetGenericPassword).toHaveBeenCalled();
  });
});

describe('AuthProvider — login', () => {
  it('sets isAuthenticated and stores tokens on success', async () => {
    mockAuthSuccess();
    wrap(<AuthActionsDisplay />);
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    await act(async () => {
      screen.getByTestId('login-btn').props.onPress();
    });

    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
      'auth_tokens',
      JSON.stringify({
        accessToken: TEST_TOKENS.accessToken,
        refreshToken: TEST_TOKENS.refreshToken,
      }),
      expect.any(Object),
    );
  });

  it('sets error on login failure', async () => {
    mockAuthError('Invalid credentials');
    wrap(<AuthActionsDisplay />);
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    await act(async () => {
      screen.getByTestId('login-btn').props.onPress();
    });

    await waitFor(() =>
      expect(screen.getByTestId('error').props.children).toBe('Invalid credentials'),
    );
  });
});

describe('AuthProvider — register', () => {
  it('sets isAuthenticated on success', async () => {
    mockAuthSuccess();
    wrap(<AuthActionsDisplay />);
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    await act(async () => {
      screen.getByTestId('register-btn').props.onPress();
    });

    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));
    expect(Keychain.setGenericPassword).toHaveBeenCalled();
  });

  it('sets error on register failure', async () => {
    mockAuthError('Email already in use');
    wrap(<AuthActionsDisplay />);
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    await act(async () => {
      screen.getByTestId('register-btn').props.onPress();
    });

    await waitFor(() =>
      expect(screen.getByTestId('error').props.children).toBe('Email already in use'),
    );
  });
});

describe('AuthProvider — logout', () => {
  it('clears Keychain and sets isAuthenticated false', async () => {
    mockAuthSuccess();
    wrap(<AuthActionsDisplay />);
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    // Login first
    await act(async () => {
      screen.getByTestId('login-btn').props.onPress();
    });
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    // Then logout — best-effort logout call will fail (fetch not re-mocked), that's OK
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: null }),
    });
    await act(async () => {
      screen.getByTestId('logout-btn').props.onPress();
    });

    await waitFor(() => expect(Keychain.resetGenericPassword).toHaveBeenCalled());
  });
});

describe('AuthProvider — forgotPassword', () => {
  it('resolves without error on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: null }),
    });
    wrap(<AuthActionsDisplay />);
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    await act(async () => {
      screen.getByTestId('forgot-btn').props.onPress();
    });
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));
    expect(screen.getByTestId('error').props.children).toBe('');
  });

  it('sets error on failure', async () => {
    mockAuthError('Email not found');
    wrap(<AuthActionsDisplay />);
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    await act(async () => {
      screen.getByTestId('forgot-btn').props.onPress();
    });
    await waitFor(() => expect(screen.getByTestId('error').props.children).toBe('Email not found'));
  });
});

describe('AuthProvider — clearError', () => {
  it('clears the error message', async () => {
    mockAuthError('Bad request');
    wrap(<AuthActionsDisplay />);
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    await act(async () => {
      screen.getByTestId('login-btn').props.onPress();
    });
    await waitFor(() => expect(screen.getByTestId('error').props.children).toBe('Bad request'));

    await act(async () => {
      screen.getByTestId('clear-btn').props.onPress();
    });
    expect(screen.getByTestId('error').props.children).toBe('');
  });
});

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const BadComponent = () => {
      useAuth();
      return null;
    };
    expect(() => render(<BadComponent />)).toThrow('useAuth must be used inside <AuthProvider>');
    consoleError.mockRestore();
  });
});

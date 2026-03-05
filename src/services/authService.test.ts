import * as Keychain from 'react-native-keychain';
import { clearStoredTokens, createAuthApi, getStoredTokens, storeTokens } from './authService';

const SERVICE = 'test_service';
const TOKENS = { accessToken: 'acc', refreshToken: 'ref' };

// ─── Keychain helpers ─────────────────────────────────────────────────────────

describe('storeTokens', () => {
  it('calls Keychain.setGenericPassword with serialised tokens', async () => {
    await storeTokens(TOKENS, SERVICE);
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
      'auth_tokens',
      JSON.stringify(TOKENS),
      { service: SERVICE },
    );
  });

  it('uses default service when none provided', async () => {
    await storeTokens(TOKENS);
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith('auth_tokens', expect.any(String), {
      service: 'rn_starter_auth',
    });
  });
});

describe('getStoredTokens', () => {
  it('returns null when no credentials stored', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);
    const result = await getStoredTokens(SERVICE);
    expect(result).toBeNull();
  });

  it('parses and returns stored tokens', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
      username: 'auth_tokens',
      password: JSON.stringify(TOKENS),
    });
    const result = await getStoredTokens(SERVICE);
    expect(result).toEqual(TOKENS);
  });

  it('returns null when stored value is malformed JSON', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
      username: 'auth_tokens',
      password: 'not-json{{{',
    });
    const result = await getStoredTokens(SERVICE);
    expect(result).toBeNull();
  });
});

describe('clearStoredTokens', () => {
  it('calls Keychain.resetGenericPassword with the service', async () => {
    await clearStoredTokens(SERVICE);
    expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({ service: SERVICE });
  });
});

// ─── createAuthApi ────────────────────────────────────────────────────────────

const BASE_URL = 'https://api.test.com';

const mockFetchOk = (data: unknown) => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data }),
  });
};

const mockFetchError = (message: string, status = 400) => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ message }),
  });
};

describe('createAuthApi', () => {
  const api = createAuthApi({ baseURL: BASE_URL });

  describe('login', () => {
    it('POSTs to /auth/login and returns response data', async () => {
      const payload = {
        user: { id: '1', email: 'a@b.com' },
        accessToken: 'tok',
        refreshToken: 'ref',
      };
      mockFetchOk(payload);
      const result = await api.login('a@b.com', 'pass');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/auth/login`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'a@b.com', password: 'pass' }),
        }),
      );
      expect(result).toEqual(payload);
    });

    it('throws with server message on failure', async () => {
      mockFetchError('Invalid credentials');
      await expect(api.login('a@b.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('POSTs to /auth/register', async () => {
      mockFetchOk({ user: { id: '2', email: 'b@c.com' }, accessToken: 'tok' });
      await api.register('Bob', 'b@c.com', 'password123');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/auth/register`,
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  describe('logout', () => {
    it('POSTs to /auth/logout with Authorization header', async () => {
      mockFetchOk(null);
      await api.logout('my-token');
      const [, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(options.headers.Authorization).toBe('Bearer my-token');
    });
  });

  describe('refresh', () => {
    it('POSTs to /auth/refresh with refresh token in body', async () => {
      mockFetchOk({ accessToken: 'new', refreshToken: 'new-ref' });
      await api.refresh('old-refresh');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/auth/refresh`,
        expect.objectContaining({ body: JSON.stringify({ refreshToken: 'old-refresh' }) }),
      );
    });
  });

  describe('forgotPassword', () => {
    it('POSTs to /auth/forgot-password', async () => {
      mockFetchOk(null);
      await api.forgotPassword('a@b.com');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/auth/forgot-password`,
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'a@b.com' }) }),
      );
    });
  });

  describe('custom endpoints', () => {
    it('uses overridden endpoint paths', async () => {
      const customApi = createAuthApi({
        baseURL: BASE_URL,
        endpoints: { login: '/v2/sign-in' },
      });
      mockFetchOk({ user: { id: '1', email: 'a@b.com' }, accessToken: 'tok' });
      await customApi.login('a@b.com', 'pass');
      expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/v2/sign-in`, expect.anything());
    });
  });
});

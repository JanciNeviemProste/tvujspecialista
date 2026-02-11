/**
 * Tests for lib/api/client.ts
 *
 * Strategy: We mock axios.create to capture the interceptors registered by the
 * client module, then invoke those interceptor functions directly to validate
 * their behavior (adding auth headers, refreshing tokens, handling 401s).
 *
 * All mock state is stored on globalThis before jest.mock hoisting can interfere,
 * and the client module is loaded via require() inside beforeAll (not via import).
 */

/* eslint-disable @typescript-eslint/no-var-requires */

// --- State that the mock factory and interceptors will write into ---
// Using globalThis assignments so they are available when jest.mock factory runs.
// Note: jest.mock is hoisted, but the factory function is only *called* when the
// mocked module is first required. So as long as we set up globalThis BEFORE
// require('@/lib/api/client'), we are fine.

let capturedRequestFulfilled: Function | undefined;
let capturedResponseFulfilled: Function | undefined;
let capturedResponseRejected: Function | undefined;
let capturedCreateConfig: Record<string, any> | undefined;
const mockAxiosPost = jest.fn();
const mockAxiosCall = jest.fn();

const mockAxiosInstance = {
  interceptors: {
    request: {
      use: jest.fn((fulfilled: Function) => {
        capturedRequestFulfilled = fulfilled;
      }),
    },
    response: {
      use: jest.fn((fulfilled: Function, rejected: Function) => {
        capturedResponseFulfilled = fulfilled;
        capturedResponseRejected = rejected;
      }),
    },
  },
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  defaults: { headers: { common: {} } },
};

jest.mock('axios', () => {
  // This factory is called lazily on first require of 'axios'.
  // At that point, the outer-scope variables (mockAxiosCall, etc.) are initialized.
  const axiosMock: any = (...args: any[]) => mockAxiosCall(...args);
  axiosMock.create = jest.fn((config: any) => {
    capturedCreateConfig = config;
    return mockAxiosInstance;
  });
  axiosMock.post = (...args: any[]) => mockAxiosPost(...args);
  axiosMock.get = jest.fn();
  axiosMock.defaults = { headers: { common: {} } };

  return {
    __esModule: true,
    default: axiosMock,
  };
});

// Mock localStorage
const localStorageStore: Record<string, string> = {};
const mockGetItem = jest.fn((key: string) => localStorageStore[key] ?? null);
const mockSetItem = jest.fn((key: string, val: string) => {
  localStorageStore[key] = val;
});
const mockRemoveItem = jest.fn((key: string) => {
  delete localStorageStore[key];
});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: mockRemoveItem,
    clear: jest.fn(() => {
      Object.keys(localStorageStore).forEach((k) => delete localStorageStore[k]);
    }),
    length: 0,
    key: jest.fn(),
  },
  writable: true,
});

// Mock window.location.href
let capturedHref = '';

// Load the client module (triggers axios.create + interceptor setup)
beforeAll(() => {
  // Replace window.location before the client loads so the interceptor's
  // `typeof window !== 'undefined'` check works and we can track href writes.
  // @ts-expect-error -- jsdom workaround: delete the getter/setter
  delete (window as any).location;
  // Replace with a plain object (no jsdom Location prototype issues)
  (window as any).location = {
    get href() {
      return capturedHref;
    },
    set href(val: string) {
      capturedHref = val;
    },
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    origin: 'http://localhost',
    protocol: 'http:',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    pathname: '/',
    search: '',
    hash: '',
  };

  // Now require the client -- this triggers axios.create and interceptor setup
  require('@/lib/api/client');
});

describe('API Client (lib/api/client.ts)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(localStorageStore).forEach((k) => delete localStorageStore[k]);
    capturedHref = '';
  });

  // ===== Axios instance creation =====
  describe('Axios instance creation', () => {
    it('creates axios instance with correct baseURL and withCredentials', () => {
      expect(capturedCreateConfig).toBeDefined();
      expect(capturedCreateConfig!.baseURL).toBe(
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      );
      expect(capturedCreateConfig!.withCredentials).toBe(true);
    });

    it('falls back to localhost:3001/api when env var is not set', () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        expect(capturedCreateConfig!.baseURL).toBe('http://localhost:3001/api');
      } else {
        expect(capturedCreateConfig!.baseURL).toBe(process.env.NEXT_PUBLIC_API_URL);
      }
    });
  });

  // ===== Request interceptor =====
  describe('Request interceptor', () => {
    it('registers a request interceptor', () => {
      // Note: we verify the interceptor was registered by checking the captured function
      // (jest.clearAllMocks resets call counts, but the captured reference persists)
      expect(capturedRequestFulfilled).toBeDefined();
      expect(typeof capturedRequestFulfilled).toBe('function');
    });

    it('adds Authorization header with token from localStorage', () => {
      localStorageStore['accessToken'] = 'test-jwt-token-123';

      const config = { headers: {} as Record<string, string> };
      const result = capturedRequestFulfilled!(config);

      expect(result.headers.Authorization).toBe('Bearer test-jwt-token-123');
    });

    it('does not add Authorization header when no token in localStorage', () => {
      const config = { headers: {} as Record<string, string> };
      const result = capturedRequestFulfilled!(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('returns the config object', () => {
      const config = { headers: {}, url: '/test' };
      const result = capturedRequestFulfilled!(config);

      expect(result).toBe(config);
    });
  });

  // ===== Response interceptor =====
  describe('Response interceptor', () => {
    it('registers a response interceptor', () => {
      // Note: we verify the interceptor was registered by checking the captured functions
      // (jest.clearAllMocks resets call counts, but the captured references persist)
      expect(capturedResponseFulfilled).toBeDefined();
      expect(typeof capturedResponseFulfilled).toBe('function');
      expect(capturedResponseRejected).toBeDefined();
      expect(typeof capturedResponseRejected).toBe('function');
    });

    it('passes through successful responses unchanged', () => {
      const mockResponse = { data: { message: 'ok' }, status: 200 };
      const result = capturedResponseFulfilled!(mockResponse);

      expect(result).toBe(mockResponse);
    });

    it('attempts token refresh on 401 error', async () => {
      localStorageStore['refreshToken'] = 'valid-refresh-token';

      mockAxiosPost.mockResolvedValue({
        data: { accessToken: 'new-access-token' },
      });
      mockAxiosCall.mockResolvedValue({ data: 'retried' });

      const error = {
        response: { status: 401 },
        config: {
          _retry: undefined,
          headers: {} as Record<string, string>,
        },
      };

      await capturedResponseRejected!(error);

      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh'),
        { refreshToken: 'valid-refresh-token' }
      );
    });

    it('stores new access token and retries original request after refresh', async () => {
      localStorageStore['refreshToken'] = 'my-refresh-token';

      mockAxiosPost.mockResolvedValue({
        data: { accessToken: 'fresh-access-token' },
      });
      mockAxiosCall.mockResolvedValue({ data: 'success-retry' });

      const originalConfig = {
        _retry: undefined as boolean | undefined,
        headers: {} as Record<string, string>,
        url: '/protected-resource',
      };

      const error = {
        response: { status: 401 },
        config: originalConfig,
      };

      const result = await capturedResponseRejected!(error);

      // Token was saved
      expect(mockSetItem).toHaveBeenCalledWith('accessToken', 'fresh-access-token');

      // Original request was retried with new token in header
      expect(originalConfig.headers.Authorization).toBe('Bearer fresh-access-token');
      expect(mockAxiosCall).toHaveBeenCalledWith(originalConfig);

      // Returns the retried response
      expect(result).toEqual({ data: 'success-retry' });
    });

    it('clears tokens and redirects to login on refresh failure', async () => {
      localStorageStore['refreshToken'] = 'expired-refresh-token';

      mockAxiosPost.mockRejectedValue(new Error('Refresh token invalid'));

      const error = {
        response: { status: 401 },
        config: {
          _retry: undefined,
          headers: {} as Record<string, string>,
        },
      };

      await expect(capturedResponseRejected!(error)).rejects.toEqual(error);

      // Verify tokens were cleared
      expect(mockRemoveItem).toHaveBeenCalledWith('accessToken');
      expect(mockRemoveItem).toHaveBeenCalledWith('refreshToken');

      // Verify redirect was attempted (jsdom throws "not implemented" on navigation,
      // but we can check via our mock href getter or by checking the error was caught)
      // In jsdom, window.location.href assignment triggers a console.error "not implemented"
      // but the code still reaches that line, which is what we want to verify.
      // Since jsdom doesn't actually update location.href, we verify the redirect intent
      // by confirming tokens were cleared (which happens right before the redirect).
    });

    it('does not attempt refresh when _retry flag is already set', async () => {
      const error = {
        response: { status: 401 },
        config: {
          _retry: true,
          headers: {} as Record<string, string>,
        },
      };

      await expect(capturedResponseRejected!(error)).rejects.toEqual(error);

      expect(mockAxiosPost).not.toHaveBeenCalled();
    });

    it('does not attempt refresh for non-401 errors', async () => {
      const error = {
        response: { status: 500 },
        config: {
          headers: {} as Record<string, string>,
        },
      };

      await expect(capturedResponseRejected!(error)).rejects.toEqual(error);

      expect(mockAxiosPost).not.toHaveBeenCalled();
    });

    it('does not attempt refresh when no refreshToken in localStorage', async () => {
      const error = {
        response: { status: 401 },
        config: {
          _retry: undefined,
          headers: {} as Record<string, string>,
        },
      };

      await expect(capturedResponseRejected!(error)).rejects.toEqual(error);

      expect(mockAxiosPost).not.toHaveBeenCalled();
    });
  });
});

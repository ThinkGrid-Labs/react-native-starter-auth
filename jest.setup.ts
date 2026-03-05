import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// react-native preset's setup.js calls jest.useFakeTimers() in setupFiles.
// Override it here (setupFilesAfterEnv runs after) so waitFor works correctly.
jest.useRealTimers();

// Reanimated mock
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Animated native driver
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Keychain — default to no stored credentials; override per test
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue(false),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
}));

// Global fetch mock — override per test
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  // Default: no stored session
  const Keychain = require('react-native-keychain');
  Keychain.getGenericPassword.mockResolvedValue(false);
  // Default: fetch fails fast so tests that don't care don't hang
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    json: () => Promise.resolve({ message: 'Not mocked' }),
  });
});

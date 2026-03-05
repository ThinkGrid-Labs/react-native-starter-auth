import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import Login from './Login';
import {
  mockAuthError,
  mockAuthSuccess,
  mockNavigation,
  renderWithAuth,
} from '../../__tests__/test-utils';

const nav = mockNavigation();
const render = () => renderWithAuth(<Login navigation={nav as any} route={{} as any} />);

describe('Login screen', () => {
  describe('rendering', () => {
    it('renders email and password inputs', async () => {
      render();
      await waitFor(() => expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy());
      expect(screen.getByPlaceholderText('••••••••')).toBeTruthy();
    });

    it('renders Sign In button', async () => {
      render();
      await waitFor(() => expect(screen.getByText('Sign In')).toBeTruthy());
    });

    it('renders Sign Up and Forgot password links', async () => {
      render();
      await waitFor(() => {
        expect(screen.getByText('Sign Up')).toBeTruthy();
        expect(screen.getByText('Forgot password?')).toBeTruthy();
      });
    });
  });

  describe('client-side validation', () => {
    it('shows error when email is empty', async () => {
      render();
      await waitFor(() => screen.getByText('Sign In'));
      await act(async () => {
        fireEvent.press(screen.getByText('Sign In'));
      });
      expect(screen.getByText('Email is required.')).toBeTruthy();
    });

    it('shows error for invalid email format', async () => {
      render();
      await waitFor(() => screen.getByText('Sign In'));
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'not-an-email');
      await act(async () => {
        fireEvent.press(screen.getByText('Sign In'));
      });
      expect(screen.getByText('Enter a valid email address.')).toBeTruthy();
    });

    it('shows error when password is empty', async () => {
      render();
      await waitFor(() => screen.getByText('Sign In'));
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'a@b.com');
      await act(async () => {
        fireEvent.press(screen.getByText('Sign In'));
      });
      expect(screen.getByText('Password is required.')).toBeTruthy();
    });

    it('shows error when password is too short', async () => {
      render();
      await waitFor(() => screen.getByText('Sign In'));
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'a@b.com');
      fireEvent.changeText(screen.getByPlaceholderText('••••••••'), '12345');
      await act(async () => {
        fireEvent.press(screen.getByText('Sign In'));
      });
      expect(screen.getByText('Password must be at least 6 characters.')).toBeTruthy();
    });
  });

  describe('API interaction', () => {
    it('calls login with trimmed lowercase email on valid submit', async () => {
      mockAuthSuccess();
      render();
      await waitFor(() => screen.getByText('Sign In'));
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), '  A@B.COM  ');
      fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'password');
      await act(async () => {
        fireEvent.press(screen.getByText('Sign In'));
      });
      await waitFor(() =>
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/auth/login'),
          expect.objectContaining({
            body: JSON.stringify({ email: 'a@b.com', password: 'password' }),
          }),
        ),
      );
    });

    it('shows API error message on failure', async () => {
      mockAuthError('Wrong password');
      render();
      await waitFor(() => screen.getByText('Sign In'));
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'a@b.com');
      fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'wrongpass');
      await act(async () => {
        fireEvent.press(screen.getByText('Sign In'));
      });
      await waitFor(() => expect(screen.getByText('Wrong password')).toBeTruthy());
    });
  });

  describe('navigation', () => {
    it('navigates to Register when Sign Up is pressed', async () => {
      render();
      await waitFor(() => screen.getByText('Sign Up'));
      fireEvent.press(screen.getByText('Sign Up'));
      expect(nav.navigate).toHaveBeenCalledWith('Register');
    });

    it('navigates to ForgotPassword when link is pressed', async () => {
      render();
      await waitFor(() => screen.getByText('Forgot password?'));
      fireEvent.press(screen.getByText('Forgot password?'));
      expect(nav.navigate).toHaveBeenCalledWith('ForgotPassword');
    });
  });
});

import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import ForgotPassword from './ForgotPassword';
import { mockAuthError, mockNavigation, renderWithAuth } from '../../__tests__/test-utils';

const nav = mockNavigation();
const render = () =>
  renderWithAuth(<ForgotPassword navigation={nav as any} route={{} as any} />);

describe('ForgotPassword screen', () => {
  describe('rendering', () => {
    it('renders email input and Send button', async () => {
      render();
      await waitFor(() => expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy());
      expect(screen.getByText('Send Reset Link')).toBeTruthy();
    });

    it('renders Back to Sign In link', async () => {
      render();
      await waitFor(() => expect(screen.getByText('← Back to Sign In')).toBeTruthy());
    });
  });

  describe('validation', () => {
    it('shows error when email is empty', async () => {
      render();
      await waitFor(() => screen.getByText('Send Reset Link'));
      await act(async () => { fireEvent.press(screen.getByText('Send Reset Link')); });
      expect(screen.getByText('Email is required.')).toBeTruthy();
    });

    it('shows error for invalid email', async () => {
      render();
      await waitFor(() => screen.getByText('Send Reset Link'));
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'not-email');
      await act(async () => { fireEvent.press(screen.getByText('Send Reset Link')); });
      expect(screen.getByText('Enter a valid email address.')).toBeTruthy();
    });
  });

  describe('success state', () => {
    it('shows success message after email is sent', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: null }),
      });
      render();
      await waitFor(() => screen.getByText('Send Reset Link'));
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'jane@test.com');
      await act(async () => { fireEvent.press(screen.getByText('Send Reset Link')); });
      await waitFor(() => expect(screen.getByText('Check your email')).toBeTruthy());
      expect(screen.getByText('jane@test.com')).toBeTruthy();
    });

    it('navigates to Login from success state', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: null }),
      });
      render();
      await waitFor(() => screen.getByText('Send Reset Link'));
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'jane@test.com');
      await act(async () => { fireEvent.press(screen.getByText('Send Reset Link')); });
      await waitFor(() => screen.getByText('Back to Sign In'));
      fireEvent.press(screen.getByText('Back to Sign In'));
      expect(nav.navigate).toHaveBeenCalledWith('Login');
    });
  });

  describe('error state', () => {
    it('shows API error message', async () => {
      mockAuthError('Email not found');
      render();
      await waitFor(() => screen.getByText('Send Reset Link'));
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'jane@test.com');
      await act(async () => { fireEvent.press(screen.getByText('Send Reset Link')); });
      await waitFor(() => expect(screen.getByText('Email not found')).toBeTruthy());
    });
  });

  describe('navigation', () => {
    it('goes back when Back link is pressed', async () => {
      render();
      await waitFor(() => screen.getByText('← Back to Sign In'));
      fireEvent.press(screen.getByText('← Back to Sign In'));
      expect(nav.goBack).toHaveBeenCalled();
    });
  });
});

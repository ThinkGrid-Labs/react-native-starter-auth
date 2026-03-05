import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import Register from './Register';
import {
  mockAuthError,
  mockAuthSuccess,
  mockNavigation,
  renderWithAuth,
} from '../../__tests__/test-utils';

const nav = mockNavigation();
const render = () => renderWithAuth(<Register navigation={nav as any} route={{} as any} />);

const fillForm = (name = 'Alice', email = 'alice@test.com', password = 'password1', confirm = 'password1') => {
  fireEvent.changeText(screen.getByPlaceholderText('Jane Doe'), name);
  fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), email);
  // Two password fields: 'Min. 8 characters' and '••••••••'
  const inputs = screen.getAllByPlaceholderText('••••••••');
  fireEvent.changeText(screen.getByPlaceholderText('Min. 8 characters'), password);
  fireEvent.changeText(inputs[inputs.length - 1], confirm);
};

describe('Register screen', () => {
  describe('rendering', () => {
    it('renders all four input fields', async () => {
      render();
      await waitFor(() => screen.getByText('Create Account'));
      expect(screen.getByPlaceholderText('Jane Doe')).toBeTruthy();
      expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
      expect(screen.getByPlaceholderText('Min. 8 characters')).toBeTruthy();
    });

    it('renders Sign In link', async () => {
      render();
      await waitFor(() => expect(screen.getByText('Sign In')).toBeTruthy());
    });
  });

  describe('validation', () => {
    it('shows error when name is empty', async () => {
      render();
      await waitFor(() => screen.getByText('Create Account'));
      await act(async () => { fireEvent.press(screen.getByText('Create Account')); });
      expect(screen.getByText('Full name is required.')).toBeTruthy();
    });

    it('shows error for invalid email', async () => {
      render();
      await waitFor(() => screen.getByText('Create Account'));
      fireEvent.changeText(screen.getByPlaceholderText('Jane Doe'), 'Alice');
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'bad-email');
      await act(async () => { fireEvent.press(screen.getByText('Create Account')); });
      expect(screen.getByText('Enter a valid email address.')).toBeTruthy();
    });

    it('shows error when password is shorter than 8 chars', async () => {
      render();
      await waitFor(() => screen.getByText('Create Account'));
      fillForm('Alice', 'alice@test.com', 'short', 'short');
      await act(async () => { fireEvent.press(screen.getByText('Create Account')); });
      expect(screen.getByText('Password must be at least 8 characters.')).toBeTruthy();
    });

    it('shows error when passwords do not match', async () => {
      render();
      await waitFor(() => screen.getByText('Create Account'));
      fillForm('Alice', 'alice@test.com', 'password1', 'different1');
      await act(async () => { fireEvent.press(screen.getByText('Create Account')); });
      expect(screen.getByText('Passwords do not match.')).toBeTruthy();
    });
  });

  describe('API interaction', () => {
    it('calls register API on valid form submission', async () => {
      mockAuthSuccess();
      render();
      await waitFor(() => screen.getByText('Create Account'));
      fillForm();
      await act(async () => { fireEvent.press(screen.getByText('Create Account')); });
      await waitFor(() =>
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/auth/register'),
          expect.objectContaining({
            body: JSON.stringify({ name: 'Alice', email: 'alice@test.com', password: 'password1' }),
          }),
        ),
      );
    });

    it('shows API error on failure', async () => {
      mockAuthError('Email already in use');
      render();
      await waitFor(() => screen.getByText('Create Account'));
      fillForm();
      await act(async () => { fireEvent.press(screen.getByText('Create Account')); });
      await waitFor(() => expect(screen.getByText('Email already in use')).toBeTruthy());
    });
  });

  describe('navigation', () => {
    it('navigates to Login when Sign In link is pressed', async () => {
      render();
      await waitFor(() => screen.getByText('Sign In'));
      fireEvent.press(screen.getByText('Sign In'));
      expect(nav.navigate).toHaveBeenCalledWith('Login');
    });
  });
});

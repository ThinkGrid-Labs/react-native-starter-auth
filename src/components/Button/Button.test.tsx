import React from 'react';
import { ActivityIndicator } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button', () => {
  it('renders the title', () => {
    render(<Button title="Sign In" />);
    expect(screen.getByText('Sign In')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<Button title="Go" onPress={onPress} />);
    fireEvent.press(screen.getByText('Go'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button title="Go" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Go'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    render(<Button title="Loading..." onPress={onPress} loading />);
    fireEvent.press(screen.getByText('Loading...'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows ActivityIndicator when loading', () => {
    const { UNSAFE_getByType } = render(<Button title="Saving" loading />);
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('does not show ActivityIndicator when not loading', () => {
    const { UNSAFE_queryByType } = render(<Button title="Save" />);
    expect(UNSAFE_queryByType(ActivityIndicator)).toBeNull();
  });

  it('sets accessibility role to button', () => {
    render(<Button title="OK" />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('renders ghost variant without throwing', () => {
    render(<Button title="Cancel" variant="ghost" />);
    expect(screen.getByText('Cancel')).toBeTruthy();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Input from './Input';

describe('Input', () => {
  it('renders placeholder', () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('renders label text', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('renders error message and applies error border', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeTruthy();
  });

  it('does not render error text when error is undefined', () => {
    render(<Input />);
    expect(screen.queryByText('This field is required')).toBeNull();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    render(<Input placeholder="Type here" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByPlaceholderText('Type here'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  describe('secureTextEntry / password toggle', () => {
    it('shows toggle button when secureTextEntry is true', () => {
      render(<Input secureTextEntry placeholder="Password" />);
      expect(screen.getByText('Show')).toBeTruthy();
    });

    it('does not show toggle button when secureTextEntry is false', () => {
      render(<Input placeholder="Email" />);
      expect(screen.queryByText('Show')).toBeNull();
    });

    it('toggles between Show and Hide on press', () => {
      render(<Input secureTextEntry placeholder="Password" />);
      expect(screen.getByText('Show')).toBeTruthy();
      fireEvent.press(screen.getByText('Show'));
      expect(screen.getByText('Hide')).toBeTruthy();
      fireEvent.press(screen.getByText('Hide'));
      expect(screen.getByText('Show')).toBeTruthy();
    });

    it('starts with text hidden when secureTextEntry is set', () => {
      render(<Input secureTextEntry placeholder="Password" />);
      const input = screen.getByPlaceholderText('Password');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('reveals text after pressing Show', () => {
      render(<Input secureTextEntry placeholder="Password" />);
      fireEvent.press(screen.getByText('Show'));
      const input = screen.getByPlaceholderText('Password');
      expect(input.props.secureTextEntry).toBe(false);
    });
  });
});

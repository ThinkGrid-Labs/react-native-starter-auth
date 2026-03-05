import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Brand from './Brand';

test('renders with default dimensions', () => {
  render(<Brand />);
  const wrapper = screen.getByTestId('brand-img-wrapper');
  const img = screen.getByTestId('brand-img');
  expect(wrapper.props.style.height).toBe(200);
  expect(wrapper.props.style.width).toBe(200);
  expect(img.props.resizeMode).toBe('contain');
});

test('accepts custom height and width', () => {
  render(<Brand height={100} width={80} />);
  const wrapper = screen.getByTestId('brand-img-wrapper');
  expect(wrapper.props.style.height).toBe(100);
  expect(wrapper.props.style.width).toBe(80);
});

test('accepts custom resizeMode', () => {
  render(<Brand mode="cover" />);
  const img = screen.getByTestId('brand-img');
  expect(img.props.resizeMode).toBe('cover');
});

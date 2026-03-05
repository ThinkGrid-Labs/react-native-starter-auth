import React from 'react';
import { ActivityIndicator } from 'react-native';
import { screen, waitFor } from '@testing-library/react-native';
import Startup from './Startup';
import { mockNavigation, mockStoredSession, renderWithAuth } from '../../__tests__/test-utils';

const nav = mockNavigation();
const render = (authenticated = false) =>
  renderWithAuth(<Startup navigation={nav as any} route={{} as any} />, { authenticated });

describe('Startup screen', () => {
  it('shows a spinner while loading', () => {
    render();
    // UNSAFE_getByType is fine here; just checking spinner renders
    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('resets to Auth when no session exists', async () => {
    render(false);
    await waitFor(() =>
      expect(nav.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Auth' }],
      }),
    );
  });

  it('resets to Main when a valid session is restored', async () => {
    mockStoredSession();
    render(true);
    await waitFor(() =>
      expect(nav.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Main' }],
      }),
    );
  });
});

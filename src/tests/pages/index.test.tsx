// src/tests/pages/index.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/pages/index';

describe('Home page flow', () => {
  test('cookie is visible on load and fortune is hidden', () => {
    render(<Home />);

    // The cookie art should be visible
    const cookieArt = screen.getByLabelText('Cookie Art');
    expect(cookieArt).toBeInTheDocument();

    // Fortune message and animation should not be in the document
    expect(screen.queryByTestId('fortune-message')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cookie-animation')).not.toBeInTheDocument();
  });

  test('clicking cookie shows animation and fortune', async () => {
    render(<Home />);

    const cookieArt = screen.getByLabelText('Cookie Art');
    fireEvent.click(cookieArt);

    // After clicking, the cookie animation should appear
    expect(await screen.findByTestId('cookie-animation')).toBeInTheDocument();
    // And the fortune message container should appear
    expect(await screen.findByTestId('fortune-message')).toBeInTheDocument();
  });

  test("clicking 'Get New Cookie' resets everything", async () => {
    render(<Home />);

    const cookieArt = screen.getByLabelText('Cookie Art');
    const newCookieButton = screen.getByRole('button', { name: /get new cookie/i });

    // First, crack the cookie
    fireEvent.click(cookieArt);
    expect(await screen.findByTestId('cookie-animation')).toBeInTheDocument();
    expect(await screen.findByTestId('fortune-message')).toBeInTheDocument();

    // Click "Get New Cookie"
    fireEvent.click(newCookieButton);

    // After resetting, fortune and animation should not be present
    await waitFor(() => {
      expect(screen.queryByTestId('cookie-animation')).not.toBeInTheDocument();
      expect(screen.queryByTestId('fortune-message')).not.toBeInTheDocument();
    });

    // The cookie art should still be visible
    expect(screen.getByLabelText('Cookie Art')).toBeInTheDocument();
  });
});

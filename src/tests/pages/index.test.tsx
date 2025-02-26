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
    // Share button should not be visible initially
    expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument();
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

    // Crack the cookie first
    fireEvent.click(cookieArt);
    expect(await screen.findByTestId('cookie-animation')).toBeInTheDocument();
    expect(await screen.findByTestId('fortune-message')).toBeInTheDocument();
    // Share button should be visible now
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();

    // Click "Get New Cookie"
    fireEvent.click(newCookieButton);

    // Wait for reset: fortune, animation, and share button should not be present
    await waitFor(() => {
      expect(screen.queryByTestId('cookie-animation')).not.toBeInTheDocument();
      expect(screen.queryByTestId('fortune-message')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument();
    });

    // Cookie art should still be visible
    expect(screen.getByLabelText('Cookie Art')).toBeInTheDocument();
  });

  test('cookie click is ignored after first crack until reset', async () => {
    render(<Home />);
    const cookieArt = screen.getByLabelText('Cookie Art');

    // First click: cracks the cookie and displays fortune.
    fireEvent.click(cookieArt);
    const animation = await screen.findByTestId('cookie-animation');
    expect(animation).toBeInTheDocument();

    // Capture the fortune text.
    const fortuneElement = await screen.findByTestId('fortune-message');
    const fortuneText = fortuneElement.textContent;

    // Second click: should not change the fortune or re-trigger animation.
    fireEvent.click(cookieArt);
    // Animation and fortune remain unchanged.
    expect(screen.getByTestId('cookie-animation')).toBeInTheDocument();
    expect(screen.getByTestId('fortune-message').textContent).toEqual(fortuneText);
  });

  test('share button only appears after cookie is cracked and hides after reset', async () => {
    render(<Home />);

    // Initially, share button should not be visible.
    expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument();

    // Click cookie to crack it.
    const cookieArt = screen.getByLabelText('Cookie Art');
    fireEvent.click(cookieArt);

    // Wait for share button to appear.
    expect(await screen.findByRole('button', { name: /share/i })).toBeInTheDocument();

    // Click "Get New Cookie" to reset.
    const newCookieButton = screen.getByRole('button', { name: /get new cookie/i });
    fireEvent.click(newCookieButton);

    // Wait for share button to disappear.
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument();
    });
  });
});

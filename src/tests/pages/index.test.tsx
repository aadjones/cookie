// src/tests/pages/index.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/pages/index';
import { CookiePersonality, SpecialBehaviorType } from '@/utils/types';

// Mock Howler
jest.mock('howler', () => {
  return {
    Howl: jest.fn().mockImplementation(() => {
      return {
        play: jest.fn(),
      };
    }),
  };
});

// Mock the fetch function
global.fetch = jest.fn();

// Create a mock response for the API
const mockPersonality: CookiePersonality = {
  id: 'test-cookie',
  name: 'Test Cookie',
  emoji: '🍪',
  messages: ['This is a test fortune'],
  specialBehavior: SpecialBehaviorType.STANDARD,
};

const mockApiResponse = {
  personality: mockPersonality,
  message: 'This is a test fortune',
};

describe('Home page flow', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.resetAllMocks();

    // Mock the fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });
  });

  test('cookie is visible on load and fortune is hidden', async () => {
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // The cookie art should be visible
    const cookieArt = screen.getByLabelText(/Click to crack open/i);
    expect(cookieArt).toBeInTheDocument();

    // Fortune message and animation should not be in the document
    expect(screen.queryByTestId('fortune-message')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cookie-animation')).not.toBeInTheDocument();
    // Share button should not be visible initially
    expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument();
  });

  test('clicking cookie shows animation and fortune', async () => {
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    const cookieArt = screen.getByLabelText(/Click to crack open/i);
    fireEvent.click(cookieArt);

    // After clicking, the cookie animation should appear
    expect(await screen.findByTestId('cookie-animation')).toBeInTheDocument();
    // And the fortune message container should appear
    expect(await screen.findByTestId('fortune-message')).toBeInTheDocument();
  });

  test("clicking 'Get New Cookie' resets everything", async () => {
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    const cookieArt = screen.getByLabelText(/Click to crack open/i);
    const newCookieButton = screen.getByRole('button', { name: /get new cookie/i });

    // Crack the cookie first
    fireEvent.click(cookieArt);
    expect(await screen.findByTestId('cookie-animation')).toBeInTheDocument();
    expect(await screen.findByTestId('fortune-message')).toBeInTheDocument();
    // Share button should be visible now
    expect(await screen.findByRole('button', { name: /share/i })).toBeInTheDocument();

    // Click "Get New Cookie"
    fireEvent.click(newCookieButton);

    // Wait for loading state to disappear again
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Wait for reset: fortune, animation, and share button should not be present
    await waitFor(() => {
      expect(screen.queryByTestId('cookie-animation')).not.toBeInTheDocument();
      expect(screen.queryByTestId('fortune-message')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument();
    });

    // Cookie art should still be visible
    expect(screen.getByLabelText(/Click to crack open/i)).toBeInTheDocument();
  });

  test('cookie click is ignored after first crack until reset', async () => {
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    const cookieArt = screen.getByLabelText(/Click to crack open/i);

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

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Initially, share button should not be visible.
    expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument();

    // Click cookie to crack it.
    const cookieArt = screen.getByLabelText(/Click to crack open/i);
    fireEvent.click(cookieArt);

    // Wait for share button to appear.
    expect(await screen.findByRole('button', { name: /share/i })).toBeInTheDocument();

    // Click "Get New Cookie" to reset.
    const newCookieButton = screen.getByRole('button', { name: /get new cookie/i });
    fireEvent.click(newCookieButton);

    // Wait for loading state to disappear again
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Wait for share button to disappear.
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument();
    });
  });

  test('cookie displays a message from its own personality when cracked', async () => {
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    const cookieArt = screen.getByLabelText(/Click to crack open/i);

    // Verify the cookie personality is displayed correctly before cracking
    expect(screen.getByText('Test Cookie')).toBeInTheDocument();

    // Crack the cookie
    fireEvent.click(cookieArt);

    // After clicking, the cookie animation should appear
    expect(await screen.findByTestId('cookie-animation')).toBeInTheDocument();

    // The fortune message should be from the test cookie's messages array
    const fortuneElement = await screen.findByTestId('fortune-message');
    expect(fortuneElement).toHaveTextContent('This is a test fortune');
  });

  // NEW TESTS BELOW

  test('displays loading state while fetching cookie personality', async () => {
    // Delay the fetch response to ensure loading state is visible
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => mockApiResponse,
            });
          }, 100);
        })
    );

    render(<Home />);

    // Loading state should be visible initially
    expect(screen.getByText('Loading your cookie...')).toBeInTheDocument();
    // The spinner doesn't have a role="status" attribute, so we need to check for it differently
    expect(screen.getByText('Loading your cookie...').nextSibling).toHaveClass('animate-spin');

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Cookie should be visible after loading
    expect(screen.getByLabelText(/Click to crack open/i)).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    // Mock a failed API response
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching cookie personality:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  test('share button contains correct text and emoji', async () => {
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Crack the cookie
    const cookieArt = screen.getByLabelText(/Click to crack open/i);
    fireEvent.click(cookieArt);

    // Wait for share button to appear
    const shareButton = await screen.findByRole('button', { name: /share/i });

    // Check that the share button has the correct content
    expect(shareButton).toHaveTextContent('🔗');
    expect(shareButton).toHaveTextContent('Share');
  });

  test('displays correct cookie personality emoji', async () => {
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Check that the cookie emoji is displayed
    expect(screen.getByText('🍪')).toBeInTheDocument();
  });

  test('handles empty messages array gracefully', async () => {
    // Create a mock personality with empty messages
    const emptyMessagesMock = {
      personality: {
        ...mockPersonality,
        messages: [],
      },
      message: '',
    };

    // Mock the fetch response with empty messages
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => emptyMessagesMock,
    });

    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Crack the cookie
    const cookieArt = screen.getByLabelText(/Click to crack open/i);
    fireEvent.click(cookieArt);

    // Should show fallback message
    expect(await screen.findByText('No fortune available for this cookie.')).toBeInTheDocument();
  });
});

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

    // Check that the share button has the correct content for emoji mode (default)
    expect(shareButton).toHaveTextContent('🔗');
    expect(shareButton).toHaveTextContent('Share');

    // The button should have the green background for emoji mode
    expect(shareButton).toHaveClass('bg-green-500');
  });

  test('share button updates when DALL-E art is available', async () => {
    // Mock the art URL to simulate DALL-E art being available
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/generate-art') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ imageUrl: 'https://example.com/test-image.png' }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => mockApiResponse,
      });
    });

    render(<Home />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Toggle to DALL-E art mode
    const artToggle = screen.getByTestId('art-mode-switch');
    fireEvent.click(artToggle);

    // Get a new cookie to apply the DALL-E setting
    const newCookieButton = screen.getByTestId('new-cookie-button');
    fireEvent.click(newCookieButton);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Wait for art to be generated - this is the key fix
    await waitFor(
      () => {
        expect(screen.queryByText('Generating Art...')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Crack the cookie
    const cookieArt = screen.getByLabelText(/Click to crack open/i);
    fireEvent.click(cookieArt);

    // Wait for share button to appear
    const shareButton = await screen.findByRole('button', { name: /share/i });

    // Check that the share button has the correct content for DALL-E mode
    expect(shareButton).toHaveTextContent('🖼️');
    expect(shareButton).toHaveTextContent('Share with Image');
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

  test('toggle buttons only affect future cookies, not the current one', async () => {
    // Mock responses for different API calls
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/generate-art') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ imageUrl: 'https://example.com/test-image.png' }),
        });
      }
      if (url === '/api/generate-fortune') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ message: 'AI generated fortune' }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => mockApiResponse,
      });
    });

    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Crack the cookie to reveal the fortune
    const cookieArt = screen.getByLabelText(/Click to crack open/i);
    fireEvent.click(cookieArt);

    // Wait for the fortune to appear
    const fortuneElement = await screen.findByTestId('fortune-message');
    expect(fortuneElement).toHaveTextContent('This is a test fortune');

    // Toggle to AI generation mode
    const generationToggle = screen.getByTestId('generation-mode-switch');
    fireEvent.click(generationToggle);

    // The current fortune should not change
    expect(fortuneElement).toHaveTextContent('This is a test fortune');

    // Toggle to DALL-E art mode
    const artToggle = screen.getByTestId('art-mode-switch');
    fireEvent.click(artToggle);

    // The current cookie art should not change
    expect(screen.getByTestId('cookie-animation')).toBeInTheDocument();

    // The key test: verify that the current fortune message doesn't change after toggling
    expect(fortuneElement).toHaveTextContent('This is a test fortune');
  });

  test('toggle settings are applied when getting a new cookie', async () => {
    // Mock the API responses
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/generate-fortune') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ message: 'AI generated fortune' }),
        });
      } else if (url === '/api/generate-art') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ imageUrl: 'https://example.com/test-image.png' }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => mockApiResponse,
      });
    });

    render(<Home />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Toggle to AI generation mode
    const generationToggle = screen.getByTestId('generation-mode-switch');
    fireEvent.click(generationToggle);

    // Toggle to DALL-E art mode
    const artToggle = screen.getByTestId('art-mode-switch');
    fireEvent.click(artToggle);

    // Reset the fetch mock to track new calls
    (global.fetch as jest.Mock).mockClear();

    // Click "Get New Cookie" to get a new cookie with the new settings
    const newCookieButton = screen.getByTestId('new-cookie-button');
    fireEvent.click(newCookieButton);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Wait for art generation to complete
    await waitFor(
      () => {
        expect(screen.queryByText('Generating Art...')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify that the DALL-E art API was called
    expect(global.fetch).toHaveBeenCalledWith('/api/generate-art', expect.anything());

    // Crack the cookie
    const cookieArt = screen.getByLabelText(/Click to crack open/i);
    fireEvent.click(cookieArt);

    // Verify that the AI fortune API was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/generate-fortune', expect.anything());
    });
  });
});

// New qualitative tests
describe('Qualitative user experience tests', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.resetAllMocks();

    // Mock the fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });
  });

  test('UI elements maintain proper hierarchy and focus', async () => {
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // The cookie should be the most prominent element before cracking
    const cookieArt = screen.getByLabelText(/Click to crack open/i);
    expect(cookieArt).toBeVisible();

    // The "Get New Cookie" button should be visible but not as prominent
    const newCookieButton = screen.getByRole('button', { name: /get new cookie/i });
    expect(newCookieButton).toBeVisible();

    // Crack the cookie
    fireEvent.click(cookieArt);

    // After cracking, the fortune message should be visible and prominent
    const fortuneElement = await screen.findByTestId('fortune-message');
    expect(fortuneElement).toBeVisible();

    // The share button should now be visible
    const shareButton = await screen.findByRole('button', { name: /share/i });
    expect(shareButton).toBeVisible();
  });

  test('toggle buttons provide appropriate feedback when disabled', async () => {
    // Mock loading state
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            personality: mockPersonality,
            message: 'Test message',
          }),
      })
    );

    render(<Home />);

    // During loading, toggle buttons should be disabled and show visual indication
    const generationToggle = screen.getByTestId('generation-mode-switch');
    const artToggle = screen.getByTestId('art-mode-switch');

    expect(generationToggle).toHaveAttribute('disabled');
    expect(artToggle).toHaveAttribute('disabled');

    // Should show loading indicators
    const disabledMessages = screen.getAllByTestId('toggle-disabled-message');
    expect(disabledMessages.length).toBeGreaterThan(0);

    // At least one should contain loading text
    const loadingTexts = disabledMessages.map((msg) => msg.textContent);
    expect(loadingTexts.some((text) => text?.includes('Loading') || text?.includes('Generating'))).toBe(true);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // After loading, buttons should be enabled
    await waitFor(() => {
      expect(screen.getByTestId('generation-mode-switch')).not.toHaveAttribute('disabled');
      expect(screen.getByTestId('art-mode-switch')).not.toHaveAttribute('disabled');
    });
  });

  test('transitions between states feel natural and provide feedback', async () => {
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Crack the cookie
    const cookieArt = screen.getByLabelText(/Click to crack open/i);
    fireEvent.click(cookieArt);

    // The cookie animation should appear, indicating transition
    const animation = await screen.findByTestId('cookie-animation');
    expect(animation).toBeInTheDocument();

    // The fortune should appear
    const fortuneElement = await screen.findByTestId('fortune-message');
    expect(fortuneElement).toBeInTheDocument();

    // Click "Get New Cookie" to reset
    const newCookieButton = screen.getByRole('button', { name: /get new cookie/i });
    fireEvent.click(newCookieButton);

    // Should show loading state briefly
    expect(screen.getByText('Loading your cookie...')).toBeInTheDocument();

    // Then return to initial state
    await waitFor(() => {
      expect(screen.queryByText('Loading your cookie...')).not.toBeInTheDocument();
    });

    // Cookie should be visible again
    expect(screen.getByLabelText(/Click to crack open/i)).toBeInTheDocument();
  });
});

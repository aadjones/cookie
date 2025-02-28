import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CookieArt from '../../components/CookieArt';
import { ArtGenerationMode, CookiePersonality, SpecialBehaviorType } from '../../utils/types';

describe('CookieArt', () => {
  const mockOnClick = jest.fn();
  const mockPersonality: CookiePersonality = {
    id: 'test-id',
    name: 'Test Cookie',
    emoji: '🍪',
    messages: [],
    specialBehavior: SpecialBehaviorType.STANDARD,
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders emoji art by default', () => {
    render(<CookieArt onClick={mockOnClick} />);

    const emojiArt = screen.getByTestId('emoji-art');
    expect(emojiArt).toBeInTheDocument();
    expect(emojiArt.textContent).toBe('🥠'); // Default emoji
  });

  it('renders the provided personality emoji', () => {
    render(<CookieArt onClick={mockOnClick} personality={mockPersonality} />);

    const emojiArt = screen.getByTestId('emoji-art');
    expect(emojiArt).toBeInTheDocument();
    expect(emojiArt.textContent).toBe('🍪');
  });

  it('renders the personality name', () => {
    render(<CookieArt onClick={mockOnClick} personality={mockPersonality} />);

    const nameElement = screen.getByText('Test Cookie');
    expect(nameElement).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<CookieArt onClick={mockOnClick} personality={mockPersonality} />);

    const cookieArt = screen.getByTestId('cookie-art');
    fireEvent.click(cookieArt);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders DALL-E image when artMode is DALL_E and imageUrl is provided', () => {
    const imageUrl = 'https://example.com/image.jpg';
    render(
      <CookieArt
        onClick={mockOnClick}
        personality={mockPersonality}
        artMode={ArtGenerationMode.DALL_E}
        imageUrl={imageUrl}
      />
    );

    const dalleArt = screen.getByTestId('dalle-art');
    expect(dalleArt).toBeInTheDocument();

    const image = screen.getByAltText('Test Cookie');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
  });

  it('shows loading indicator when artMode is DALL_E but imageUrl is not provided', () => {
    render(<CookieArt onClick={mockOnClick} personality={mockPersonality} artMode={ArtGenerationMode.DALL_E} />);

    const loadingElement = screen.getByTestId('art-loading');
    expect(loadingElement).toBeInTheDocument();

    const loadingText = screen.getByText('Generating art...');
    expect(loadingText).toBeInTheDocument();
  });

  it('shows loading state when isGeneratingArt is true', () => {
    render(
      <CookieArt
        onClick={mockOnClick}
        personality={mockPersonality}
        artMode={ArtGenerationMode.DALL_E}
        imageUrl="https://example.com/image.jpg"
        isGeneratingArt={true}
      />
    );

    const loadingElement = screen.getByTestId('art-loading');
    expect(loadingElement).toBeInTheDocument();

    const loadingText = screen.getByText('Generating art...');
    expect(loadingText).toBeInTheDocument();
  });

  it('has the correct accessibility attributes', () => {
    render(<CookieArt onClick={mockOnClick} personality={mockPersonality} />);

    const cookieArt = screen.getByTestId('cookie-art');
    expect(cookieArt).toHaveAttribute('aria-label', 'Test Cookie - Click to crack open');

    const emojiArt = screen.getByTestId('emoji-art');
    expect(emojiArt).toHaveAttribute('aria-hidden', 'true');
  });
});

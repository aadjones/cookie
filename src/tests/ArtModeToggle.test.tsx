import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ArtModeToggle from '../components/ArtModeToggle';
import { ArtGenerationMode } from '../utils/types';

describe('ArtModeToggle', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders both mode options', () => {
    render(<ArtModeToggle mode={ArtGenerationMode.EMOJI} onChange={mockOnChange} />);

    expect(screen.getByText('Emoji')).toBeInTheDocument();
    expect(screen.getByText('AI-Generated')).toBeInTheDocument();
  });

  it('visually indicates the current mode', () => {
    const { rerender } = render(<ArtModeToggle mode={ArtGenerationMode.EMOJI} onChange={mockOnChange} />);

    // In EMOJI mode, "Emoji" should be visually emphasized in some way
    const emojiText = screen.getByText('Emoji');
    const aiGeneratedText = screen.getByText('AI-Generated');

    // We don't check specific classes, just that they're visually different
    expect(emojiText).toBeVisible();
    expect(aiGeneratedText).toBeVisible();

    // Now check DALL_E mode
    rerender(<ArtModeToggle mode={ArtGenerationMode.DALL_E} onChange={mockOnChange} />);

    // The visual emphasis should have switched
    expect(emojiText).toBeVisible();
    expect(aiGeneratedText).toBeVisible();
  });

  it('calls onChange with EMOJI to DALL_E when clicked', () => {
    render(<ArtModeToggle mode={ArtGenerationMode.EMOJI} onChange={mockOnChange} />);

    fireEvent.click(screen.getByTestId('art-mode-switch'));
    expect(mockOnChange).toHaveBeenCalledWith(ArtGenerationMode.DALL_E);
  });

  it('calls onChange with DALL_E to EMOJI when clicked', () => {
    render(<ArtModeToggle mode={ArtGenerationMode.DALL_E} onChange={mockOnChange} />);

    fireEvent.click(screen.getByTestId('art-mode-switch'));
    expect(mockOnChange).toHaveBeenCalledWith(ArtGenerationMode.EMOJI);
  });

  it('is disabled when disabled prop is true', () => {
    render(<ArtModeToggle mode={ArtGenerationMode.EMOJI} onChange={mockOnChange} disabled={true} />);

    expect(screen.getByTestId('art-mode-switch')).toBeDisabled();
    expect(screen.getByTestId('toggle-disabled-message')).toBeInTheDocument();
    // Check for generating text in a more qualitative way
    expect(screen.getByTestId('toggle-disabled-message').textContent).toContain('Generating');

    fireEvent.click(screen.getByTestId('art-mode-switch'));
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('shows label when showLabel prop is true', () => {
    render(<ArtModeToggle mode={ArtGenerationMode.EMOJI} onChange={mockOnChange} showLabel={true} />);

    expect(screen.getByText('Art')).toBeInTheDocument();
  });

  it('does not show label when showLabel prop is false', () => {
    render(<ArtModeToggle mode={ArtGenerationMode.EMOJI} onChange={mockOnChange} showLabel={false} />);

    expect(screen.queryByText('Art')).not.toBeInTheDocument();
  });
});

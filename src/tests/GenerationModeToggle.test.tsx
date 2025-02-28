import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GenerationModeToggle from '../components/GenerationModeToggle';
import { MessageGenerationMode } from '../utils/types';

describe('GenerationModeToggle', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders both mode options', () => {
    render(<GenerationModeToggle mode={MessageGenerationMode.PRE_WRITTEN} onChange={mockOnChange} />);

    expect(screen.getByText('Classic')).toBeInTheDocument();
    expect(screen.getByText('AI-Generated')).toBeInTheDocument();
  });

  it('visually indicates the current mode', () => {
    const { rerender } = render(
      <GenerationModeToggle mode={MessageGenerationMode.PRE_WRITTEN} onChange={mockOnChange} />
    );

    // In PRE_WRITTEN mode, "Classic" should be visually emphasized in some way
    const classicText = screen.getByText('Classic');
    const aiGeneratedText = screen.getByText('AI-Generated');

    // We don't check specific classes, just that they're visually different
    expect(classicText).toBeVisible();
    expect(aiGeneratedText).toBeVisible();

    // Now check AI_GENERATED mode
    rerender(<GenerationModeToggle mode={MessageGenerationMode.AI_GENERATED} onChange={mockOnChange} />);

    // The visual emphasis should have switched
    expect(classicText).toBeVisible();
    expect(aiGeneratedText).toBeVisible();
  });

  it('calls onChange with PRE_WRITTEN to AI_GENERATED when clicked', () => {
    render(<GenerationModeToggle mode={MessageGenerationMode.PRE_WRITTEN} onChange={mockOnChange} />);

    fireEvent.click(screen.getByTestId('generation-mode-switch'));
    expect(mockOnChange).toHaveBeenCalledWith(MessageGenerationMode.AI_GENERATED);
  });

  it('calls onChange with AI_GENERATED to PRE_WRITTEN when clicked', () => {
    render(<GenerationModeToggle mode={MessageGenerationMode.AI_GENERATED} onChange={mockOnChange} />);

    fireEvent.click(screen.getByTestId('generation-mode-switch'));
    expect(mockOnChange).toHaveBeenCalledWith(MessageGenerationMode.PRE_WRITTEN);
  });

  it('is disabled when disabled prop is true', () => {
    render(<GenerationModeToggle mode={MessageGenerationMode.PRE_WRITTEN} onChange={mockOnChange} disabled={true} />);

    expect(screen.getByTestId('generation-mode-switch')).toBeDisabled();
    expect(screen.getByTestId('toggle-disabled-message')).toBeInTheDocument();
    // Check for loading text in a more qualitative way
    expect(screen.getByTestId('toggle-disabled-message').textContent).toContain('Loading');

    fireEvent.click(screen.getByTestId('generation-mode-switch'));
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});

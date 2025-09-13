import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CookieAnimation from '../../components/CookieAnimation';
import { CookiePersonality, SpecialBehaviorType } from '../../utils/types';

describe('CookieAnimation', () => {
  it('renders standard cookie animation correctly', () => {
    const standardCookie: CookiePersonality = {
      id: 'standard',
      name: 'Standard Cookie',
      emoji: '🍪',
      messages: ['Test message'],
      specialBehavior: SpecialBehaviorType.STANDARD,
    };

    render(<CookieAnimation personality={standardCookie} />);

    // Check that the emoji and explosion are displayed
    const emojiElement = screen.getByRole('img', { name: 'Cookie Art' });
    expect(emojiElement).toHaveTextContent('🍪💥');
  });

  it('renders matryoshka cookie animation correctly and supports clicking', () => {
    const matryoshkaCookie: CookiePersonality = {
      id: 'matryoshka',
      name: 'Matryoshka Cookie',
      emoji: '🪆',
      messages: ['Your fortune is in another cookie'],
      specialBehavior: SpecialBehaviorType.MATRYOSHKA,
    };

    render(<CookieAnimation personality={matryoshkaCookie} />);

    // Find the matryoshka container
    const matryoshkaContainer = screen.getByTestId('matryoshka-container');
    expect(matryoshkaContainer).toBeInTheDocument();

    // Check that the doll emoji is present
    expect(screen.getByText('🪆')).toBeInTheDocument();

    // Check that it's initially clickable (has cursor-pointer class)
    expect(matryoshkaContainer).toHaveClass('cursor-pointer');

    // Click the container to nest deeper
    fireEvent.click(matryoshkaContainer);

    // Verify the doll is still present after clicking (nesting behavior)
    expect(screen.getByText('🪆')).toBeInTheDocument();

    // The container should still be clickable for intermediate levels
    expect(matryoshkaContainer).toHaveClass('cursor-pointer');
  });

  it('renders quantum cookie animation correctly', () => {
    const quantumCookie: CookiePersonality = {
      id: 'quantum',
      name: 'Quantum Cookie',
      emoji: '⚛️',
      messages: ['Message 1', 'Message 2'],
      specialBehavior: SpecialBehaviorType.QUANTUM,
    };

    render(<CookieAnimation personality={quantumCookie} />);

    // Check that the emoji and special effect are displayed
    const emojiElement = screen.getByRole('img', { name: 'Cookie Art' });
    expect(emojiElement).toHaveTextContent('⚛️💫');

    // Check that it has the quantum flicker animation class
    expect(emojiElement.className).toContain('animate-quantum-flicker');
  });
});

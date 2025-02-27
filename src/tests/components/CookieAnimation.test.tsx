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
    const emojiElement = screen.getByRole('img', { name: /cracked cookie/i });
    expect(emojiElement).toHaveTextContent('🍪💥');

    // Check that the message is displayed
    expect(screen.getByText('Cookie Cracked!')).toBeInTheDocument();
  });

  it('renders matryoshka cookie animation correctly and supports clicking', () => {
    const matryoshkaCookie: CookiePersonality = {
      id: 'matryoshka',
      name: 'Matryoshka Cookie',
      emoji: '🪆',
      messages: [''],
      specialBehavior: SpecialBehaviorType.MATRYOSHKA,
    };

    render(<CookieAnimation personality={matryoshkaCookie} />);

    // Check initial state
    const initialDoll = screen.getByRole('img', { name: /matryoshka doll level 1/i });
    expect(initialDoll).toHaveTextContent('🪆');
    expect(screen.getByText('A smaller doll appeared! Click to open it.')).toBeInTheDocument();

    // Click the doll to reveal a smaller one
    fireEvent.click(initialDoll);

    // Check that the level has increased
    const secondDoll = screen.getByRole('img', { name: /matryoshka doll level 2/i });
    expect(secondDoll).toBeInTheDocument();
    expect(screen.getByText('A smaller doll appeared! Click to open it.')).toBeInTheDocument();

    // Verify the class changes to reflect smaller size
    expect(secondDoll.className).toContain('text-7xl');

    // Click until we reach the max level
    fireEvent.click(secondDoll); // Level 3
    fireEvent.click(screen.getByRole('img', { name: /matryoshka doll level 3/i })); // Level 4
    fireEvent.click(screen.getByRole('img', { name: /matryoshka doll level 4/i })); // Level 5

    // Check the final message
    expect(screen.getByText('Sorry, but your fortune is in another doll')).toBeInTheDocument();
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
    const emojiElement = screen.getByRole('img', { name: /quantum cookie/i });
    expect(emojiElement).toHaveTextContent('⚛️💫');

    // Check that it has the quantum flicker animation class
    expect(emojiElement.className).toContain('animate-quantum-flicker');

    // Check that the message is displayed
    expect(screen.getByText('The cookie exists in multiple states!')).toBeInTheDocument();
  });

  it('ensures matryoshka message stays visible at maximum level', async () => {
    // Mock timers to test timeout behavior
    jest.useFakeTimers();

    const matryoshkaCookie: CookiePersonality = {
      id: 'matryoshka',
      name: 'Matryoshka Cookie',
      emoji: '🪆',
      messages: [''],
      specialBehavior: SpecialBehaviorType.MATRYOSHKA,
    };

    render(<CookieAnimation personality={matryoshkaCookie} />);

    // Click through all levels to reach the maximum
    const initialDoll = screen.getByRole('img', { name: /matryoshka doll level 1/i });
    fireEvent.click(initialDoll); // Level 2
    fireEvent.click(screen.getByRole('img', { name: /matryoshka doll level 2/i })); // Level 3
    fireEvent.click(screen.getByRole('img', { name: /matryoshka doll level 3/i })); // Level 4
    fireEvent.click(screen.getByRole('img', { name: /matryoshka doll level 4/i })); // Level 5 (MAX)

    // Verify the final message is displayed
    expect(screen.getByText('Sorry, but your fortune is in another doll')).toBeInTheDocument();

    // Fast-forward time to simulate waiting for the timeout
    jest.advanceTimersByTime(3000); // More than the 2000ms timeout

    // The message should still be visible at the maximum level
    expect(screen.getByText('Sorry, but your fortune is in another doll')).toBeInTheDocument();

    // Restore real timers
    jest.useRealTimers();
  });
});

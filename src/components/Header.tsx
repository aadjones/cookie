// src/components/Header.tsx
import React from 'react';
import { CookiePersonality } from '../utils/types';
import { getPersonalityTheme } from '../utils/personalityThemes';

interface HeaderProps {
  personality?: CookiePersonality | null;
}

export default function Header({ personality }: HeaderProps) {
  const theme = getPersonalityTheme(personality);

  return (
    <header className={`${theme.headerBg} py-4 shadow-lg transition-colors duration-500`}>
      <h1 className="text-center text-white text-xl font-bold tracking-wide">Digital Fortune Cookie</h1>
      {personality && <p className="text-center text-white/80 text-sm mt-1 font-medium">{personality.name}</p>}
    </header>
  );
}

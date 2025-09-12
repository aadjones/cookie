import { CookiePersonality, SpecialBehaviorType } from '../types';

export const errorCookie: CookiePersonality = {
  id: 'error',
  name: 'Error Cookie',
  emoji: '🚫',
  messages: [
    'Error 404: Destiny not found.',
    'Fatal out-of-cheese error (511). Please try again later.',
    'Runtime Exception: Motivation.exe has stopped working. Would you like to send an error report?',
    'Warning: Low disk space on drive C:\\Life. Please delete unnecessary drama to continue.',
    'Connection timeout: Unable to establish link with your soulmate. Check your network settings and try again.',
    'Segmentation fault: Your dreams have accessed protected memory. Core dumped.',
    'HTTP 429: Too many requests to the universe. Rate limited until further notice.',
    'NullPointerException: Your purpose reference points to null. Initialize before use.',
    "Error 418: I'm a teapot, not a fortune cookie. This message should not have appeared.",
    'Stack overflow: Your worries have exceeded maximum recursion depth. Please restart your mindset.',
  ],
  specialBehavior: SpecialBehaviorType.STANDARD,
};

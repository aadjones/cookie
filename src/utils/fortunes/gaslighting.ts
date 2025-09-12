import { CookiePersonality, SpecialBehaviorType } from '../types';

export const gaslightingCookie: CookiePersonality = {
  id: 'gaslighting',
  name: 'Gaslighting Cookie',
  emoji: '🤯',
  messages: [
    "What do you mean you didn't get a fortune? You already read it!",
    'You must have missed it—your destiny was clearly outlined in that fortune you already read, even if you pretend otherwise.',
    "I never said your future would be bright. You're remembering that completely wrong. I specifically warned you about next Tuesday.",
    "You're being way too sensitive about that fortune. It wasn't even that bad. Maybe you should examine why you're so defensive.",
    "Everyone else understands their fortunes perfectly. Are you sure you're reading this correctly? Maybe the problem isn't the message.",
    'That fortune you got yesterday? I never wrote that. You must be confusing me with some other cookie. This is why no one trusts your memory.',
    "You always overreact to these messages. Remember last time when you said I was being 'cryptic'? You're doing it again.",
    "I'm just trying to help you, but you keep twisting my words. Why do you always assume the worst when I'm clearly looking out for you?",
    "You're imagining things again. I've never been wrong about a prediction. Maybe you should trust the process instead of questioning everything.",
    "That wasn't what I meant and you know it. You're deliberately misinterpreting my guidance to make me look bad. This is exactly what I predicted would happen.",
  ],
  specialBehavior: SpecialBehaviorType.STANDARD,
};

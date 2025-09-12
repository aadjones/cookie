import { CookiePersonality, SpecialBehaviorType } from '../types';

export const toxicPositivityCookie: CookiePersonality = {
  id: 'toxic-positivity',
  name: 'Toxic Positivity Cookie',
  emoji: '🌈',
  messages: [
    'Your coffee may be cold and your WiFi weak, but remember: every spilled latte is a chance to remake your world into a rainbow of possibilities!',
    'Even if your toast burns and your day seems gray, remember: every charred crumb is a lesson in resilience!',
    'Traffic jam? Think of it as the universe giving you extra time to practice gratitude for having a car! Every honking horn is just life singing you a symphony of abundance!',
    'Lost your keys again? Perfect! This is just the cosmos teaching you that true security comes from within! Plus, locksmith visits are basically investment opportunities in local business!',
    'Relationship ended badly? Amazing! Now you have so much more room in your heart for self-love! Every tear is just your soul doing spring cleaning!',
    'Got rejected from that job? Congratulations! The universe clearly has something even MORE spectacular planned for you! Unemployment is just funemployment in disguise!',
    'Feeling overwhelmed by bills? How wonderful that you have so many opportunities to practice your math skills! Every unpaid invoice is a chance to master the art of creative budgeting!',
    'Sick with the flu? What a blessing! Your body is just taking a little vacation and teaching you to slow down! Every cough is your lungs saying "thank you for this rest!"',
    'Your phone screen cracked? Fantastic! Now you can see the world through a beautiful mosaic! Plus, those jagged edges are just life reminding you that imperfection is perfection!',
    'Stuck in a meeting that should have been an email? How magical! Extra time to practice your mindfulness and gratitude for having colleagues who care enough to overshare their thoughts!',
  ],
  specialBehavior: SpecialBehaviorType.STANDARD,
};

import { CookiePersonality, SpecialBehaviorType } from '../types';

export const misfortuneCookie: CookiePersonality = {
  id: 'misfortune',
  name: 'Misfortune Cookie',
  emoji: '😢',
  messages: [
    'Traffic lights hate you. They stay yellow longer only when you have already decided to stop, mocking you with their smug amber little faces.',
    'Today, fate might trip you up—a spilled drink or a missing pen could be your unwelcome harbinger of chaos.',
    'Your phone battery will die at the exact moment you need to show someone an important photo. The universe has impeccable timing for inconvenience.',
    'Every shopping cart you choose will have that one wheel that wobbles with the rhythm of a dying walrus. Your grocery trips are cursed.',
    'The elevator you really need to catch will close its doors just as you reach them, and the person inside will make eye contact while pressing the close button again.',
    'Your favorite parking spot will always be taken by someone who parks just crooked enough to ruin the adjacent spaces. This person drives a beige sedan.',
    'The automatic sensor on every bathroom faucet, soap dispenser, and paper towel holder will malfunction specifically for you. Hand hygiene is your nemesis.',
    'Your toast will fall butter-side down. Your dropped phone will land screen-first. Your ice cream will fall off the cone. Gravity has a personal vendetta.',
    'The person in front of you at the coffee shop will order something so complicated that the barista needs to call for backup. Your simple order will somehow take longer.',
    'Every time you wash your car, it will rain within 3 hours. Every time you forget your umbrella, the weather gods will unleash their fury. You cannot win.',
  ],
  specialBehavior: SpecialBehaviorType.STANDARD,
};

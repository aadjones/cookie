import { CookiePersonality, SpecialBehaviorType } from '../types';

export const conspiracyCookie: CookiePersonality = {
  id: 'conspiracy',
  name: 'Conspiracy Cookie',
  emoji: '🕵️‍♂️',
  messages: [
    "If you think you're feeling hormonal lately, it's probably because THE MOON IS A HOLOGRAM!",
    "I wouldn't advise getting that haircut tomorrow—unless you want the government to harvest your DNA.",
    "That coffee shop loyalty card? It's actually a tracking device. They know exactly how much caffeine it takes to control your thoughts.",
    'Your WiFi keeps disconnecting because the lizard people are updating their mind-control algorithms. Stay offline between 2-4am.',
    "Those birds outside your window aren't real—they're government surveillance drones. Notice how they always know when you're about to leave the house?",
    "Your horoscope is written by Big Astronomy to keep you distracted from the fact that Saturn isn't even a planet—it's a space station.",
    "That ringing in your ears? That's the sound of microchips activating. Check your recent vaccinations and cereal purchases.",
    'The grocery store rearranges products to test your psychological resilience for the coming social credit system. Always shop in reverse alphabetical order.',
    'Your dog has been replaced by an advanced AI. The real question is: when did you last see it actually sleep?',
    "Those 'random' song recommendations aren't random—they're subliminal messages from the music industry-government complex preparing you for the next phase.",
  ],
  specialBehavior: SpecialBehaviorType.STANDARD,
};

import { CookiePersonality, SpecialBehaviorType } from '../types';

export const actuarialCookie: CookiePersonality = {
  id: 'actuarial',
  name: 'Actuarial Cookie',
  emoji: '📊',
  messages: [
    "There's a 73% chance that you won't believe what happens 5 minutes from now!",
    "The next time you do your laundry, you'll find the missing sock of your dreams.",
    "Statistical analysis indicates a 47.3% probability that you'll check your phone within the next 2 minutes. You just proved our model correct.",
    "Based on current data trends, there's an 83% chance you'll have exactly 7 meaningful conversations this week, with a 12% margin of error.",
    'Your likelihood of finding true love increases by 0.003% each time you leave the house. Current cumulative probability: surprisingly low.',
    "Risk assessment shows a 91% chance you'll find something you forgot you lost within the next 72 hours. Check behind the couch first.",
    'Probability matrix indicates a 64% chance that your next sneeze will happen at an socially awkward moment. Confidence interval: very high.',
    "Based on behavioral patterns, there's a 78% chance you're procrastinating on something important right now. Time allocation suggests priority rebalancing.",
    "Statistical models predict a 55% probability that you'll receive unexpected good news this month, with peak likelihood occurring on a Tuesday.",
    "Analysis shows a 42% chance you'll discover a new favorite song this week. Recommendation algorithm suggests branching beyond your usual genres.",
  ],
  specialBehavior: SpecialBehaviorType.STANDARD,
};

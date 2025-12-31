
import { TimezoneOption } from './types';

export const TIMEZONES: TimezoneOption[] = [
  { value: 'Asia/Jakarta', label: 'WIB (GMT+7)' },
  { value: 'Asia/Tokyo', label: 'JST (GMT+9)' },
  { value: 'Europe/London', label: 'GMT (UTC+0)' },
  { value: 'America/New_York', label: 'EST (GMT-5)' },
  { value: 'Pacific/Auckland', label: 'NZDT (GMT+13)' },
  { value: 'TEST_MODE', label: 'Test Mode (10s)' },
];

export const AUDIO_URLS = {
  bgMusic: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder for upbeat theme
  fireworks: 'https://actions.google.com/sounds/v1/science_fiction/rocket_launcher.ogg', // Default
  fireworkVariants: [
    'https://actions.google.com/sounds/v1/science_fiction/rocket_launcher.ogg',
    'https://actions.google.com/sounds/v1/explosions/explosion_underwater.ogg',
    'https://actions.google.com/sounds/v1/explosions/large_explosion.ogg',
    'https://actions.google.com/sounds/v1/explosions/cannon_fire.ogg',
    'https://actions.google.com/sounds/v1/impacts/cling_clang.ogg'
  ],
  celebration: 'https://actions.google.com/sounds/v1/crowds/battle_crowd_celebrate.ogg'
};

export const FLOATING_MESSAGES = [
  "Thank you for being part of 2024.",
  "Let’s create better memories in 2025.",
  "May your dreams take flight this year.",
  "The best is yet to come.",
  "Wishing you endless joy and peace.",
  "Cheers to a new beginning!"
];

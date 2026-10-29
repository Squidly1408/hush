import type { IconName } from './icons';

export interface Sound {
  /** Key into ENGINES and into a saved mix. Never rename one: saved mixes reference it. */
  id: string;
  name: string;
  sub: string;
  icon: IconName;
}

export interface SoundGroup {
  title: string;
  items: Sound[];
}

export const SOUND_GROUPS: SoundGroup[] = [
  {
    title: 'Rain & storm',
    items: [
      { id: 'rain', name: 'Rain', sub: 'Steady downpour', icon: 'rain' },
      { id: 'drizzle', name: 'Drizzle', sub: 'Light, soft rain', icon: 'drizzle' },
      { id: 'roof', name: 'Tin roof', sub: 'Rain on metal', icon: 'roof' },
      { id: 'thunder', name: 'Thunder', sub: 'Distant rumbles', icon: 'thunder' },
    ],
  },
  {
    title: 'Water',
    items: [
      { id: 'ocean', name: 'Ocean', sub: 'Slow rolling waves', icon: 'ocean' },
      { id: 'stream', name: 'Stream', sub: 'Babbling brook', icon: 'stream' },
      { id: 'waterfall', name: 'Waterfall', sub: 'Constant rush', icon: 'waterfall' },
      { id: 'drips', name: 'Cave drips', sub: 'Echoing drops', icon: 'drips' },
      { id: 'underwater', name: 'Underwater', sub: 'Muffled and deep', icon: 'underwater' },
    ],
  },
  {
    title: 'Outdoors',
    items: [
      { id: 'wind', name: 'Wind', sub: 'Gusts through trees', icon: 'wind' },
      { id: 'fire', name: 'Campfire', sub: 'Crackling logs', icon: 'fire' },
      { id: 'birds', name: 'Birdsong', sub: 'Early morning', icon: 'birds' },
      { id: 'crickets', name: 'Crickets', sub: 'Summer night', icon: 'crickets' },
      { id: 'frogs', name: 'Frogs', sub: 'Pond chorus', icon: 'frogs' },
      { id: 'owl', name: 'Owl', sub: 'Calls in the dark', icon: 'owl' },
    ],
  },
  {
    title: 'Cosy indoors',
    items: [
      { id: 'purr', name: 'Cat purr', sub: 'Contented cat', icon: 'purr' },
      { id: 'heartbeat', name: 'Heartbeat', sub: 'Slow, 60 bpm', icon: 'heart' },
      { id: 'clock', name: 'Clock', sub: 'Tick, tock', icon: 'clock' },
      { id: 'train', name: 'Night train', sub: 'Wheels on rails', icon: 'train' },
      { id: 'plane', name: 'Plane cabin', sub: 'Cruising hum', icon: 'plane' },
      { id: 'fan', name: 'Fan', sub: 'Bedroom fan hum', icon: 'fan' },
    ],
  },
  {
    title: 'Tones',
    items: [
      { id: 'chimes', name: 'Wind chimes', sub: 'Pentatonic, random', icon: 'chimes' },
      { id: 'bowl', name: 'Singing bowl', sub: 'Long resonance', icon: 'bowl' },
      { id: 'drone', name: 'Warm drone', sub: 'Low, slow pad', icon: 'drone' },
      { id: 'theta', name: 'Theta beats', sub: '6 Hz, use headphones', icon: 'phones' },
    ],
  },
  {
    title: 'Lullabies',
    items: [
      { id: 'musicbox', name: 'Music box', sub: 'Brahms’ Lullaby', icon: 'box' },
      { id: 'twinkle', name: 'Twinkle piano', sub: 'Twinkle, Twinkle', icon: 'piano' },
      { id: 'harp', name: 'Harp lullaby', sub: 'Slow arpeggios', icon: 'harp' },
      { id: 'lullaby', name: 'Dream notes', sub: 'Wandering melody', icon: 'note' },
    ],
  },
  {
    title: 'Noise',
    items: [
      { id: 'white', name: 'White noise', sub: 'Bright and even', icon: 'noise' },
      { id: 'pink', name: 'Pink noise', sub: 'Softer, balanced', icon: 'noise' },
      { id: 'brown', name: 'Brown noise', sub: 'Deep and low', icon: 'noise' },
    ],
  },
];

export const SOUND_BY_ID: Readonly<Record<string, Sound>> = Object.fromEntries(
  SOUND_GROUPS.flatMap((g) => g.items).map((s) => [s.id, s]),
);

/** Sound id → slider level (0–100). Only sounds that are switched on appear in a mix. */
export type Mix = Record<string, number>;

export interface NamedMix {
  name: string;
  mix: Mix;
}

export const PRESETS: NamedMix[] = [
  { name: 'Rainy cabin', mix: { rain: 60, fire: 40, thunder: 25 } },
  { name: 'Seaside night', mix: { ocean: 70, wind: 25, crickets: 20 } },
  { name: 'Forest morning', mix: { birds: 55, stream: 45, wind: 20 } },
  { name: 'Deep focus', mix: { brown: 55, drone: 25 } },
  { name: 'Meditation', mix: { bowl: 55, chimes: 30, drone: 30 } },
  { name: 'Thunderstorm', mix: { rain: 75, thunder: 65, wind: 35 } },
  { name: 'Baby sleep', mix: { pink: 55, fan: 30, heartbeat: 25 } },
  { name: 'Lullaby time', mix: { musicbox: 55, pink: 20, heartbeat: 15 } },
  { name: 'Night train', mix: { train: 65, drizzle: 35 } },
  { name: 'Cat nap', mix: { purr: 55, roof: 35, fire: 25 } },
  { name: 'Swamp night', mix: { frogs: 45, crickets: 35, owl: 45 } },
  { name: 'Cave retreat', mix: { drips: 55, waterfall: 25, drone: 20 } },
  { name: 'Hummed to sleep', mix: { hum: 55, heartbeat: 15, pink: 20 } },
  { name: 'Breathe easy', mix: { breath: 50, pad: 30, pink: 15 } },
  { name: 'Settling baby', mix: { shush: 45, dryer: 40, heartbeat: 15 } },
  { name: 'Camping', mix: { tent: 60, fire: 30, owl: 30 } },
  { name: 'Summer dusk', mix: { cicadas: 40, leaves: 35, crickets: 25 } },
  { name: 'Road trip', mix: { car: 65, drizzle: 25 } },
  { name: 'Deep sea', mix: { whale: 55, underwater: 50 } },
];

/** Inline SVG path data for 24×24 line icons, drawn with stroke="currentColor". */
export const ICONS = {
  rain: '<path d="M7 14a4 4 0 1 1 1-7.9A5 5 0 0 1 18 8a3 3 0 0 1 0 6Z"/><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/>',
  thunder:
    '<path d="M7 13a4 4 0 1 1 1-7.9A5 5 0 0 1 18 7a3 3 0 0 1 0 6"/><path d="M13 11l-3 5h4l-3 5"/>',
  ocean:
    '<path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>',
  stream:
    '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/>',
  wind: '<path d="M3 8h10a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 18h6"/>',
  fire: '<path d="M12 21c-3.9 0-7-2.8-7-6.6C5 10 9 8.5 9 3c3 2 5 5 5 8 1-.8 2-2 2-3.6 2 2 3 4.3 3 7C19 18.2 15.9 21 12 21Z"/>',
  birds:
    '<path d="M2 10c2-2.2 4.2-2.2 6 0 1.8-2.2 4-2.2 6 0M10 16c1.5-1.6 3.2-1.6 4.5 0 1.3-1.6 3-1.6 4.5 0"/>',
  crickets:
    '<path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5Z"/><path d="M17 3v3M15.5 4.5h3"/>',
  chimes:
    '<path d="M4 4h16M7 4v9M11 4v12M15 4v6M19 4v9"/><circle cx="7" cy="15" r="1.4"/><circle cx="11" cy="18" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="19" cy="15" r="1.4"/>',
  bowl: '<path d="M3 11h18a9 9 0 0 1-18 0Z"/><path d="M9 21h6M14 4l3 4"/>',
  drone: '<path d="M2 12c1.7-5 3.3-5 5 0s3.3 5 5 0 3.3-5 5 0 3.3 5 5 0"/>',
  fan: '<circle cx="12" cy="12" r="9"/><path d="M12 12c-.5-3.5 1-6 3-5.5s1.5 3.5-3 5.5Zm0 0c3.5.5 5.5 2.5 4.5 4.3s-3.8.7-4.5-4.3Zm0 0c-2.8 2-5.5 1.8-5.8-.3s2.7-2.9 5.8.3Z"/>',
  drizzle:
    '<path d="M7 14a4 4 0 1 1 1-7.9A5 5 0 0 1 18 8a3 3 0 0 1 0 6Z"/><path d="M9 18v.5M13 19v.5M17 18v.5"/>',
  roof: '<path d="M3 13l9-7 9 7"/><path d="M5 11.5V20h14v-8.5"/><path d="M8 2.5v1.5M12 1.5V3M16 2.5v1.5"/>',
  waterfall:
    '<path d="M4 4h16M7 4v11M12 4v13M17 4v11"/><path d="M3 20c2 0 2-1.5 4.5-1.5S10 20 12 20s2-1.5 4.5-1.5S19 20 21 20"/>',
  drips:
    '<path d="M3 4h18M8 4v3M16 4v5"/><path d="M12 11c1.5 2 2 3 2 4a2 2 0 0 1-4 0c0-1 .5-2 2-4Z"/>',
  underwater:
    '<circle cx="9" cy="16" r="3"/><circle cx="15" cy="9" r="2"/><circle cx="12" cy="4" r="1"/><circle cx="17" cy="17" r="1.5"/>',
  frogs:
    '<path d="M4 15c0-3 3.6-5 8-5s8 2 8 5-3.6 4-8 4-8-1-8-4Z"/><circle cx="8" cy="8" r="2.2"/><circle cx="16" cy="8" r="2.2"/>',
  owl: '<path d="M6 5l2 2h8l2-2v9a6 6 0 0 1-12 0Z"/><circle cx="9.5" cy="11" r="1.6"/><circle cx="14.5" cy="11" r="1.6"/><path d="M12 13.5V15"/>',
  purr: '<path d="M5 20V8L4 3l5 3h6l5-3-1 5v12Z"/><path d="M9 12v1M15 12v1M11 16h2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  heart:
    '<path d="M12 20s-8-4.5-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.5 12 20 12 20Z"/><path d="M6 12h3l1.5-2 2 4 1.5-2h4"/>',
  train:
    '<rect x="6" y="3" width="12" height="13" rx="3"/><path d="M6 10h12M9 19l-2 3M15 19l2 3M9 13.5h.01M15 13.5h.01"/>',
  plane:
    '<path d="M10.5 3.5c0-1 3-1 3 0V9l7 4v2l-7-2v5l2 1.5V21l-3.5-1-3.5 1v-1.5l2-1.5v-5l-7 2v-2l7-4Z"/>',
  note: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  phones:
    '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  hum: '<circle cx="12" cy="12" r="9"/><path d="M8 10.5c.8.7 1.7.7 2.5 0M13.5 10.5c.8.7 1.7.7 2.5 0M10.5 15.5h3"/>',
  star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4l-5.3 3 1.2-6-4.5-4.1 6-.7Z"/>',
  moon: '<path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5Z"/><path d="M15 3h3.5L15 7h3.5"/>',
  choir:
    '<circle cx="6" cy="9" r="2"/><circle cx="12" cy="7" r="2"/><circle cx="18" cy="9" r="2"/><path d="M3 18a3 3 0 0 1 6 0M9 16a3 3 0 0 1 6 0M15 18a3 3 0 0 1 6 0"/>',
  tent: '<path d="M12 4L3 20h18Z"/><path d="M9 20l3-6 3 6"/>',
  whale:
    '<path d="M3 12c0 4 4 7 9 7 4.5 0 7-2.5 8-6l2-3h-3c-1-1-2.5-1-3.5 0-1.5 1.5-4 1.5-6 0C7 9 3 9 3 12Z"/><path d="M7 4c0 2 1 3 2 4M11 4c0 2-1 3-2 4"/>',
  cicada:
    '<ellipse cx="12" cy="13" rx="3" ry="6"/><path d="M9 10L3 7v6l6 1M15 10l6-3v6l-6 1M10.5 6.5L9 4M13.5 6.5L15 4"/>',
  leaf: '<path d="M5 19C5 10 10 4 20 4c0 10-6 15-15 15Z"/><path d="M5 19l9-9"/>',
  breath:
    '<path d="M12 4v8l-3 2M12 12l3 2"/><path d="M9 7.5C6 7 4 11 4 16c0 2 1 3 2.5 3S9 18 9 16ZM15 7.5c3-.5 5 3.5 5 8.5 0 2-1 3-2.5 3S15 18 15 16Z"/>',
  shush: '<path d="M4 12h3M10 8c2 2 2 6 0 8M14 6c3 3 3 9 0 12M18 4c4 4 4 12 0 16"/>',
  dryer:
    '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M7 6.5h.01M10 6.5h4"/>',
  car: '<path d="M4 16v-4l2.5-5h11l2.5 5v4Z"/><path d="M4 12h16"/><circle cx="8" cy="17" r="1.8"/><circle cx="16" cy="17" r="1.8"/>',
  pad: '<path d="M2 10c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1M2 15c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1"/>',
  noise: '<path d="M2 12l2-5 2 9 2-7 2 6 2-8 2 10 2-6 2 5 2-6 2 3"/>',
} as const;

export type IconName = keyof typeof ICONS;

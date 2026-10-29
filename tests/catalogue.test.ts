import { describe, expect, it } from 'vitest';
import { ENGINES } from '../src/audio/engines';
import { ICONS } from '../src/data/icons';
import { PRESETS } from '../src/data/presets';
import { SOUND_BY_ID, SOUND_GROUPS } from '../src/data/sounds';

const sounds = SOUND_GROUPS.flatMap((g) => g.items);

describe('sound catalogue', () => {
  it('has unique ids', () => {
    expect(new Set(sounds.map((s) => s.id)).size).toBe(sounds.length);
  });

  it('has an engine and an icon for every sound', () => {
    for (const s of sounds) {
      expect(ENGINES[s.id], s.id).toBeTypeOf('function');
      expect(ICONS[s.icon], s.icon).toBeTypeOf('string');
    }
  });

  it('has no engines without a tile', () => {
    for (const id of Object.keys(ENGINES)) expect(SOUND_BY_ID[id], id).toBeDefined();
  });
});

describe('presets', () => {
  it.each(PRESETS.map((p) => [p.name, p.mix] as const))('%s uses known sounds', (_, mix) => {
    for (const [id, level] of Object.entries(mix)) {
      expect(SOUND_BY_ID[id], id).toBeDefined();
      expect(level).toBeGreaterThan(0);
      expect(level).toBeLessThanOrEqual(100);
    }
  });
});

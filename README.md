# Hush

A sleep-sound mixer that runs entirely in the browser. You can layer rain, ocean, campfire, crickets, lullabies and noise, balance them with sliders, and set a timer that fades everything out as you fall asleep.

Every sound is synthesized live with the Web Audio API. There are no audio files, so nothing loops exactly the same way twice and the whole app is about 30 KB of JavaScript. It's an installable PWA and works offline once loaded.

## Features

- **32 generative sounds** in 7 groups: rain and storm, water, outdoors, cosy indoors, tones, lullabies and noise
- **12 preset mixes**, plus your own saved mixes (stored in `localStorage`)
- **Sleep timer** that fades out over the last 30 seconds
- **Keeps playing overnight**: a screen wake lock (toggle), a silent media element and Media Session lock-screen controls
- **Installable and offline**: a service worker precaches the app and its self-hosted fonts
- Keyboard: <kbd>Space</kbd> toggles play/pause

## Getting started

Requires Node 20+.

```sh
npm install
npm run dev        # http://localhost:5173
```

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                      |
| `npm run build`     | Type-check and build to `dist/`                 |
| `npm run preview`   | Serve the production build (test the PWA here)  |
| `npm test`          | Unit tests (Vitest)                             |
| `npm run typecheck` | `tsc` only                                      |
| `npm run format`    | Prettier                                        |
| `npm run icons`     | Regenerate the PNG app icons in `public/icons/` |

## Project layout

```
index.html              Static page shell
src/
  main.ts               Entry: wires UI to state
  state.ts              App state, persistence, change events
  player.ts             Play/pause, mix changes, sleep timer, saved mixes
  audio/
    context.ts          AudioContext, master bus + compressor, noise buffers
    noise.ts            White / pink / brown noise generation
    nodes.ts            Synthesis helpers: filters, envelopes, scheduler, echo
    notes.ts            Note names → frequencies, melody parsing
    engines.ts          One function per sound
    mixer.ts            Starts, stops and levels individual sounds
  data/                 Sound catalogue, presets, icon paths
  platform/keepalive.ts Wake lock, silent audio, Media Session
  ui/                   Board, bar, mixes, starfield
tests/                  Vitest unit tests
scripts/gen-icons.mjs   Dependency-free PNG icon renderer
```

## Adding a sound

1. Add an entry to `SOUND_GROUPS` in [src/data/sounds.ts](src/data/sounds.ts). Its `id` is stored in saved mixes, so don't rename it later.
2. Add an engine with the same id to `ENGINES` in [src/audio/engines.ts](src/audio/engines.ts). Use `noise()` / `osc()` for continuous sources and `sched()` for events, so the mixer can clean them up when the sound stops.
3. Optionally reference it from a preset in [src/data/presets.ts](src/data/presets.ts).

`npm test` checks that every sound has an engine and an icon, and that every preset references real sounds.

## Deploying

The build is fully static and uses relative paths, so `dist/` can be hosted anywhere. The included GitHub Actions workflow builds and tests every push and PR. Pushes to `main` are also deployed to GitHub Pages once you set **Settings → Pages → Source** to **GitHub Actions**.

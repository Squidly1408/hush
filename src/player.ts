import { ctx, ensureContext, hasContext, masterGain, volumeCurve } from './audio/context';
import { setSoundVolume, stopSound, syncLayers } from './audio/mixer';
import { PRESETS, type Mix } from './data/presets';
import { store } from './lib/storage';
import { keepAlive, lockScreen, setMediaState, unlockScreen } from './platform/keepalive';
import { emit, persistMix, state } from './state';

const MAX_SAVED = 20;
const FADE_SECONDS = 30;

function commit(): void {
  persistMix();
  emit('change');
}

function markCustom(): void {
  state.title = Object.keys(state.mix).length ? 'Custom mix' : 'Nothing selected';
}

function startOrSync(): void {
  if (state.playing) syncLayers(state.mix);
  else play();
}

function rampMaster(volume: number, timeConstant: number): void {
  if (!hasContext()) return;
  const now = ctx().currentTime;
  masterGain().gain.cancelScheduledValues(now);
  masterGain().gain.setTargetAtTime(volumeCurve(volume), now, timeConstant);
}

export function play(): void {
  if (!Object.keys(state.mix).length) applyMix(PRESETS[0].mix, PRESETS[0].name);
  ensureContext(state.masterVolume);
  state.playing = true;
  state.fading = false;
  rampMaster(state.masterVolume, 0.1);
  syncLayers(state.mix);
  keepAlive(true);
  void lockScreen();
  setMediaState(state.title, true);
  emit('change');
}

export function pause(): void {
  state.playing = false;
  if (hasContext()) {
    const ac = ctx();
    masterGain().gain.setTargetAtTime(0, ac.currentTime, 0.12);
    setTimeout(() => {
      if (!state.playing) void ac.suspend();
    }, 450);
  }
  keepAlive(false);
  unlockScreen();
  setMediaState(state.title, false);
  emit('change');
}

export const togglePlay = () => (state.playing ? pause() : play());

/** Tile button: switch a sound on (at its slider level) or off. */
export function toggleSound(id: string, sliderValue: number): void {
  if (id in state.mix) {
    delete state.mix[id];
    stopSound(id);
  } else {
    state.mix[id] = sliderValue || 50;
    startOrSync();
  }
  markCustom();
  commit();
}

/** Tile slider: dragging an off sound above zero switches it on. */
export function setSoundLevel(id: string, value: number): void {
  if (!(id in state.mix)) {
    if (value === 0) return;
    state.mix[id] = value;
    startOrSync();
    markCustom();
  } else {
    state.mix[id] = value;
  }
  setSoundVolume(id, value);
  commit();
}

export function applyMix(mix: Mix, title: string): void {
  for (const id of Object.keys(state.mix)) if (!(id in mix)) stopSound(id);
  state.mix = { ...mix };
  state.title = title;
  for (const [id, v] of Object.entries(mix)) setSoundVolume(id, v, 0.3);
  if (state.playing) syncLayers(state.mix);
  commit();
}

export function setMasterVolume(volume: number): void {
  state.masterVolume = volume;
  store.set('hush.master', volume);
  if (state.playing && !state.fading) rampMaster(volume, 0.05);
}

export function setKeepScreenOn(on: boolean): void {
  state.keepScreenOn = on;
  store.set('hush.wake', on);
  if (on) void lockScreen();
  else unlockScreen();
}

export function setTimer(minutes: number): void {
  state.timerEnd = minutes ? Date.now() + minutes * 60_000 : 0;
  // Changing the timer mid-fade restores full volume.
  if (state.fading && state.playing) rampMaster(state.masterVolume, 0.5);
  state.fading = false;
  if (minutes && !state.playing) play();
  emit('change');
}

function tickTimer(): void {
  if (!state.timerEnd || !state.playing) return;
  const left = (state.timerEnd - Date.now()) / 1000;
  if (left <= FADE_SECONDS && !state.fading && hasContext()) {
    state.fading = true;
    masterGain().gain.setTargetAtTime(0, ctx().currentTime, Math.max(left, 1) / 4);
  }
  if (left <= 0) {
    state.timerEnd = 0;
    state.fading = false;
    pause();
  }
  emit('change');
}

export function startTimerLoop(): void {
  setInterval(tickTimer, 1000);
}

/** Saves the current mix; returns false if nothing is switched on. */
export function saveMix(name: string): boolean {
  if (!Object.keys(state.mix).length) return false;
  const label = name || `Mix ${state.saved.length + 1}`;
  state.saved = [{ name: label, mix: { ...state.mix } }, ...state.saved].slice(0, MAX_SAVED);
  store.set('hush.saved', state.saved);
  state.title = label;
  commit();
  emit('saved');
  return true;
}

export function deleteSaved(index: number): void {
  state.saved.splice(index, 1);
  store.set('hush.saved', state.saved);
  emit('saved');
}

/** Coming back to the tab: browsers may have suspended audio or dropped the wake lock. */
export function resumeIfPlaying(): void {
  if (!state.playing) return;
  if (hasContext() && ctx().state !== 'running') void ctx().resume();
  keepAlive(true);
  void lockScreen();
}

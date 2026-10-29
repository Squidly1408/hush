/**
 * Keeping a sleep app audible all night: a silent looping <audio> element nudges mobile
 * browsers to treat the page as media playback, a wake lock keeps the screen on if wanted,
 * and Media Session wires up lock-screen controls.
 */
import { state } from '../state';

/** One second of near-silent 8 kHz mono PCM as a data: URL. */
function silentWav(): string {
  const sr = 8000;
  const n = sr;
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const ascii = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  ascii(0, 'RIFF');
  v.setUint32(4, 36 + n * 2, true);
  ascii(8, 'WAVE');
  ascii(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, sr, true);
  v.setUint32(28, sr * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  ascii(36, 'data');
  v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, i % 2 ? 1 : -1, true);
  let s = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return 'data:audio/wav;base64,' + btoa(s);
}

let keepEl: HTMLAudioElement | null = null;

export function keepAlive(on: boolean): void {
  keepEl ??= document.querySelector<HTMLAudioElement>('#keep');
  if (!keepEl) return;
  try {
    if (on) {
      if (!keepEl.src) keepEl.src = silentWav();
      keepEl.volume = 0.01;
      keepEl.play().catch(() => {});
    } else {
      keepEl.pause();
    }
  } catch {
    // Autoplay restrictions; Web Audio still plays while the page is visible.
  }
}

let wakeLock: WakeLockSentinel | null = null;

export async function lockScreen(): Promise<void> {
  if (!state.keepScreenOn || !state.playing || wakeLock || !('wakeLock' in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      wakeLock = null;
    });
  } catch {
    // Denied (e.g. low battery); not critical.
  }
}

export function unlockScreen(): void {
  if (!wakeLock) return;
  wakeLock.release().catch(() => {});
  wakeLock = null;
}

export function setupMediaSession(handlers: { play: () => void; pause: () => void }): void {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.setActionHandler('play', handlers.play);
    navigator.mediaSession.setActionHandler('pause', handlers.pause);
  } catch {
    // Unsupported action
  }
}

export function setMediaState(title: string, playing: boolean): void {
  if (!('mediaSession' in navigator)) return;
  try {
    if (playing) navigator.mediaSession.metadata = new MediaMetadata({ title, artist: 'Hush' });
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  } catch {
    // MediaMetadata missing in older browsers
  }
}

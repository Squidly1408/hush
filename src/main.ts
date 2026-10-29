import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/500.css';
import '@fontsource/figtree/600.css';
import './styles.css';

import { setupMediaSession } from './platform/keepalive';
import { pause, play, resumeIfPlaying, startTimerLoop } from './player';
import { subscribe } from './state';
import { bindBar, renderBar } from './ui/bar';
import { renderBoard, renderTiles } from './ui/board';
import { $ } from './ui/dom';
import { bindSaved, renderPresets, renderSaved } from './ui/mixes';
import { startStars } from './ui/stars';

renderBoard();
renderPresets();
bindSaved();
renderSaved();
bindBar();

subscribe('change', () => {
  renderTiles();
  renderBar();
});
subscribe('saved', renderSaved);
renderTiles();
renderBar();

startTimerLoop();
setupMediaSession({ play, pause });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') resumeIfPlaying();
});

startStars($<HTMLCanvasElement>('#stars'));

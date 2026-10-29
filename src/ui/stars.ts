interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
}

/** Twinkling starfield behind the header; holds still under prefers-reduced-motion. */
export function startStars(canvas: HTMLCanvasElement): void {
  const g = canvas.getContext('2d');
  if (!g) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars: Star[] = [];
  let w = 0;
  let h = 0;

  function size() {
    const dpr = devicePixelRatio || 1;
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    g!.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round((w * h) / 2200) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.8,
    }));
    if (still) draw(0);
  }

  function draw(t: number) {
    g!.clearRect(0, 0, w, h);
    for (const s of stars) {
      const a = still ? 0.6 : 0.35 + 0.45 * Math.sin(s.phase + (t / 1000) * s.speed);
      g!.fillStyle = `rgba(233,230,243,${a * (1 - (s.y / h) * 0.7)})`;
      g!.beginPath();
      g!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      g!.fill();
    }
  }

  function loop(t: number) {
    draw(t);
    requestAnimationFrame(loop);
  }

  size();
  addEventListener('resize', size);
  if (!still) requestAnimationFrame(loop);
}

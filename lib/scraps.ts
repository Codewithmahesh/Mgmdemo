/* Paper scraps that fly off when the portal hits the old steps. */

interface Scrap {
  x: number; y: number; vx: number; vy: number;
  w: number; h: number; rot: number; vr: number; fl: number; vf: number;
  c: string; age: number; life: number;
}

export interface Rect { left: number; right: number; top: number; bottom: number; width: number; height: number }

const COLORS = ['#faf9f5', '#efe9de', '#e8a55a', '#d97757', '#f5f0e8', '#fbfbf7', '#e6dfd8', '#ffe97a', '#c64545', '#2f8a78'];

export function createScraps(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let P: Scrap[] = [];
  let raf = 0;
  let lastT = 0;

  function size() {
    const d = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(window.innerWidth * d);
    canvas.height = Math.round(window.innerHeight * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  function loop(now: number) {
    const dt = Math.min(40, now - lastT);
    lastT = now;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const g = 0.0024 * (window.innerWidth / 1920);
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.age += dt; p.vy += g * dt; p.vx *= 0.9965; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.fl += p.vf * dt;
      if (p.age > p.life || p.y > window.innerHeight + 60) { P.splice(i, 1); continue; }
      const a = 1 - Math.max(0, (p.age - p.life * 0.6) / (p.life * 0.4));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, (-p.h / 2) * Math.abs(Math.cos(p.fl)), p.w, p.h * Math.abs(Math.cos(p.fl)) + 1);
      ctx.restore();
    }
    if (P.length) raf = requestAnimationFrame(loop);
    else { raf = 0; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
  }

  return {
    size,
    burst(rect: Rect) {
      const k = window.innerWidth / 1920;
      for (let i = 0; i < 170; i++) {
        const side = Math.random();
        let x: number, y: number, vx: number, vy: number;
        if (side < 0.45) { x = rect.left + Math.random() * rect.width; y = rect.bottom - 6; vx = (Math.random() - 0.5) * 1.1; vy = -(0.25 + Math.random() * 0.9); }
        else if (side < 0.725) { x = rect.left + 8; y = rect.top + rect.height * (0.4 + Math.random() * 0.6); vx = -(0.35 + Math.random() * 1.5); vy = -(0.1 + Math.random() * 0.9); }
        else { x = rect.right - 8; y = rect.top + rect.height * (0.4 + Math.random() * 0.6); vx = 0.35 + Math.random() * 1.5; vy = -(0.1 + Math.random() * 0.9); }
        P.push({
          x, y, vx: vx * k * 1.15, vy: vy * k * 1.15,
          w: (6 + Math.random() * 16) * k * 1.2, h: (5 + Math.random() * 10) * k * 1.2,
          rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.02, fl: Math.random() * 6.28, vf: 0.004 + Math.random() * 0.01,
          c: COLORS[(Math.random() * COLORS.length) | 0], age: 0, life: 1300 + Math.random() * 900,
        });
      }
      if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(loop); }
    },
    clear() {
      P = [];
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    },
  };
}

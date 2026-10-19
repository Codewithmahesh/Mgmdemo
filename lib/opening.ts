import { CARDS } from './content';
import { createSfx } from './sfx';
import { createScraps } from './scraps';

/*
 * The timeline of the opener.
 *
 *   title -> three (presses 1-7: row, cube, spin that lands on the package name) -> playing (six old steps land)
 *         -> hold (waits for you) -> smash (portal drops) -> final ("One platform.")
 *
 * React renders the markup once (components/Scene.tsx). This file only toggles classes and runs animations on it.
 */

export type Phase = 'title' | 'three' | 'playing' | 'hold' | 'smash' | 'final';

export interface OpeningOptions {
  pace: number;
  onMutedChange?: (muted: boolean) => void;
}

export interface Opening {
  destroy(): void;
  reset(): void;
  skip(): void;
  press(): void;
  back(): void;
  toggleSound(): void;
  fullscreen(): void;
  state(): string;
}

interface Geo {
  W: number; H: number; cx: number; cy: number; s: number; X: number; Y: number;
  rect: { left: number; right: number; top: number; bottom: number; width: number; height: number };
}

export function createOpening(app: HTMLElement, opts: OpeningOptions): Opening {
  const PACE = opts.pace;
  const q = <T extends Element>(sel: string): T => {
    const el = app.querySelector<T>(sel);
    if (!el) throw new Error(`Opener markup is missing ${sel}`);
    return el;
  };

  const world = q<HTMLElement>('#world');
  const stage = q<HTMLElement>('#stage');
  const cap = q<HTMLElement>('#caption');
  const win = q<HTMLElement>('#win');
  const num = q<HTMLElement>('#num');
  const lbl = q<HTMLElement>('#lbl');
  const shadow = q<HTMLElement>('#shadow');
  const ring = q<HTMLElement>('#ring');
  const flash = q<HTMLElement>('#flash');
  const go = q<HTMLAnchorElement>('#go');
  const cube = q<HTMLElement>('#cube');
  const sceneThree = q<HTMLElement>('.s-three');
  const fx = q<HTMLCanvasElement>('#fx');
  const tis = Array.from(app.querySelectorAll<HTMLElement>('.ti'));
  const els = Array.from(app.querySelectorAll<HTMLElement>('.card'));
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const sfx = createSfx(PACE);
  const scraps = createScraps(fx);

  let phase: Phase = 'title';
  let step = 0;
  let timers: ReturnType<typeof setTimeout>[] = [];
  let anims: Animation[] = [];
  let idle: ReturnType<typeof setTimeout> | undefined;
  let geo: Geo | null = null;
  let shadowAnim: Animation | null = null;

  /* ---------- helpers ---------- */
  function at(ms: number, fn: () => void) { timers.push(setTimeout(fn, ms * PACE)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function anim(el: Element, frames: Keyframe[], o: KeyframeAnimationOptions, onfinish?: () => void) {
    const a = el.animate(frames, { ...o, duration: (o.duration as number) * PACE });
    anims.push(a);
    if (onfinish) a.onfinish = onfinish;
    return a;
  }
  function stopAll() {
    clearTimers();
    anims.forEach((a) => { try { a.cancel(); } catch { /* ignore */ } });
    anims = [];
    scraps.clear();
  }
  function setCount(n: number, portal = false) {
    if (num.textContent !== String(n)) {
      num.textContent = String(n);
      num.classList.remove('tick');
      void num.offsetWidth;
      num.classList.add('tick');
    }
    lbl.textContent = portal ? 'platform' : n === 1 ? 'manual step' : 'manual steps';
  }
  const T = (x: number, y: number, rot: number, sx: number, sy: number) =>
    `translate(${x}px,${y}px) rotate(${rot}deg) scale(${sx},${sy})`;

  function measure() {
    const W = window.innerWidth, H = window.innerHeight, r = stage.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let s = Math.min(0.54, (r.height * 0.97) / H);
    s = Math.max(s, 0.3);
    const X = cx - W / 2, Y = cy + (H * s) / 2 - H;
    geo = {
      W, H, cx, cy, s, X, Y,
      rect: { left: cx - (W * s) / 2, right: cx + (W * s) / 2, top: cy - (H * s) / 2, bottom: cy + (H * s) / 2, width: W * s, height: H * s },
    };
    shadow.style.width = `${W * s * 1.55}px`;
    shadow.style.height = `${H * s * 1.25}px`;
    shadow.style.left = `${cx - W * s * 0.775}px`;
    shadow.style.top = `${cy - H * s * 0.625}px`;
    ring.style.left = `${cx - ring.offsetWidth / 2}px`;
    ring.style.top = `${cy + (H * s) / 2 - ring.offsetHeight / 2}px`;
  }

  /* ---------- the three beats: row (1-3), cube (4-6), spin (7) ---------- */
  function cubeAt(deg: number, dur: number, sc: number) {
    cube.style.setProperty('--td', `${dur}s`);
    cube.style.setProperty('--ry', `${deg}deg`);
    cube.style.setProperty('--sc', String(sc));
  }
  /* put the scene in the state for a given press count, without sound */
  function render(n: number) {
    step = n;
    tis.forEach((el, i) => el.classList.toggle('on', i < Math.min(n, 3)));
    sceneThree.classList.toggle('cube-on', n >= 4);
    if (n < 4) cubeAt(40, 0, 0.35);
    else if (n <= 6) cubeAt(-(n - 4) * 90, 0, 1);
    else cubeAt(-630, 0, 1); /* the last face: the package name */
  }
  function reveal(n: number) {
    if (n <= 3) {
      render(n);
      sfx.beat(n - 1);
    } else if (n === 4) {
      step = 4;
      sceneThree.classList.add('cube-on');
      cubeAt(40, 0, 0.35);
      void cube.offsetWidth;
      cubeAt(0, 0.9, 1);
      sfx.whoosh(0.5);
    } else if (n === 5 || n === 6) {
      step = n;
      cubeAt(-(n - 4) * 90, 0.8, 1);
      sfx.whoosh(0.5);
    } else if (n === 7) {
      step = 7; /* fast spin: Arena, Studio, Pocket again, then it lands on the package name */
      for (let k = 0; k < 4; k++) {
        const last = k === 3;
        timers.push(setTimeout(() => { cubeAt(-360 - k * 90, last ? 0.8 : 0.42, 1); sfx.whoosh(0.5); }, k * 480));
      }
    }
  }
  function startThree() {
    if (phase !== 'title') return;
    phase = 'three';
    sfx.unlock();
    app.dataset.phase = 'three';
    reveal(1);
  }

  /* ---------- the old steps, the drop, the smash ---------- */
  function land(i: number) {
    els[i].classList.add('shown');
    setCount(i + 1);
    sfx.tap(i);
    if (!reduce) anim(world, [{ transform: 'translateY(0)' }, { transform: 'translateY(.7vh)' }, { transform: 'translateY(0)' }], { duration: 170 });
  }
  function tension() {
    app.classList.add('agitate', 'tense');
    stage.classList.add('press');
    cap.classList.add('show');
    sfx.riser(0.8 * PACE);
  }
  function freeze() { app.classList.remove('agitate'); }
  function drop() {
    const g = geo!, D = 430;
    cap.classList.remove('show');
    win.classList.add('on');
    sfx.whoosh((D / 1000) * PACE);
    shadowAnim = anim(shadow, [{ opacity: 0, transform: 'scale(.55)' }, { opacity: 1, transform: 'scale(1.05)' }], { duration: D, easing: 'cubic-bezier(.5,0,1,.7)', fill: 'forwards' });
    anim(
      win,
      [{ transform: T(g.X, -g.H - 90, -5, g.s, g.s) }, { transform: T(g.X, g.Y, 0, g.s, g.s) }],
      { duration: D, easing: 'cubic-bezier(.62,.05,.95,.62)', fill: 'forwards' },
      () => { win.style.transform = T(g.X, g.Y, 0, g.s, g.s); },
    );
  }
  function impact() {
    const g = geo!;
    app.classList.remove('tense', 'agitate');
    app.classList.add('is-one');
    stage.classList.remove('press');
    if (shadowAnim) { try { shadowAnim.cancel(); } catch { /* ignore */ } shadowAnim = null; }
    setCount(1, true);
    sfx.boom(); sfx.crackle();
    scraps.burst(g.rect);

    anim(flash, [{ opacity: 0.95 }, { opacity: 0 }], { duration: 380, easing: 'ease-out' });
    anim(ring, [{ opacity: 0.9, transform: 'scale(.15)' }, { opacity: 0, transform: 'scale(3.4)' }], { duration: 720, easing: 'cubic-bezier(.1,.7,.2,1)' });
    if (!reduce) {
      anim(world, [
        { transform: 'translate(0,0)' }, { transform: 'translate(-1.5vw,1vh)' }, { transform: 'translate(1.2vw,-.9vh)' },
        { transform: 'translate(-.8vw,.6vh)' }, { transform: 'translate(.5vw,-.4vh)' }, { transform: 'translate(-.25vw,.2vh)' }, { transform: 'translate(0,0)' },
      ], { duration: 560, easing: 'linear' });
    }
    anim(
      win,
      [
        { transform: T(g.X, g.Y, 0, g.s, g.s) },
        { transform: T(g.X, g.Y, 0, g.s * 1.05, g.s * 0.9), offset: 0.2 },
        { transform: T(g.X, g.Y, 0, g.s * 0.99, g.s * 1.025), offset: 0.55 },
        { transform: T(g.X, g.Y, 0, g.s, g.s) },
      ],
      { duration: 440, easing: 'ease-out', fill: 'forwards' },
      () => { win.style.transform = T(g.X, g.Y, 0, g.s, g.s); },
    );

    els.forEach((el, i) => {
      const c = CARDS[i], rot = c.r;
      const dx = (c.x - 50) * 1.7, dy = (c.y - 50) * 0.9 - 14;
      const base = `translate(-50%,-50%) translate(0px,0px) rotate(${rot}deg)`;
      anim(el, [
        { transform: `${base} scale(1,1)`, opacity: 1, offset: 0, easing: 'ease-in' },
        { transform: `translate(-50%,-50%) translate(0px,2vh) rotate(${rot}deg) scale(1.1,.1)`, opacity: 1, offset: 0.14, easing: 'cubic-bezier(.1,.8,.3,1)' },
        { transform: `translate(-50%,-50%) translate(${dx}vw,${dy}vh) rotate(${rot + (c.x < 50 ? -1 : 1) * (160 + i * 25)}deg) scale(.35,.2)`, opacity: 0, offset: 1 },
      ], { duration: 800, fill: 'forwards' }, () => el.classList.add('gone'));
    });
  }
  function zoom() {
    const g = geo!;
    sfx.swoosh();
    anim(
      win,
      [
        { transform: T(g.X, g.Y, 0, g.s, g.s), borderRadius: '2vw' },
        { transform: 'none', borderRadius: '0px' },
      ],
      { duration: 780, easing: 'cubic-bezier(.7,0,.15,1)', fill: 'forwards' },
      showFinal,
    );
  }
  function showFinal() {
    phase = 'final';
    stopAll();
    els.forEach((el) => { el.classList.add('gone'); el.classList.remove('shown'); });
    world.style.visibility = 'hidden';
    app.classList.remove('agitate', 'tense');
    app.dataset.phase = 'final';
    win.classList.add('on', 'full');
    win.style.transform = 'none';
    win.style.borderRadius = '0';
    shadow.style.opacity = '0';
    sfx.ding();
    try { go.focus({ preventScroll: true }); } catch { /* ignore */ }
  }

  /* the old exam steps pile up, then wait */
  function play() {
    if (phase !== 'three') return;
    phase = 'playing';
    sfx.unlock();
    measure();
    app.dataset.phase = 'old';
    setCount(1);
    const OFF = 350; /* lets the three beats fade out first */
    [0, 650, 1210, 1690, 2110, 2470].forEach((ms, i) => at(OFF + ms, () => land(i)));
    at(OFF + 2900, hold);
  }
  /* the six manual steps stay on screen until the next press */
  function hold() {
    if (phase !== 'playing') return;
    phase = 'hold';
    cap.classList.add('show');
  }
  /* next press: tension, the portal drops, smash, zoom */
  function smash() {
    if (phase !== 'hold') return;
    phase = 'smash';
    measure();
    tension();
    at(800, freeze);
    at(980, drop);
    at(1410, impact);
    at(2180, zoom);
  }
  function skip() {
    if (phase !== 'playing') return;
    clearTimers();
    els.forEach((el) => el.classList.add('shown'));
    setCount(els.length);
    hold();
  }
  function reset() {
    stopAll();
    phase = 'title';
    step = 0;
    app.dataset.phase = 'title';
    app.classList.remove('agitate', 'tense', 'is-one');
    stage.classList.remove('press');
    cap.classList.remove('show');
    tis.forEach((el) => el.classList.remove('on'));
    sceneThree.classList.remove('cube-on');
    cubeAt(40, 0, 0.35);
    els.forEach((el) => el.classList.remove('shown', 'gone'));
    win.classList.remove('on', 'full');
    win.style.transform = '';
    win.style.borderRadius = '';
    world.style.visibility = '';
    shadow.style.opacity = '0';
    setCount(1);
    if (document.activeElement === go) go.blur();
  }

  /* ---------- controls ---------- */
  function press() {
    if (phase === 'title') startThree();
    else if (phase === 'three') { if (step < 7) reveal(step + 1); else play(); }
    else if (phase === 'playing') skip();
    else if (phase === 'hold') smash();
    else if (phase === 'smash') showFinal();
    else if (phase === 'final') go.click();
  }
  function back() {
    if (phase === 'three') {
      clearTimers();
      if (step > 1) render(step - 1); else reset();
    } else reset();
  }
  function toggleSound() {
    sfx.setMuted(!sfx.muted);
    opts.onMutedChange?.(sfx.muted);
  }
  function fullscreen() {
    try {
      const p = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
      p?.catch(() => {});
    } catch { /* ignore */ }
  }
  function wake() {
    app.classList.add('awake');
    clearTimeout(idle);
    idle = setTimeout(() => app.classList.remove('awake'), 3000);
  }

  function onKey(e: KeyboardEvent) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    const target = e.target as Element | null;
    if (target?.closest?.('button') && (k === ' ' || k === 'Enter')) return;
    if ([' ', 'Enter', 'ArrowRight', 'ArrowDown', 'PageDown'].includes(k)) { e.preventDefault(); press(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); back(); }
    else if (k === 'Home' || k === 'r' || k === 'R') { e.preventDefault(); reset(); }
    else if (k === 'f' || k === 'F') fullscreen();
    else if (k === 'm' || k === 'M') toggleSound();
  }
  function onClick(e: MouseEvent) {
    if ((e.target as Element).closest('a, button')) return;
    if (phase !== 'final') press();
  }

  document.addEventListener('keydown', onKey);
  app.addEventListener('click', onClick);
  const wakeEvents = ['mousemove', 'touchstart', 'focusin'] as const;
  wakeEvents.forEach((ev) => document.addEventListener(ev, wake, { passive: true }));
  window.addEventListener('resize', scraps.size);

  scraps.size();
  reset();
  wake();

  return {
    destroy() {
      stopAll();
      clearTimeout(idle);
      document.removeEventListener('keydown', onKey);
      app.removeEventListener('click', onClick);
      wakeEvents.forEach((ev) => document.removeEventListener(ev, wake));
      window.removeEventListener('resize', scraps.size);
    },
    reset, skip, press, back, toggleSound, fullscreen,
    state: () => `${phase}:${step}`,
  };
}

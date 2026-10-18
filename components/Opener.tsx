'use client';

import { useEffect, useRef, useState } from 'react';
import { PACE } from '@/lib/content';
import { createOpening, type Opening } from '@/lib/opening';
import Scene from './Scene';

declare global {
  interface Window {
    /** Handy for rehearsal and tests: __opening.press(), __opening.state(). */
    __opening?: Pick<Opening, 'reset' | 'skip' | 'press' | 'state'>;
  }
}

export default function Opener({ portalUrl }: { portalUrl: string }) {
  const appRef = useRef<HTMLElement>(null);
  const openingRef = useRef<Opening | null>(null);
  const [muted, setMuted] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(true);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    const opening = createOpening(app, { pace: PACE, onMutedChange: setMuted });
    openingRef.current = opening;
    setCanFullscreen(!!document.fullscreenEnabled);
    window.__opening = { reset: opening.reset, skip: opening.skip, press: opening.press, state: opening.state };
    return () => {
      opening.destroy();
      openingRef.current = null;
      delete window.__opening;
    };
  }, []);

  return (
    <main className="app awake" id="app" data-phase="title" ref={appRef}>
      <Scene portalUrl={portalUrl} />
      <footer className="ctrl">
        <button type="button" onClick={() => openingRef.current?.reset()}>Replay (R)</button>
        <button type="button" onClick={() => openingRef.current?.toggleSound()}>Sound: {muted ? 'off' : 'on'} (M)</button>
        {canFullscreen && <button type="button" onClick={() => openingRef.current?.fullscreen()}>Fullscreen (F)</button>}
      </footer>
    </main>
  );
}

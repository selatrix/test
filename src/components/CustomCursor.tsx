import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────
   CustomCursor
   • Zero-latency: direct DOM style writes, no React re-renders
   • Smooth fade: CSS transition on opacity only
   • Hidden on touch/mobile (pointer: coarse)
   ───────────────────────────────────────────────────────────── */
export const CustomCursor = () => {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const posRef   = useRef({ x: -200, y: -200 });
  const clickRef = useRef(false);

  useEffect(() => {
    /* Don't activate on touch devices */
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const wrap = wrapRef.current;
    const ring = ringRef.current;
    if (!wrap || !ring) return;

    const move = () => {
      wrap.style.transform =
        `translate(${posRef.current.x - 14}px, ${posRef.current.y - 14}px)` +
        (clickRef.current ? ' scale(0.72)' : '');
    };

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      move();
      wrap.style.opacity = '1';
    };

    const onLeave  = () => { wrap.style.opacity = '0'; };
    const onEnter  = () => { wrap.style.opacity = '1'; };

    const onDown = () => {
      clickRef.current = true;
      ring.style.borderColor = '#00ffff';
      move();
    };
    const onUp = () => {
      clickRef.current = false;
      ring.style.borderColor = 'rgba(255,255,255,0.85)';
      move();
    };

    /* passive:true lets the browser skip waiting for preventDefault */
    document.addEventListener('mousemove',  onMove,  { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
    };
  }, []);

  /* Render nothing on touch devices */
  if (typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <div
      ref={wrapRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        pointerEvents: 'none',
        zIndex:        99999,
        opacity:       0,
        willChange:    'transform',
        /* smooth fade in/out only — transform is set directly, no CSS transition */
        transition:    'opacity 0.28s ease',
        transform:     'translate(-200px, -200px)',
      }}
    >
      <div
        ref={ringRef}
        style={{
          width:           28,
          height:          28,
          border:          '1.5px solid rgba(255,255,255,0.85)',
          borderRadius:    '50%',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          transition:      'border-color 0.08s',
        }}
      >
        <div style={{
          width:        4,
          height:       4,
          background:   'white',
          borderRadius: '50%',
        }} />
      </div>
    </div>
  );
};

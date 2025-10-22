'use client';

import { useEffect, useRef } from 'react';

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const update = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight <= 0 ? 0 : Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
      bar.style.setProperty('--progress-value', progress.toString());
    };

    update();

    const handleScroll = () => {
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__track">
        <div ref={barRef} className="scroll-progress__bar">
          <span className="scroll-progress__glow" />
        </div>
      </div>
    </div>
  );
}

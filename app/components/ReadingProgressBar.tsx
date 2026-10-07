import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export function ReadingProgressBar() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [canScroll, setCanScroll] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const update = () => {
      const scrollEl = document.scrollingElement || document.documentElement;
      const total = (scrollEl?.scrollHeight || 0) - window.innerHeight;
      const enable = total > 0;
      setCanScroll(enable);

      if (!barRef.current) return;
      if (!enable) {
        barRef.current.style.transform = "scaleX(0)";
        return;
      }

      const progress = Math.min(1, Math.max(0, window.scrollY / total));
      barRef.current.style.transform = `scaleX(${progress})`;
    };

    const onScrollOrResize = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div
      className="reading-progress"
      style={{ opacity: canScroll && !isAdmin ? 1 : 0 }}
      aria-hidden="true"
    >
      <div ref={barRef} className="reading-progress__bar" />
    </div>
  );
}

export default ReadingProgressBar;
// packages/trader/src/Modules/Contract/Components/LastDigitPrediction/red-cursor.tsx
import React from 'react';

type RedCursorProps = {
  containerRef: React.RefObject<HTMLElement>;
  targetDigit: number | null; // 0..9 or null to hide
  offsetY?: number; // vertical offset below the digit element in px
  width?: number; // desired cursor width in px (optional)
};

const RedCursor = ({ containerRef, targetDigit, offsetY = 8, width = 52 }: RedCursorProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const cursor = ref.current;
    const container = containerRef.current;
    if (!cursor || !container || targetDigit == null) {
      if (cursor) cursor.style.opacity = '0';
      return;
    }

    // The digits use data-digit attributes, so we can select deterministically.
    const target = container.querySelector<HTMLElement>(`[data-digit="${targetDigit}"]`);
    if (!target) {
      cursor.style.opacity = '0';
      return;
    }

    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();

    // center cursor under the target
    const left = tRect.left - cRect.left + tRect.width / 2 - width / 2;
    const top = tRect.top - cRect.top + tRect.height + offsetY;

    cursor.style.opacity = '1';
    cursor.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
  }, [containerRef, targetDigit, offsetY, width]);

  return (
    <div
      ref={ref}
      className="digits__cursor"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${width}px`,
        height: '10px',
        borderRadius: '6px',
        background: 'linear-gradient(90deg,#ff6b6b,#e60000)',
        boxShadow: '0 6px 16px rgba(230,0,0,0.16)',
        transition: 'transform 360ms cubic-bezier(.22,.9,.26,1), opacity 200ms',
        pointerEvents: 'none',
        opacity: 0,
        zIndex: 1000,
        willChange: 'transform, opacity',
      }}
    />
  );
};

export default RedCursor;

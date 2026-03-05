import { useRef, useState } from 'react';

/**
 * Wraps a story in a horizontally resizable container.
 * Drag the right-edge handle to test layout at any container width.
 * For use in Storybook decorators only — never import into component source.
 */
export function ResizablePreview({
  children,
  padding = '2rem 3rem',
}: {
  children: React.ReactNode;
  padding?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  function adjustWidth(delta: number) {
    const current = ref.current?.offsetWidth ?? width ?? 800;
    setWidth(Math.max(320, current + delta));
  }

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = ref.current?.offsetWidth ?? 800;

    function onMove(e: MouseEvent) {
      if (!dragging.current) return;
      setWidth(Math.max(320, startW.current + (e.clientX - startX.current)));
    }
    function onUp() {
      dragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: width != null ? `${width}px` : '100%',
        maxWidth: '100%',
        minWidth: 320,
        padding,
        boxSizing: 'border-box',
      }}
    >
      {children}

      {/* Drag handle */}
      <button
        type="button"
        onMouseDown={onMouseDown}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            adjustWidth(-16);
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            adjustWidth(16);
          }
        }}
        title="Drag to resize"
        aria-label="Resize preview width"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 12,
          cursor: 'ew-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          border: 0,
          background: 'transparent',
          padding: 0,
        }}
      >
        <div style={{ width: 3, height: 32, borderRadius: 2, background: 'rgba(0,0,0,0.18)' }} />
      </button>

      {/* Width badge shown while dragging */}
      {width != null && (
        <div style={{
          position: 'absolute',
          right: 16,
          top: 8,
          fontSize: 11,
          lineHeight: 1,
          fontFamily: 'monospace',
          color: 'rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}>
          {width}px
        </div>
      )}
    </div>
  );
}

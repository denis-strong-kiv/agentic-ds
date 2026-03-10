'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../../utils/cn';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn('ui-tooltip-content', className)}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// ─── Mono Tooltip ─────────────────────────────────────────────────────────────
//
// A single shared tooltip instance that stays mounted while the user moves
// between nearby triggers. Content swaps instantly instead of close → reopen,
// eliminating flicker when targets are densely packed.
//
// Usage:
//   <MonoTooltipProvider>
//     <MonoTooltip content="New York — JFK"><span>JFK</span></MonoTooltip>
//     <MonoTooltip content="London — LHR"><span>LHR</span></MonoTooltip>
//   </MonoTooltipProvider>

interface MonoTooltipContextValue {
  show: (content: React.ReactNode, rect: DOMRect) => void;
  hide: () => void;
}

const MonoTooltipContext = React.createContext<MonoTooltipContextValue | null>(null);

export function MonoTooltipProvider({
  children,
  skipDelay = 200,
  tooltipClassName,
}: {
  children: React.ReactNode;
  skipDelay?: number;
  tooltipClassName?: string;
}) {
  const [state, setState] = React.useState<{
    content: React.ReactNode;
    x: number;
    y: number;
    contentKey: number;
  } | null>(null);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const show = React.useCallback((content: React.ReactNode, rect: DOMRect) => {
    clearTimeout(hideTimer.current);
    setState(prev => ({
      content,
      x: rect.left + rect.width / 2,
      y: rect.top,
      contentKey: (prev?.contentKey ?? -1) + 1,
    }));
  }, []);

  const hide = React.useCallback(() => {
    hideTimer.current = setTimeout(() => setState(null), skipDelay);
  }, [skipDelay]);

  // After each position update, clamp to viewport so the tooltip never
  // overflows left or right of the screen. Runs before paint — no flicker.
  React.useLayoutEffect(() => {
    const el = tooltipRef.current;
    if (!el || !state) return;
    const { left, right } = el.getBoundingClientRect();
    const pad = 8;
    const vw = window.innerWidth;
    if (left < pad) {
      el.style.left = `${state.x + (pad - left)}px`;
    } else if (right > vw - pad) {
      el.style.left = `${state.x - (right - (vw - pad))}px`;
    }
  }, [state]);

  return (
    <MonoTooltipContext.Provider value={{ show, hide }}>
      {children}
      {state !== null && createPortal(
        <div
          ref={tooltipRef}
          className={cn('ui-mono-tooltip-content', tooltipClassName)}
          style={{ left: state.x, top: state.y }}
          aria-hidden
        >
          <div key={state.contentKey} className="ui-mono-tooltip-inner">
            {state.content}
          </div>
        </div>,
        document.body,
      )}
    </MonoTooltipContext.Provider>
  );
}

// Wrap any DOM element to participate in the nearest MonoTooltipProvider.
// Uses cloneElement — adds no extra DOM node.
// Falls back to a regular Tooltip when used outside a MonoTooltipProvider.
export function MonoTooltip({
  children,
  content,
}: {
  children: React.ReactElement;
  content: React.ReactNode;
}) {
  const ctx = React.useContext(MonoTooltipContext);

  if (!ctx) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.cloneElement(children, {
    onMouseEnter(e: React.MouseEvent<HTMLElement>) {
      ctx.show(content, e.currentTarget.getBoundingClientRect());
    },
    onMouseLeave() {
      ctx.hide();
    },
  } as any);
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

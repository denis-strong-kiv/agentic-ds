import '@testing-library/jest-dom';

// ─── ResizeObserver polyfill ──────────────────────────────────────────────────
// Required by @radix-ui/react-slider and @radix-ui/react-use-size
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// ─── PointerCapture polyfill ──────────────────────────────────────────────────
// Required by @radix-ui/react-select — jsdom does not implement pointer capture
if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false;
}
if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = () => {};
}
if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = () => {};
}

// ─── scrollIntoView polyfill ──────────────────────────────────────────────────
// Radix UI calls scrollIntoView on focusable items; jsdom stub
if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => {};
}

import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Represent a user, traveller profile, or airline/partner brand with a photo or initials fallback. Use in navigation headers, booking summaries, passenger lists, and review cards.',
    whenNotToUse: 'Arbitrary images or icons that are not identity representations (use AspectRatio + img or Icon instead).',
    alternatives: ['Icon — for non-person entity icons', 'AspectRatio — for proportional media not representing identity'],
    preferOver: 'Raw <img> with manual fallback logic and circular CSS.',
  },
  behavior: {
    states: ['image loaded', 'image loading (Radix delays fallback)', 'image error (fallback shown)', 'with status indicator (online/away/busy/offline)'],
    interactions: ['None on Avatar itself; wrap in a button or link if clickable'],
    animations: ['AvatarFallback fades in after image load delay (Radix default)'],
    responsive: 'Fixed-size circle; use Tailwind size utilities on the wrapper to scale.',
  },
  accessibility: {
    role: 'img (AvatarStatus uses role="img" with aria-label for the status dot)',
    keyboardNav: 'No inherent keyboard interaction. If the avatar is interactive, wrap it in a button.',
    ariaAttributes: ['AvatarImage should have a descriptive alt attribute', 'AvatarStatus has aria-label matching the status string (e.g., "online")'],
    wcag: ['1.1.1 Non-text Content — alt text on AvatarImage', '1.4.3 Contrast — fallback initials must meet contrast ratio'],
    screenReader: 'Provide alt on AvatarImage. AvatarFallback content (initials) is read as text when the image is absent. AvatarStatus announces its status via aria-label.',
  },
  examples: [
    { label: 'User with photo', code: '<Avatar>\n  <AvatarImage src={user.photoUrl} alt={user.name} />\n  <AvatarFallback>{user.initials}</AvatarFallback>\n</Avatar>' },
    { label: 'With online status', code: '<div className="relative inline-flex">\n  <Avatar>\n    <AvatarImage src={agent.photoUrl} alt={agent.name} />\n    <AvatarFallback>{agent.initials}</AvatarFallback>\n  </Avatar>\n  <AvatarStatus status="online" />\n</div>' },
    { label: 'Initials-only fallback', code: '<Avatar>\n  <AvatarFallback>JD</AvatarFallback>\n</Avatar>' },
  ],
};

/**
 * Shared type for co-located component metadata files.
 * Each component may ship a [name].metadata.ts alongside [name].tsx.
 * The AI manifest compiler reads these at build time.
 */

export interface ComponentMetadataShape {
  /** When and why to use this component. Guidance for AI selection. */
  aiHints: {
    /** Plain-language description of ideal use cases */
    whenToUse: string;
    /** Situations where this component is a poor fit */
    whenNotToUse?: string;
    /** Other components that solve similar problems */
    alternatives?: string[];
    /** Components this should be preferred over, and why */
    preferOver?: string;
    /** Hard constraints — never use for these */
    neverUseFor?: string;
  };

  /** Runtime interaction model */
  behavior: {
    /** Visual/interactive states the component can be in */
    states: string[];
    /** User interactions the component responds to */
    interactions: string[];
    /** Motion/animation descriptions */
    animations?: string[];
    /** Responsive behaviour notes */
    responsive?: string;
  };

  /** Accessibility contract */
  accessibility: {
    /** ARIA role (implicit or explicit) */
    role: string;
    /** Keyboard navigation pattern */
    keyboardNav: string;
    /** ARIA attributes applied */
    ariaAttributes?: string[];
    /** WCAG success criteria this component addresses */
    wcag?: string[];
    /** Notes for screen reader behaviour */
    screenReader?: string;
  };

  /** Canonical usage examples (JSX snippets) */
  examples: Array<{
    label: string;
    code: string;
  }>;
}

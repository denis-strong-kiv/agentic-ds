import type { Meta, StoryObj } from '@storybook/react';
import { SkipLink } from '@travel/ui/components/ui/skip-link';

const meta: Meta<typeof SkipLink> = {
  title: 'UI/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SkipLink>;

export const Default: Story = {
  name: 'Default (visually hidden until focused)',
  render: () => (
    <div className="relative">
      <SkipLink href="#main-content" />
      <p className="text-sm text-[var(--color-foreground-muted)] p-4 border border-dashed border-[var(--color-border-default)] rounded">
        Tab into this preview to reveal the skip link. It is visually hidden (sr-only) until
        it receives keyboard focus, then appears fixed in the top-left corner.
      </p>
      <main id="main-content" tabIndex={-1} className="mt-4 p-4 rounded bg-[var(--color-background-subtle)]">
        <p className="text-sm text-[var(--color-foreground-default)]">Main content area</p>
      </main>
    </div>
  ),
};

export const FocusVisible: Story = {
  name: 'Focus-visible state',
  render: () => (
    <div className="relative min-h-24">
      {/* Force focus state via inline override to show what it looks like when focused */}
      <a
        href="#main"
        className={[
          'fixed start-4 top-4 z-[9999]',
          'inline-block rounded-md',
          'bg-[var(--color-primary-default)] px-4 py-2',
          'text-sm font-semibold text-[var(--color-primary-foreground)]',
          'outline-none ring-2 ring-[var(--color-primary-default)] ring-offset-2',
        ].join(' ')}
      >
        Skip to main content
      </a>
      <p className="text-sm text-[var(--color-foreground-muted)] mt-16 p-4">
        This shows the skip link in its focused/visible state.
      </p>
    </div>
  ),
};

export const CustomTarget: Story = {
  name: 'Custom target and label',
  render: () => (
    <div>
      <SkipLink href="#search-results">Skip to search results</SkipLink>
      <p className="text-sm text-[var(--color-foreground-muted)] p-4">
        Tab here to activate the custom skip link targeting #search-results.
      </p>
    </div>
  ),
};

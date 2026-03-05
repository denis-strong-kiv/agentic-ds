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
    <div className="sb-relative">
      <SkipLink href="#main-content" />
      <p className="sb-skip-note">
        Tab into this preview to reveal the skip link. It is visually hidden (sr-only) until
        it receives keyboard focus, then appears fixed in the top-left corner.
      </p>
      <main id="main-content" tabIndex={-1} className="sb-skip-main">
        <p className="sb-text-sm-default">Main content area</p>
      </main>
    </div>
  ),
};

export const FocusVisible: Story = {
  name: 'Focus-visible state',
  render: () => (
    <div className="sb-skip-focus-wrap">
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
      <p className="sb-skip-focus-note">
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
      <p className="sb-text-sm-muted sb-p-md">
        Tab here to activate the custom skip link targeting #search-results.
      </p>
    </div>
  ),
};

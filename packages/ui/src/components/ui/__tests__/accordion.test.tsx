import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../accordion/index.js';

function AccordionSingleFixture() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Section One</AccordionTrigger>
        <AccordionContent>Content for section one</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section Two</AccordionTrigger>
        <AccordionContent>Content for section two</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function AccordionMultipleFixture() {
  return (
    <Accordion type="multiple">
      <AccordionItem value="item-1">
        <AccordionTrigger>Section One</AccordionTrigger>
        <AccordionContent>Content for section one</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section Two</AccordionTrigger>
        <AccordionContent>Content for section two</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders accordion triggers', () => {
    render(<AccordionSingleFixture />);
    expect(screen.getByText('Section One')).toBeInTheDocument();
    expect(screen.getByText('Section Two')).toBeInTheDocument();
  });

  it('triggers are collapsed by default (aria-expanded=false)', () => {
    render(<AccordionSingleFixture />);
    expect(screen.getByRole('button', { name: /Section One/i })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /Section Two/i })).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens item when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<AccordionSingleFixture />);
    await user.click(screen.getByRole('button', { name: /Section One/i }));
    expect(screen.getByRole('button', { name: /Section One/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles item closed on second click (collapsible)', async () => {
    const user = userEvent.setup();
    render(<AccordionSingleFixture />);
    await user.click(screen.getByRole('button', { name: /Section One/i }));
    await user.click(screen.getByRole('button', { name: /Section One/i }));
    expect(screen.getByRole('button', { name: /Section One/i })).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens item with Enter key', async () => {
    const user = userEvent.setup();
    render(<AccordionSingleFixture />);
    screen.getByRole('button', { name: /Section One/i }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: /Section One/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens item with Space key', async () => {
    const user = userEvent.setup();
    render(<AccordionSingleFixture />);
    screen.getByRole('button', { name: /Section One/i }).focus();
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: /Section One/i })).toHaveAttribute('aria-expanded', 'true');
  });

  describe('single mode', () => {
    it('closes other items when one opens', async () => {
      const user = userEvent.setup();
      render(<AccordionSingleFixture />);
      await user.click(screen.getByRole('button', { name: /Section One/i }));
      await user.click(screen.getByRole('button', { name: /Section Two/i }));
      expect(screen.getByRole('button', { name: /Section One/i })).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByRole('button', { name: /Section Two/i })).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('multiple mode', () => {
    it('allows multiple items to be open simultaneously', async () => {
      const user = userEvent.setup();
      render(<AccordionMultipleFixture />);
      await user.click(screen.getByRole('button', { name: /Section One/i }));
      await user.click(screen.getByRole('button', { name: /Section Two/i }));
      expect(screen.getByRole('button', { name: /Section One/i })).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('button', { name: /Section Two/i })).toHaveAttribute('aria-expanded', 'true');
    });
  });
});

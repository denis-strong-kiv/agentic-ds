import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@travel/ui/components/ui/accordion';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const FAQ: Story = {
  name: 'FAQ (single)',
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-lg">
      <AccordionItem value="baggage">
        <AccordionTrigger>What is the baggage allowance?</AccordionTrigger>
        <AccordionContent>
          Economy passengers are allowed one carry-on bag (7 kg) and one checked bag (23 kg) included
          in their fare. Additional bags can be purchased during booking.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="cancel">
        <AccordionTrigger>Can I cancel or change my booking?</AccordionTrigger>
        <AccordionContent>
          Flexible fares allow free cancellation up to 24 hours before departure. Standard fares
          may be subject to a change fee. Check your fare rules in your booking confirmation.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="checkin">
        <AccordionTrigger>When does online check-in open?</AccordionTrigger>
        <AccordionContent>
          Online check-in opens 48 hours before your scheduled departure and closes 1 hour before.
          You can check in via the app or website.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const MultiExpand: Story = {
  name: 'Multiple open',
  render: () => (
    <Accordion type="multiple" defaultValue={['seat', 'meal']} className="w-full max-w-lg">
      <AccordionItem value="seat">
        <AccordionTrigger>Seat selection</AccordionTrigger>
        <AccordionContent>
          Choose your preferred seat during booking or up to 24 hours before departure for free.
          Premium seats (extra legroom, exit rows) are available for an additional fee.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="meal">
        <AccordionTrigger>Meal preferences</AccordionTrigger>
        <AccordionContent>
          Special meals (vegetarian, vegan, gluten-free, kosher, halal) must be requested at
          least 24 hours before departure via Manage My Booking.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="lounge">
        <AccordionTrigger>Lounge access</AccordionTrigger>
        <AccordionContent>
          Business and First class passengers enjoy complimentary lounge access. Economy
          passengers can purchase day passes at the airport.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const DisabledItem: Story = {
  name: 'With disabled item',
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-lg">
      <AccordionItem value="active">
        <AccordionTrigger>Flight status</AccordionTrigger>
        <AccordionContent>
          Your flight FL-204 is on time. Boarding begins at Gate B14 at 14:30.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="disabled" disabled>
        <AccordionTrigger>Upgrade options (sold out)</AccordionTrigger>
        <AccordionContent>
          No upgrades available for this flight.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="contact">
        <AccordionTrigger>Contact support</AccordionTrigger>
        <AccordionContent>
          Reach our 24/7 support team via live chat, email at support@travel.co, or call
          +1 800 TRAVEL.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

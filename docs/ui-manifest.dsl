# TOKENS
breakpoint --breakpoint-sm 640px
breakpoint --breakpoint-md 768px
breakpoint --breakpoint-lg 1024px
breakpoint --breakpoint-xl 1280px
breakpoint --breakpoint-2xl 1536px
shadow shadow/sm 0 1px 2px 0 oklch(0.15 0.01 250 / 0.08)
shadow shadow/md 0 4px 6px -1px oklch(0.15 0.01 250 / 0.10), 0 2px 4px -2px oklch(0.15 0.01 250 / 0.06)
shadow shadow/lg 0 10px 15px -3px oklch(0.15 0.01 250 / 0.12), 0 4px 6px -4px oklch(0.15 0.01 250 / 0.08)
shadow shadow/xl 0 20px 25px -5px oklch(0.15 0.01 250 / 0.14), 0 8px 10px -6px oklch(0.15 0.01 250 / 0.10)
shadow shadow/2xl 0 25px 50px -12px oklch(0.15 0.01 250 / 0.25)
motion dur/instant 0ms
motion dur/fast 100ms
motion dur/normal 200ms
motion dur/slow 300ms
motion dur/slower 500ms
motion ease/ease-out cubic-bezier(0, 0, 0.2, 1)
motion ease/ease-in cubic-bezier(0.4, 0, 1, 1)
motion ease/ease-in-out cubic-bezier(0.4, 0, 0.2, 1)
motion ease/spring cubic-bezier(0.34, 1.56, 0.64, 1)
shape shape/sharp-button 2px
shape shape/sharp-card 2px
shape shape/sharp-input 1px
shape shape/sharp-badge 1px
shape shape/sharp-dialog 4px
shape shape/sharp-sm 1px
shape shape/sharp-md 2px
shape shape/sharp-lg 4px
shape shape/sharp-full 9999px
shape shape/rounded-button 8px
shape shape/rounded-card 12px
shape shape/rounded-input 6px
shape shape/rounded-badge 6px
shape shape/rounded-dialog 16px
shape shape/rounded-sm 4px
shape shape/rounded-md 8px
shape shape/rounded-lg 16px
shape shape/rounded-full 9999px
shape shape/pill-button 9999px
shape shape/pill-card 24px
shape shape/pill-input 9999px
shape shape/pill-badge 9999px
shape shape/pill-dialog 24px
shape shape/pill-sm 4px
shape shape/pill-md 12px
shape shape/pill-lg 24px
shape shape/pill-full 9999px
shape --shape-button var(--shape-preset-button)
shape --shape-card var(--shape-preset-card)
shape --shape-input var(--shape-preset-input)
shape --shape-badge var(--shape-preset-badge)
shape --shape-dialog var(--shape-preset-dialog)
spacing 0 0rem
spacing 1 0.25rem
spacing 2 0.5rem
spacing 3 0.75rem
spacing 4 1rem
spacing 5 1.25rem
spacing 6 1.5rem
spacing 8 2rem
spacing 10 2.5rem
spacing 12 3rem
spacing 16 4rem
spacing 20 5rem
spacing 24 6rem
spacing 0-5 0.125rem
spacing 1-5 0.375rem
spacing 2-5 0.625rem
spacing 3-5 0.875rem
typography fs/2xs 0.625rem
typography fs/xs 0.75rem
typography fs/sm 0.875rem
typography fs/md 1rem
typography fs/lg 1.125rem
typography fs/xl 1.25rem
typography fs/2xl 1.5rem
typography fs/3xl 1.875rem
typography fs/4xl 2.25rem
typography --line-height-tight 1.25
typography --line-height-snug 1.375
typography --line-height-normal 1.5
typography --line-height-relaxed 1.625
typography --line-height-loose 2
typography fw/regular 400
typography fw/medium 500
typography fw/semibold 600
typography fw/bold 700
typography --letter-spacing-tighter -0.05em
typography --letter-spacing-tight -0.025em
typography --letter-spacing-normal 0em
typography --letter-spacing-wide 0.025em
typography --letter-spacing-wider 0.05em
typography --letter-spacing-widest 0.1em

# COMPONENTS
C ui/accordion Accordion @accordion
  WHEN Collapsible sections of related content where only one or a few sections need to be visible at a time. Use for FAQs, filter panels, settings groups, or itinerary details.
  NOT When all content should be visible simultaneously (use a list or sections). When content is short enough to show inline without the overhead of disclosure.
  ALT Tabs — when sections are mutually exclusive and equal in priority | Dialog — when content needs full focus isolation | Collapsible — single-item expand/collapse without a group context
  PREFER_OVER Custom show/hide toggle implementations built with state and CSS display.
  STATES collapsed | expanded | disabled
  ANIM ChevronDown icon rotates 180° on expand | Content height animates open/closed via Radix data attributes
  RESPONSIVE Full-width by default; stacks vertically regardless of viewport.
  A11Y role=region (AccordionContent) with associated button trigger keys="Tab to focus triggers. Enter/Space to expand or collapse. Arrow keys move between triggers when in the accordion."
  WCAG 4.1.2 Name, Role, Value 2.1.1 Keyboard
  EX "Single expand (FAQ)" <Accordion type="single" collapsible> <AccordionItem value="item-1"> <AccordionTrigger>What is included in the fare?</AccordionTrigger> <AccordionContent>Baggage, meals, and seat selection are included.</AccordionContent> </AccordionItem> </Accordion>
  EX "Multiple expand (filters)" <Accordion type="multiple"> <AccordionItem value="stops"> <AccordionTrigger>Stops</AccordionTrigger> <AccordionContent>Non-stop, 1 stop, 2+ stops</AccordionContent> </AccordionItem> <AccordionItem value="airlines"> <AccordionTrigger>Airlines</AccordionTrigger> <AccordionContent>Carrier checkboxes here</AccordionContent> </AccordionItem> </Accordion>

C ui/alert Alert [variant:info|success|warning|error=info]
  # Optional dismiss callback — renders a close button when provided
  P onDismiss:function?
  WHEN Inline status messages that give feedback about a user action or system state — booking confirmation, payment errors, form validation summaries, or important travel advisories.
  NOT Transient toasts that auto-dismiss (use a Toast). Blocking confirmations that require a decision (use AlertDialog). Decorative callouts with no semantic urgency.
  ALT Toast — ephemeral feedback that disappears automatically | AlertDialog — destructive action confirmation requiring user choice | Banner — full-width page-level notifications
  PREFER_OVER Custom colored div with manual role="alert" and icon.
  STATES default (info) | success | warning | error | dismissible (when onDismiss is provided)
  RESPONSIVE Full-width block element; stacks vertically with surrounding content.
  A11Y role=alert keys="Dismiss button is focusable via Tab. Activated with Enter/Space."
  WCAG 4.1.3 Status Messages 1.4.3 Contrast 2.1.1 Keyboard
  EX "Error — payment failed" <Alert variant="error"> <AlertTitle>Payment failed</AlertTitle> <AlertDescription>Your card was declined. Please update your payment details.</AlertDescription> </Alert>
  EX "Success — booking confirmed" <Alert variant="success" onDismiss={() => setVisible(false)}> <AlertTitle>Booking confirmed</AlertTitle> <AlertDescription>Your reservation PNR is AB1234.</AlertDescription> </Alert>
  EX "Warning — passport expiry" <Alert variant="warning"> <AlertTitle>Passport expires soon</AlertTitle> <AlertDescription>Your passport expires within 6 months of travel.</AlertDescription> </Alert>

C ui/alert-dialog AlertDialog @alert-dialog
  WHEN Destructive or irreversible actions that require explicit user confirmation — cancelling a booking, deleting saved search preferences, or permanently removing passenger details.
  NOT Informational messages that need no decision (use Alert). Non-destructive modals with rich content (use Dialog). Success/error feedback (use Toast or Alert).
  ALT Dialog — general-purpose modal for forms, previews, or non-destructive interactions | Alert — inline status message requiring no confirmation
  PREFER_OVER window.confirm() or custom modal built from scratch.
  STATES closed | open
  ANIM Overlay fade in/out | Content scale and fade via Radix data-state transitions
  RESPONSIVE Dialog content is centered; max-width constrained on larger viewports.
  A11Y role=alertdialog keys="Tab cycles focus within dialog. Escape cancels. Focus is trapped inside while open and returns to trigger on close."
  WCAG 2.1.2 No Keyboard Trap (focus properly trapped and released) 4.1.2 Name, Role, Value 2.4.3 Focus Order
  EX "Cancel booking" <AlertDialog> <AlertDialogTrigger asChild> <Button variant="destructive">Cancel Booking</Button> </AlertDialogTrigger> <AlertDialogContent> <AlertDialogHeader> <AlertDialogTitle>Cancel this booking?</AlertDialogTitle> <AlertDialogDescription>This action cannot be undone. Cancellation fees may apply.</AlertDialogDescription> </AlertDialogHeader> <AlertDialogFooter> <AlertDialogCancel>Keep Booking</AlertDialogCancel> <AlertDialogAction onClick={handleCancel}>Yes, Cancel</AlertDialogAction> </AlertDialogFooter> </AlertDialogContent> </AlertDialog>

C ui/aspect-ratio AspectRatio @aspect-ratio
  WHEN Maintain a fixed width-to-height ratio for media containers — hotel hero images, destination photos, map previews, or video embeds — preventing layout shift as images load.
  NOT Content whose height should grow naturally with its contents (text blocks, cards with variable copy). Intrinsically-sized SVGs that already declare their own viewBox.
  ALT CSS aspect-ratio property directly — for one-off cases where a full component is overkill
  PREFER_OVER Padding-top percentage hack or fixed pixel dimensions that break on different viewports.
  STATES static — wraps children in a fixed-ratio container
  RESPONSIVE Fills the width of its container; height adjusts proportionally. Use ASPECT_RATIOS presets (16/9, 4/3, 1/1, 3/2) for consistent sizing across the design system.
  A11Y role=none (presentational wrapper) keys="No keyboard behaviour. Child content manages its own focus."
  EX "Hotel hero image (16:9)" <AspectRatio ratio={ASPECT_RATIOS["16/9"]}> <img src={hotelImageUrl} alt="Hotel exterior" className="w-full h-full object-cover" /> </AspectRatio>
  EX "Square destination thumbnail" <AspectRatio ratio={ASPECT_RATIOS["1/1"]}> <img src={destinationThumb} alt="Paris" className="w-full h-full object-cover rounded-lg" /> </AspectRatio>
  EX "Video embed (16:9)" <AspectRatio ratio={16 / 9}> <iframe src="https://www.youtube.com/embed/..." title="Destination video" className="w-full h-full" /> </AspectRatio>

C ui/avatar Avatar @avatar
  # Status indicator dot overlay for Avatar
  P status:enum(online|away|busy|offline) req
  WHEN Represent a user, traveller profile, or airline/partner brand with a photo or initials fallback. Use in navigation headers, booking summaries, passenger lists, and review cards.
  NOT Arbitrary images or icons that are not identity representations (use AspectRatio + img or Icon instead).
  ALT Icon — for non-person entity icons | AspectRatio — for proportional media not representing identity
  PREFER_OVER Raw <img> with manual fallback logic and circular CSS.
  STATES image loaded | image loading (Radix delays fallback) | image error (fallback shown) | with status indicator (online/away/busy/offline)
  ANIM AvatarFallback fades in after image load delay (Radix default)
  RESPONSIVE Fixed-size circle; use Tailwind size utilities on the wrapper to scale.
  A11Y role=img (AvatarStatus uses role="img" with aria-label for the status dot) keys="No inherent keyboard interaction. If the avatar is interactive, wrap it in a button."
  WCAG 1.1.1 Non-text Content — alt text on AvatarImage 1.4.3 Contrast — fallback initials must meet contrast ratio
  EX "User with photo" <Avatar> <AvatarImage src={user.photoUrl} alt={user.name} /> <AvatarFallback>{user.initials}</AvatarFallback> </Avatar>
  EX "With online status" <div className="relative inline-flex"> <Avatar> <AvatarImage src={agent.photoUrl} alt={agent.name} /> <AvatarFallback>{agent.initials}</AvatarFallback> </Avatar> <AvatarStatus status="online" /> </div>
  EX "Initials-only fallback" <Avatar> <AvatarFallback>JD</AvatarFallback> </Avatar>

C ui/badge Badge [variant:default|secondary|outline|destructive|deal|new|popular=default]
  WHEN Static labels, status indicators, counts, or categorical tags that are purely informational. Use on cards, table rows, and list items.
  NOT Interactive toggle actions (use Chip). Notification counts on icons (use NotificationBadge). Long sentences.
  ALT Chip — for interactive, dismissible, or toggleable labels | NotificationBadge — for numeric counts overlaid on icons | Alert — for full-width status messages
  PREFER_OVER Raw <span> elements with manual styling.
  STATES default
  A11Y role=status (implied) — wrap in aria-live region if content changes dynamically keys="Not focusable — not interactive."
  WCAG 1.4.3 Contrast Minimum
  EX "Status label" <Badge variant="success">Confirmed</Badge>
  EX "Deal tag on a card" <Badge variant="deal">Best value</Badge>
  EX "Destructive / warning" <Badge variant="destructive">Cancelled</Badge>

C ui/breadcrumb Breadcrumb
  WHEN Show the user's location within a hierarchical site structure — e.g., Home › Flights › Search Results › Booking. Use on detail pages, multi-step flows, and any page more than one level deep.
  NOT Flat single-level sites with no meaningful hierarchy. Step indicators for a sequential wizard (use a Stepper instead).
  ALT Tabs — for sibling-level navigation | Back button — for simple one-level-up navigation without hierarchy context
  PREFER_OVER Custom ordered list with manual aria-label and current-page marking.
  STATES default | current page (BreadcrumbPage with aria-current="page") | truncated with ellipsis (BreadcrumbEllipsis)
  RESPONSIVE Use BreadcrumbEllipsis to collapse middle items on narrow viewports.
  A11Y role=navigation (nav element with aria-label="breadcrumb") keys="Tab through BreadcrumbLink anchors. BreadcrumbPage is not focusable (non-interactive). BreadcrumbSeparator and BreadcrumbEllipsis are hidden from tab order."
  WCAG 2.4.8 Location — satisfies landmark for current location 4.1.2 Name, Role, Value
  EX "Flight booking flow" <Breadcrumb> <BreadcrumbList> <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem> <BreadcrumbSeparator /> <BreadcrumbItem><BreadcrumbLink href="/flights">Flights</BreadcrumbLink></BreadcrumbItem> <BreadcrumbSeparator /> <BreadcrumbItem><BreadcrumbPage>Search Results</BreadcrumbPage></BreadcrumbItem> </BreadcrumbList> </Breadcrumb>
  EX "With collapsed middle items" <Breadcrumb> <BreadcrumbList> <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem> <BreadcrumbSeparator /> <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem> <BreadcrumbSeparator /> <BreadcrumbItem><BreadcrumbPage>Booking</BreadcrumbPage></BreadcrumbItem> </BreadcrumbList> </Breadcrumb>

C ui/button Button [variant:primary|secondary|tertiary|neutral|'inverted-primary'|'inverted-secondary'|'inverted-tertiary'|outline|ghost|destructive|link=primary] [size:sm|md|lg|xl|icon=md]
  # Shows a loading spinner and disables the button
  P isLoading:boolean?
  P spinner:React.ReactNode?
  SLOTS spinner
  WHEN Any user-triggered action: form submission, navigation trigger, dialog open/close, data mutation. Use when the action has immediate consequence.
  NOT Pure navigation between pages — use an <a> tag or Next.js <Link> instead. Decorative or non-interactive elements.
  ALT Link (variant="link") for inline text actions | IconButton (size="icon") for icon-only actions | DropdownMenu trigger for multi-action menus
  PREFER_OVER Raw <button> elements — Button handles focus styles, disabled states, loading, and ARIA automatically.
  STATES default | hover | active | focus-visible | disabled | loading
  ANIM Loading spinner fades in; button width locks to prevent layout shift
  RESPONSIVE Intrinsic width by default; apply w-full or travel-flight-card-select-btn for full-width contexts.
  A11Y role=button keys="Tab to focus, Enter or Space to activate. Disabled state removes from tab order via aria-disabled."
  WCAG 2.1.1 Keyboard 1.4.3 Contrast Minimum 4.1.2 Name Role Value
  EX "Primary action" <Button variant="primary">Book flight</Button>
  EX "Loading state" <Button variant="primary" isLoading>Processing...</Button>
  EX "Destructive with confirmation" <Button variant="destructive" onClick={handleDelete}>Cancel booking</Button>
  EX "Icon-only" <Button size="icon" variant="ghost" aria-label="Close"><X size={16} /></Button>

C ui/calendar Calendar
  # Selected date or date range
  P selected:object?
  P minDate:object?
  P maxDate:object?
  P disabledDates:array?
  P onSelect:function?
  P mode:enum(single|range)?
  P priceOverlay:function?
  WHEN Date selection for travel booking flows — outbound and return flight dates, hotel check-in/check-out, car rental pickup/drop-off. Supports single date and date-range selection. Optionally overlays per-day pricing.
  NOT Time-only selection (use a time input). Year/month-only pickers with no day granularity. Inline date display without interaction (use formatted text).
  ALT Native <input type="date"> — for simple forms where OS date picker is acceptable | DatePicker (popover-wrapped Calendar) — when space is constrained and calendar should appear on demand
  PREFER_OVER Third-party date-picker libraries that bring their own styling and token systems.
  STATES default | today (highlighted) | selected | in-range (range mode) | disabled (minDate/maxDate/disabledDates) | with price overlay
  ANIM None — month transition is immediate
  RESPONSIVE Fixed 7-column grid; scales with font size. Wrap in a container to constrain width.
  A11Y role=grid (implicit via 7-column button layout) keys="Tab to reach the calendar. Arrow keys and Tab move between month nav buttons and day buttons. Disabled days are skipped."
  WCAG 2.1.1 Keyboard 1.4.3 Contrast 1.3.1 Info and Relationships
  EX "Single date selection" <Calendar mode="single" selected={departureDate} minDate={new Date()} onSelect={setDepartureDate} />
  EX "Date range (outbound + return)" <Calendar mode="range" selected={{ from: checkIn, to: checkOut }} minDate={new Date()} onSelect={handleDateSelect} />
  EX "With flight price overlay" <Calendar mode="single" selected={selectedDate} minDate={new Date()} priceOverlay={(date) => getPriceForDate(date)} onSelect={setSelectedDate} />

C ui/card Card [variant:elevated|outlined=outlined]
  WHEN Group related content and actions into a visually bounded container — flight results, hotel listings, booking summaries, saved itineraries, or dashboard widgets.
  NOT Full-page layout sections (use semantic HTML like <section>/<article>). Simple inline grouping that does not need a visual boundary. Lists where each row is a single action.
  ALT Table row — for dense tabular data | List item — for simple single-line entries without media or actions
  PREFER_OVER Custom div with manual border, shadow, and border-radius CSS.
  STATES default | elevated (box-shadow) | outlined (border, default)
  RESPONSIVE Block-level; use grid or flex on the parent to control columns.
  A11Y role=generic (div) keys="No inherent keyboard behaviour. If the card is a clickable target, wrap in a button or anchor. Ensure interactive elements inside are individually focusable."
  WCAG 1.4.3 Contrast — ensure card background meets contrast with page background 2.1.1 Keyboard — any interactive card must be reachable and operable
  EX "Flight result card" <Card variant="elevated"> <CardHeader> <CardTitle>Dubai → London</CardTitle> <CardDescription>Emirates · 7h 20m · Non-stop</CardDescription> </CardHeader> <CardContent> <p>Departs 08:15 · Arrives 12:35</p> </CardContent> <CardFooter> <span className="font-bold">AED 1,250</span> <Button>Select</Button> </CardFooter> </Card>
  EX "Hotel listing card (outlined)" <Card variant="outlined"> <CardHeader><CardTitle>Burj Al Arab</CardTitle></CardHeader> <CardContent><p>5-star · Jumeirah Beach · From $850/night</p></CardContent> </Card>

C ui/checkbox Checkbox @checkbox
  WHEN Binary opt-in/opt-out choices and multi-select filter lists — cabin class filters, airline selection, ancillary add-ons (extra baggage, seat selection, travel insurance), and terms-of-service acceptance.
  NOT Mutually exclusive options where only one can be true (use RadioGroup). Immediate binary state toggles with visible on/off meaning (use Switch).
  ALT RadioGroup — when exactly one option from a group must be chosen | Switch — for settings with immediate on/off effect (e.g., enable notifications) | ToggleGroup — for visual multi-select that should look like buttons
  PREFER_OVER Custom <input type="checkbox"> with manual styling and indeterminate state management.
  STATES unchecked | checked (shows Check icon) | indeterminate (shows Minus icon — for select-all parent checkboxes) | disabled
  RESPONSIVE Inline-flex element; pair with a <label> for a larger click target.
  A11Y role=checkbox keys="Tab to focus. Space to toggle. Does not respond to Enter (Space only, per ARIA checkbox pattern)."
  WCAG 2.1.1 Keyboard 1.4.3 Contrast 4.1.2 Name, Role, Value
  EX "Filter — non-stop flights only" <div className="flex items-center gap-2"> <Checkbox id="nonstop" checked={filters.nonStop} onCheckedChange={(v) => setFilter("nonStop", v)} /> <label htmlFor="nonstop">Non-stop only</label> </div>
  EX "Select-all with indeterminate state" <div className="flex items-center gap-2"> <Checkbox id="select-all" checked={allSelected ? true : someSelected ? "indeterminate" : false} onCheckedChange={handleSelectAll} /> <label htmlFor="select-all">Select all airlines</label> </div>
  EX "Terms acceptance" <div className="flex items-center gap-2"> <Checkbox id="terms" required onCheckedChange={setTermsAccepted} /> <label htmlFor="terms">I agree to the booking terms and conditions</label> </div>

C ui/chip Chip
  # Shows filled active style
  P label:React.ReactNode req
  P isActive:boolean?
  P onDismiss:function?
  P onClick:function?
  P disabled:boolean?
  P size:enum(sm|md)?
  SLOTS label
  WHEN Interactive filter tags, multi-select option tags, or removable selections. Use when the user toggles or dismisses individual values.
  NOT Static informational labels (use Badge). Navigation tabs (use Tabs). Broad filter categories with a popover (use FilterChip).
  ALT Badge — static, non-interactive labels | FilterChip — filter chips with popover content for the travel domain | Tabs — mutually exclusive navigation between views
  PREFER_OVER Custom toggle-button implementations.
  STATES default | active (isActive=true) | disabled | hover | focus-visible
  ANIM Active state background transition via CSS duration-fast
  A11Y role=button keys="Tab to focus chip. Enter/Space to toggle. Tab to dismiss button, Enter/Space to dismiss."
  WCAG 2.1.1 Keyboard 4.1.2 Name Role Value
  EX "Filter toggle" <Chip label="Nonstop" isActive={filter === 'nonstop'} onClick={() => setFilter('nonstop')} />
  EX "Dismissible selection" <Chip label="New York" isActive onDismiss={() => removeCity('nyc')} />

C ui/combobox Combobox
  P options:array req
  P value:string?
  P onChange:function?
  P placeholder:string?
  P disabled:boolean?
  P 'aria-label':string?
  WHEN Searchable single-value selector when the option list is large enough that filtering is helpful (e.g. selecting a country, airport, or airline). The user can type to narrow options and pick with keyboard or mouse.
  NOT Short, stable lists of 5 or fewer options — use a native <select> or RadioGroup instead. Multi-value selection — this component is single-select only.
  ALT Select — for short lists without search | RadioGroup — for ≤5 mutually exclusive options visible at once
  PREFER_OVER Native <select> when typeahead filtering is required or the option set is dynamic.
  STATES default | open | filtering | option-active (keyboard highlight) | option-selected | option-disabled | disabled
  ANIM ChevronDown icon rotates when listbox is open
  RESPONSIVE Width determined by parent container.
  A11Y role=combobox (on the input element) keys="Tab to focus the input. ArrowDown/ArrowUp to navigate options. Enter to select. Escape to dismiss."
  WCAG 4.1.3 Status Messages 1.3.1 Info and Relationships 2.1.1 Keyboard
  EX "Airport selector" <Combobox options={airports} value={origin} onChange={setOrigin} aria-label="Origin airport" placeholder="Search airports..." />
  EX "With disabled option" <Combobox options={[{ value: "syd", label: "Sydney" }, { value: "mel", label: "Melbourne", disabled: true }]} value={city} onChange={setCity} aria-label="Destination city" />

C ui/date-picker DatePicker
  P value:object?
  P onChange:function?
  P placeholder:string?
  P minDate:object?
  P maxDate:object?
  P disabledDates:array?
  WHEN Single-date selection (DatePicker) or two-date range selection (DateRangePicker) for travel booking forms — departure/return dates, check-in/check-out, etc. Renders a Calendar inside a Popover triggered by a Button.
  NOT Free-text date entry where the user knows the exact date — use a plain <input type="date"> instead. Inline calendar without a trigger — use the Calendar component directly.
  ALT Calendar — for an always-visible calendar widget | Input type="date" — for simple date entry without a picker UI
  PREFER_OVER Raw <input type="date"> when you need minDate/maxDate/disabledDates constraints with a branded calendar UI.
  STATES closed (trigger shows placeholder or formatted date) | open (Popover with Calendar visible) | date selected | range: awaiting-from / awaiting-to
  ANIM Popover entrance/exit animation from PopoverContent
  RESPONSIVE Popover aligns to the start edge of the trigger by default (align="start").
  A11Y role=The trigger renders as a button with aria-haspopup="dialog". Calendar inside the popover handles its own grid navigation. keys="Tab to reach trigger. Enter/Space to open. Calendar navigation handled by Calendar component. Escape to close."
  WCAG 2.1.1 Keyboard 1.3.1 Info and Relationships
  EX "Single date" <DatePicker value={departDate} onChange={setDepartDate} placeholder="Select date" minDate={today} />
  EX "Date range for flights" <DateRangePicker value={range} onChange={setRange} placeholder={{ from: "Departure", to: "Return" }} minDate={today} />
  EX "With blocked dates" <DatePicker value={date} onChange={setDate} disabledDates={soldOutDates} minDate={today} maxDate={maxBookingDate} />

C ui/dialog Dialog [size:sm|md|lg|xl|full=md] @dialog
  # Hide the close button
  P hideClose:boolean?
  WHEN Blocking interactions requiring user decision before continuing: confirmations, forms, detail views that must stay in context. Use when the task is short and self-contained.
  NOT Large content areas or multi-step flows that need persistent side panels (use Sheet). Non-blocking supplementary info (use Tooltip or Popover). Destructive confirmations (use AlertDialog).
  ALT AlertDialog — for destructive confirmation prompts with required affirmation | Sheet — for side panels with richer content | Popover — for non-blocking, anchor-relative info | FlightDetails — travel-domain dialog wrapping full itinerary
  PREFER_OVER Custom modal implementations — Dialog handles focus trap, scroll lock, escape key, and ARIA automatically.
  STATES closed | open | closing (exit animation)
  ANIM Fade + scale in/out via CSS data-state animations
  RESPONSIVE size="full" for full-screen mobile modals.
  A11Y role=dialog keys="Escape closes. Focus trapped inside. First focusable element receives focus on open. Focus returns to trigger on close."
  WCAG 2.1.2 No Keyboard Trap (focus trap is intentional and escapable) 1.3.1 Info and Relationships
  EX "Basic confirmation dialog" <Dialog> <DialogTrigger asChild><Button>Open</Button></DialogTrigger> <DialogContent> <DialogHeader> <DialogTitle>Confirm booking</DialogTitle> <DialogDescription>This will charge your card.</DialogDescription> </DialogHeader> <DialogFooter> <Button variant="outline">Cancel</Button> <Button variant="primary">Confirm</Button> </DialogFooter> </DialogContent> </Dialog>
  EX "Large content" <Dialog> <DialogTrigger asChild><Button>View details</Button></DialogTrigger> <DialogContent size="lg"> <DialogHeader><DialogTitle>Fare rules</DialogTitle></DialogHeader> {/* content */} </DialogContent> </Dialog>

C ui/dropdown-menu DropdownMenu @dropdown-menu
  WHEN Contextual action menus triggered by a button — "more options", account menus, sort controls, bulk-action overflow menus. Supports plain items, checkbox items (multi-select state), radio items (single-select state), sub-menus, labels, and separators.
  NOT Primary navigation between pages — use NavigationMenu. Selecting a single value from a list — use Select or Combobox. Confirming a destructive action — use AlertDialog.
  ALT Select — for single-value form field selection | ContextMenu — for right-click / long-press triggered menus | NavigationMenu — for top-level site navigation
  PREFER_OVER Custom absolutely-positioned lists — this uses Radix DropdownMenu which handles focus trap, portal, collision detection, and ARIA automatically.
  STATES closed | open | item-highlighted | item-disabled | checkbox-item-checked | radio-item-checked | sub-menu-open
  ANIM Radix data-state enter/exit animations on Content
  A11Y role=menu (Content), menuitem (Item), menuitemcheckbox (CheckboxItem), menuitemradio (RadioItem) keys="Tab / Shift-Tab to reach trigger. Enter/Space to open. Arrow keys navigate items. ArrowRight opens sub-menu. Escape closes."
  WCAG 2.1.1 Keyboard 1.3.1 Info and Relationships 4.1.2 Name, Role, Value
  EX "Basic action menu" <DropdownMenu> <DropdownMenuTrigger asChild><Button variant="ghost">Options</Button></DropdownMenuTrigger> <DropdownMenuContent> <DropdownMenuItem>View booking</DropdownMenuItem> <DropdownMenuItem>Download receipt</DropdownMenuItem> <DropdownMenuSeparator /> <DropdownMenuItem>Cancel booking</DropdownMenuItem> </DropdownMenuContent> </DropdownMenu>
  EX "With icon and shortcut" <DropdownMenuItem icon={<Icon icon={Download} size="sm" />} shortcut="⌘D">Download</DropdownMenuItem>
  EX "Checkbox items" <DropdownMenuCheckboxItem checked={showPrices} onCheckedChange={setShowPrices}>Show prices</DropdownMenuCheckboxItem>

C ui/icon Icon
  # A Lucide icon or a custom OTA icon component
  P icon:enum(LucideIcon|OtaIcon) req
  P size:object='md'?
  P label:string?
  SLOTS icon label
  WHEN Any time you need to render a Lucide icon or a custom OTA icon with consistent sizing (xs–xl) and strokeWidth. Use the label prop to make standalone meaningful icons accessible.
  NOT Logos or brand marks — use an <img> or inline SVG directly. Complex multi-color illustrations — Icon only wraps single-color stroke icons.
  ALT Raw LucideIcon component — only when Icon wrapper is not available
  PREFER_OVER Direct Lucide component usage — Icon normalises strokeWidth to 1.75 and applies design-system size tokens consistently.
  STATES static (decorative or labelled)
  A11Y role=img (when label is provided) or presentation (decorative, aria-hidden) keys="Not focusable — interactive parent handles focus."
  WCAG 1.1.1 Non-text Content
  EX "Decorative (inside labelled button)" <Icon icon={Search} size="sm" />
  EX "Standalone meaningful icon" <Icon icon={AlertCircle} size="md" label="Warning: price changed" />
  EX "Explicit pixel size" <Icon icon={Plane} size={18} />
  EX "OTA custom icon" <Icon icon={OtaFlightIcon} size="lg" label="Flight" />

C ui/input Input
  # Error message — displayed below the input and sets aria-describedby
  P error:object?
  P leftSlot:React.ReactNode?
  P rightSlot:React.ReactNode?
  SLOTS leftSlot rightSlot
  WHEN Any single-line text entry: search, name, email, phone, airport code. Use with Label for accessible form fields.
  NOT Multi-line text (use Textarea). Selecting from a predefined list (use Select or Combobox). Date entry (use DatePicker).
  ALT Textarea — multi-line text | Select — fixed option lists | Combobox — searchable option lists | DatePicker — date/time entry
  PREFER_OVER Raw <input> elements — Input handles error states, ARIA, and slot layout automatically.
  STATES default | focus | error (aria-invalid) | disabled
  RESPONSIVE Full-width by default within its container.
  A11Y role=textbox (implicit) keys="Tab to focus. Standard text input keyboard behaviour."
  WCAG 1.3.1 Info and Relationships 3.3.1 Error Identification 4.1.2 Name Role Value
  EX "Labelled field" <Label htmlFor="email">Email</Label> <Input id="email" type="email" placeholder="you@example.com" />
  EX "With error" <Input id="phone" error={{ message: 'Invalid phone number' }} />
  EX "With icon slot" <Input leftSlot={<Search size={16} />} placeholder="Search flights" />

C ui/label Label
  # Mark field as required with a visual indicator
  P required:boolean?
  P helperText:string?
  WHEN Associate a visible text label with a form control (Input, Select, Combobox, etc.) via the htmlFor prop. Use the required prop to show a visual asterisk when the field is mandatory. Use helperText for secondary guidance below the label.
  NOT Describing non-form content — use a heading or <p> instead. Labelling icon-only buttons — use aria-label on the button itself.
  ALT aria-label on the input — when a visible label is intentionally hidden | aria-labelledby — when the label element already exists elsewhere in the DOM
  PREFER_OVER Plain <label> elements — Label adds the required indicator and helperText slots in a consistent layout.
  STATES default | with-required-indicator | with-helper-text
  A11Y role=label (native <label> element) keys="Not focusable. Clicking activates the associated control."
  WCAG 1.3.1 Info and Relationships 2.4.6 Headings and Labels
  EX "Basic label" <Label htmlFor="email">Email address</Label>
  EX "Required field" <Label htmlFor="surname" required>Last name</Label>
  EX "With helper text" <Label htmlFor="dob" helperText="Format: DD/MM/YYYY">Date of birth</Label>
  EX "Required with helper text" <Label htmlFor="passport" required helperText="Must be valid for 6 months beyond travel date">Passport number</Label>

C ui/nav-bar NavBar
  # Mini search pill — omit to hide
  P brandName:string?
  P brandLogo:React.ReactNode?
  P search:object?
  P onSearchClick:function?
  P searchExpanded:boolean?
  P activeSearchTab:object?
  P onSearchTabChange:function?
  P supportPhone:string?
  P actions:React.ReactNode?
  P onAccountClick:function?
  P onMenuClick:function?
  SLOTS brandLogo actions
  WHEN Top-level site header for the travel app. Renders brand logo/name on the left, an optional mini search-summary pill or Flights/Hotels tab switcher in the centre, and account/menu actions on the right. The search pill collapses to tabs when searchExpanded is true.
  NOT In-page section headers or sub-navigation — use a heading or NavigationMenu. Inside a modal or sheet — use a Dialog title instead.
  ALT NavigationMenu — for a standalone top-level link bar without the travel-specific search pill
  PREFER_OVER Custom <header> elements — NavBar provides the search pill, tab switching, support phone link, and ARIA landmark in one composable component.
  STATES default (logo + optional search pill + actions) | with-search-pill (search summary shown, click opens search overlay) | search-expanded (pill hidden, Flights/Hotels tabs shown with active indicator) | custom-actions (actions prop replaces default account/menu buttons)
  RESPONSIVE Three-column grid: brand (start), centre slot (mid), actions (end). Designed for fixed top placement.
  A11Y role=banner (role on <header> element) keys="Tab through all interactive elements: search pill button, tab buttons, support link, account button, menu button."
  WCAG 2.4.1 Bypass Blocks 1.3.6 Identify Purpose 2.1.1 Keyboard 1.4.3 Contrast
  EX "With search pill" <NavBar brandName="Travelco" search={{ route: "SYD → LHR", dates: "15 Mar – 22 Mar", passengers: 2 }} onSearchClick={openSearch} />
  EX "Search expanded (tabs)" <NavBar brandName="Travelco" searchExpanded activeSearchTab="flights" onSearchTabChange={setTab} />
  EX "With support phone" <NavBar brandName="Travelco" supportPhone="+1 800 555 0199" onAccountClick={openAccount} onMenuClick={openMenu} />
  EX "Custom actions slot" <NavBar brandName="Travelco" actions={<Button variant="primary">Sign in</Button>} />

C ui/navigation-menu NavigationMenu @navigation-menu
  WHEN Top-level horizontal site navigation with dropdown content panels. Use when nav items need rich flyout content (mega-menus, grouped links, descriptions) rather than simple flat links.
  NOT Simple flat link bars with no dropdown content — plain anchor elements or a link list are sufficient. Mobile hamburger menus — use a Sheet or Dialog instead. Contextual action menus triggered by a specific element — use DropdownMenu.
  ALT DropdownMenu — for action menus attached to a single trigger | NavBar — for the travel app header which includes search pill and brand identity
  PREFER_OVER Custom hover menus — NavigationMenu uses Radix primitives for focus management, ARIA, and keyboard navigation automatically.
  STATES closed | item-active (trigger open, viewport visible) | item-highlighted
  ANIM Viewport scales in/out on open/close (Radix data-state transitions) | ChevronDown indicator rotates when trigger is active
  A11Y role=navigation (Root renders <nav>), menubar (List), menuitem (Item/Trigger) keys="Tab to reach the nav. Arrow keys move between triggers. Enter/Space opens a trigger. Escape closes. Tab through content links while panel is open."
  WCAG 2.1.1 Keyboard 4.1.2 Name, Role, Value 2.4.3 Focus Order
  EX "Basic nav with dropdown" <NavigationMenu> <NavigationMenuList> <NavigationMenuItem> <NavigationMenuTrigger>Flights</NavigationMenuTrigger> <NavigationMenuContent> <NavigationMenuLink href="/flights/search">Search flights</NavigationMenuLink> <NavigationMenuLink href="/flights/deals">Deals</NavigationMenuLink> </NavigationMenuContent> </NavigationMenuItem> </NavigationMenuList> </NavigationMenu>
  EX "Plain link item (no dropdown)" <NavigationMenuItem><NavigationMenuLink href="/help">Help</NavigationMenuLink></NavigationMenuItem>

C ui/notification-badge NotificationBadge [variant:brand|accent|success|warning|danger|neutral|inverted=brand] [size:lg|md=lg]
  # Numeric count to display. Omit to render children (icon/dot mode).
  P count:number?
  P max:number?
  WHEN Overlay a count, status indicator, or icon dot on another element — notification counts on nav icons, unread message counts, booking-status dots. Always circular; designed to be positioned absolutely over a parent.
  NOT Text labels or category tags on content cards — use Badge instead. Inline status text within a sentence — use a plain styled span.
  ALT Badge — for rectangular tag/label indicators within content flow
  PREFER_OVER Custom absolutely-positioned count spans — NotificationBadge handles the max overflow label (e.g. "99+"), semantic aria-label, and variant colours automatically.
  STATES count mode (numeric, capped at max prop) | dot / icon mode (no count, renders children) | variants: brand, accent, success, warning, danger, neutral, inverted | sizes: lg (default), md
  A11Y role=status indicator (rendered as <span>) keys="Not focusable."
  WCAG 1.4.1 Use of Color 1.4.3 Contrast
  EX "Unread notification count" <NotificationBadge count={5} variant="brand" />
  EX "Capped count overflow" <NotificationBadge count={120} max={99} variant="danger" />
  EX "Status dot (no count)" <NotificationBadge variant="success" size="md" aria-label="Online" />
  EX "Overlaid on an icon" <div className="relative inline-flex"> <Icon icon={Bell} size="md" /> <NotificationBadge count={3} variant="brand" className="absolute -top-1 -end-1" /> </div>

C ui/pagination Pagination

C ui/popover Popover @popover
  WHEN Floating content panel anchored to a trigger element — filter panels, date picker overlays, rich tooltips with interactive content, mini-forms. Use when the floating content is non-modal and the user can interact with the rest of the page.
  NOT Confirming a destructive action — use AlertDialog (modal). Displaying non-interactive hint text — use Tooltip. Full-screen overlays — use Dialog or Sheet.
  ALT Tooltip — for read-only hover hints | Dialog — for modal flows that require user attention | DropdownMenu — for action/option lists triggered by a button
  PREFER_OVER Custom absolutely-positioned divs — Popover uses Radix PopoverPrimitive for focus management, portal rendering, collision detection, and ARIA.
  STATES closed | open
  ANIM PopoverContent enter/exit animations via Radix data-state attribute
  RESPONSIVE align prop controls horizontal alignment (start, center, end). sideOffset defaults to 4px gap between trigger and content. Radix handles viewport collision detection.
  A11Y role=dialog (PopoverContent) keys="Tab to reach trigger. Enter/Space to open. Tab through focusable elements inside content. Escape to close."
  WCAG 2.1.1 Keyboard 4.1.3 Status Messages 2.4.3 Focus Order
  EX "Filter panel" <Popover> <PopoverTrigger asChild> <Button variant="secondary">Filters</Button> </PopoverTrigger> <PopoverContent align="start" aria-label="Search filters"> {/* filter controls */} </PopoverContent> </Popover>
  EX "Controlled open state" <Popover open={open} onOpenChange={setOpen}> <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger> <PopoverContent>Content here</PopoverContent> </Popover>
  EX "Custom anchor" <Popover> <PopoverAnchor asChild><div ref={anchorRef} /></PopoverAnchor> <PopoverTrigger asChild><Button>Trigger</Button></PopoverTrigger> <PopoverContent>Anchored elsewhere</PopoverContent> </Popover>

C ui/progress Progress @progress

C ui/radio-group RadioGroup @radio-group
  WHEN Mutually exclusive selection from a small set of visible options (2–6 items). Use when all choices should be visible at once and only one can be selected.
  NOT More than 6 options (use Select instead). Multiple selections (use Checkbox). Binary on/off toggle (use Switch).
  ALT Select — for long option lists in a dropdown | Checkbox — for multi-select | Switch — for boolean toggles
  PREFER_OVER Native <input type="radio"> elements — provides full keyboard navigation and ARIA automatically.
  STATES default | checked | unchecked | disabled | focused
  ANIM Circle indicator appears/disappears on selection
  RESPONSIVE Typically stacked vertically on mobile; can be laid out in a row on wider viewports via className.
  A11Y role=radiogroup (Root), radio (Item) keys="Tab focuses the selected or first item. Arrow keys navigate between items. Space selects the focused item."
  WCAG 2.1.1 Keyboard 1.3.1 Info and Relationships 4.1.2 Name, Role, Value
  EX "Cabin class selection" <RadioGroup defaultValue="economy"><RadioGroupItem value="economy" id="economy" /><RadioGroupItem value="business" id="business" /></RadioGroup>
  EX "Controlled selection" <RadioGroup value={cabinClass} onValueChange={setCabinClass}><RadioGroupItem value="first" id="first" /></RadioGroup>

C ui/scroll-area ScrollArea @scroll-area
  WHEN Constrained scrollable region where native scrollbars look inconsistent across platforms or clash with the design. Use for sidebars, dropdowns, modals, or any fixed-height overflow container.
  NOT Full-page scrolling (use native body scroll). When the content height is always visible and no overflow occurs.
  ALT Native overflow-auto div — simpler, but with inconsistent scrollbar styling across browsers
  PREFER_OVER Custom scrollbar CSS hacks on native elements.
  STATES idle | scrolling | scrollbar-visible | scrollbar-hidden
  ANIM Scrollbar thumb fades in on scroll activity and fades out when idle
  RESPONSIVE Scrollbar orientation defaults to vertical; pass orientation="horizontal" to ScrollBar for horizontal scroll areas.
  A11Y role=region (implicit via landmark context) keys="Content inside the viewport is natively focusable. Keyboard scrolling follows normal browser behavior within the viewport."
  WCAG 1.4.10 Reflow 2.1.1 Keyboard
  EX "Vertical scroll list" <ScrollArea className="h-72"><FlightCardList /></ScrollArea>
  EX "Horizontal scroll" <ScrollArea><ScrollBar orientation="horizontal" /><div className="flex gap-4">…</div></ScrollArea>

C ui/select Select @select
  WHEN Choosing one option from a long list (7+ items) that would be impractical to show as radio buttons. Use for cabin class, nationality, currency, country, sort-order, or any enumerated field with many values.
  NOT Fewer than 6 options where all choices can be visible (use RadioGroup). Multi-select scenarios (use a multi-select combobox). When users need to type a custom value (use a combobox/autocomplete).
  ALT RadioGroup — for small visible option sets | Combobox — when users can type to filter or enter custom values
  PREFER_OVER Native <select> — provides consistent cross-platform styling and a custom scrollable dropdown.
  STATES closed | open | focused | disabled | placeholder
  ANIM Dropdown slides/fades in on open | Slides/fades out on close
  RESPONSIVE Dropdown renders in a portal to avoid overflow clipping. Popper position adjusts to viewport edges.
  A11Y role=combobox (trigger), listbox (content), option (item) keys="Space/Enter/ArrowDown opens. Arrow keys navigate items. Enter/Space selects. Escape closes. Home/End jump to first/last."
  WCAG 2.1.1 Keyboard 4.1.2 Name, Role, Value 1.3.1 Info and Relationships
  EX "Cabin class picker" <Select><SelectTrigger><SelectValue placeholder="Cabin class" /></SelectTrigger><SelectContent><SelectItem value="economy">Economy</SelectItem><SelectItem value="business">Business</SelectItem></SelectContent></Select>
  EX "Grouped options" <Select><SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger><SelectContent><SelectGroup><SelectLabel>Price</SelectLabel><SelectItem value="asc">Low to high</SelectItem></SelectGroup></SelectContent></Select>

C ui/separator Separator @separator
  WHEN Visual divider between distinct sections of content — e.g., separating form sections, list groups, card body from footer, or sidebar sections.
  NOT When spacing alone (margin/padding) is sufficient to distinguish sections. Do not use as a structural layout element.
  ALT CSS gap/margin for spacing without a visible rule | Card with distinct header/body areas for grouped content
  STATES static
  RESPONSIVE Orientation prop controls horizontal (full-width rule) vs vertical (full-height rule in flex rows).
  A11Y role=separator (when decorative=false), none/presentation (when decorative=true, the default) keys="Not interactive — no keyboard behavior."
  WCAG 1.3.1 Info and Relationships — meaningful separators should be non-decorative
  EX "Between card sections" <Separator />
  EX "Vertical in flex row" <Separator orientation="vertical" className="h-6" />
  EX "Semantic separator" <Separator decorative={false} />

C ui/sheet Sheet [side:top|bottom|left|right=right] @dialog
  WHEN Persistent side panels, filter panels, detail views, or mobile navigation drawers. Use when content is too rich for a Dialog and does not need to fully block the page.
  NOT Short confirmations (use AlertDialog). Anchor-relative tooltips (use Popover). Full-page modals (use Dialog size="full").
  ALT Dialog — for blocking, centered modals | FilterPanel — travel-domain sheet wrapping all filter controls | FlightDetails — travel-domain right-side detail panel
  PREFER_OVER Custom drawer implementations — Sheet handles focus trap, scroll lock, and exit animation.
  STATES closed | open | closing (slide-out animation)
  ANIM Slides in/out from the configured side via CSS data-state transitions
  RESPONSIVE side="bottom" is common for mobile sheets.
  A11Y role=dialog keys="Escape closes. Focus trapped. Focus returns to trigger on close."
  WCAG 2.1.2 No Keyboard Trap 1.3.1 Info and Relationships
  EX "Filter side panel" <Sheet> <SheetTrigger asChild><Button>Filters</Button></SheetTrigger> <SheetContent side="left"> <SheetHeader><SheetTitle>Filter results</SheetTitle></SheetHeader> <FilterPanel filters={filters} onChange={setFilters} /> </SheetContent> </Sheet>

C ui/skeleton Skeleton [animation:pulse|shimmer|none=pulse]
  WHEN Replace content areas while async data loads. Mirror the shape and size of the content it replaces for minimal layout shift.
  NOT Spinner/progress indicators for actions (use Progress or a loading Button). Error states. Empty states.
  ALT Progress — for determinate loading with known completion | Button isLoading — for action-level loading feedback
  PREFER_OVER Blank space, spinners, or generic "Loading..." text during content fetch.
  STATES pulse | shimmer | none
  ANIM pulse: opacity oscillation | shimmer: highlight sweep left-to-right
  RESPONSIVE Size via className — match the dimensions of the real content.
  A11Y role=none (aria-hidden="true") keys="Not focusable."
  WCAG 2.2.2 Pause Stop Hide — reduced-motion disables animation
  EX "Card skeleton" <div className="travel-flight-card"> <Skeleton className="h-8 w-3/4" /> <Skeleton className="h-4 w-1/2 mt-2" /> </div>
  EX "Shimmer variant" <Skeleton animation="shimmer" className="h-48 w-full rounded-lg" />

C ui/skip-link SkipLink
  # The id of the main content area to skip to (without the `#`).
  P href:string?
  WHEN Place as the first element inside every page layout to allow keyboard users to bypass repeated navigation and jump directly to the main content area. Required on every route for WCAG 2.4.1 compliance.
  NOT Single-page flows with no repeated navigation block before main content.
  ALT aria-label on <main> — helpful but not a substitute for a visible skip link
  PREFER_OVER Omitting skip navigation entirely — this causes WCAG Level A failure.
  STATES visually-hidden | focused-visible
  ANIM Transitions from off-screen / invisible to visible when focused
  RESPONSIVE Always present regardless of viewport size.
  A11Y role=link keys="Becomes the first Tab stop on the page. Enter activates the anchor and moves focus to #main-content (or the configured href)."
  WCAG 2.4.1 Bypass Blocks (Level A)
  EX "Standard usage in layout" <SkipLink href="#main-content" />
  EX "Custom label" <SkipLink href="#search-results">Skip to search results</SkipLink>

C ui/slider Slider @slider
  # Show formatted value labels above thumbs
  P showValue:boolean?
  P formatValue:function?
  WHEN Selecting a numeric value or range within a continuous spectrum — price range filters, budget sliders, distance radius, rating threshold. Supports single-thumb and dual-thumb (range) modes via the value/defaultValue array length.
  NOT Discrete enumerated choices (use RadioGroup or Select). When users need to type an exact number (use a numeric Input). Accessibility-critical forms where precise input is required (combine with a paired number input).
  ALT Input type="number" — for precise numeric entry | RadioGroup — for discrete step choices
  PREFER_OVER Native <input type="range"> — provides accessible thumb labels and custom formatting via formatValue.
  STATES default | focused | dragging | disabled
  ANIM Thumb scales on focus/drag
  RESPONSIVE Full-width by default, constrained by its container. Value labels render above the track when showValue is true.
  A11Y role=slider (each thumb) keys="Tab focuses first thumb. Arrow keys change value by step. Page Up/Down change by larger increment. Home/End jump to min/max."
  WCAG 2.1.1 Keyboard 1.4.3 Contrast 4.1.2 Name, Role, Value
  EX "Price range filter" <Slider defaultValue={[50, 500]} min={0} max={1000} step={10} showValue formatValue={(v) => `$${v}`} aria-label="Price range" />
  EX "Single value" <Slider defaultValue={[3]} min={1} max={5} step={1} showValue aria-label="Star rating minimum" />

C ui/switch Switch @switch
  # Label positioning relative to the switch
  P labelPosition:enum(left|right)?
  P label:string?
  SLOTS label
  WHEN Immediately applied binary settings — notifications on/off, dark mode, flexible dates, direct booking, search alerts. Effect takes place without a submit action.
  NOT Form choices that require confirmation before saving (use Checkbox + submit). Mutually exclusive options in a group (use RadioGroup).
  ALT Checkbox — when the action requires a form submit to take effect | RadioGroup — for selecting one option from a set
  PREFER_OVER Custom toggle buttons built from scratch — Switch provides built-in ARIA role, keyboard activation, and checked state.
  STATES unchecked | checked | disabled | focused
  ANIM Thumb slides horizontally between unchecked and checked positions
  RESPONSIVE Inline element. Label position is configurable via labelPosition="left"|"right" (default right). Wraps in a <label> for click-to-toggle on the label text.
  A11Y role=switch keys="Tab to focus. Space to toggle checked state."
  WCAG 2.1.1 Keyboard 4.1.2 Name, Role, Value 1.4.3 Contrast
  EX "Flexible dates toggle" <Switch label="Flexible dates" defaultChecked={false} onCheckedChange={setFlexible} />
  EX "Label on left" <Switch label="Receive price alerts" labelPosition="left" />
  EX "Controlled" <Switch checked={notifications} onCheckedChange={setNotifications} label="Notifications" />

C ui/table Table
  # Highlight row as selected
  P selected:boolean?
  WHEN Displaying structured relational data with rows and columns — booking history, fare comparison grids, itinerary breakdowns, price matrices. Use when column alignment and headers are semantically meaningful.
  NOT Layout purposes (use CSS grid/flex). Simple lists without relational columns (use a list with Cards). When data is sparse or hierarchical (use an accordion or tree view).
  ALT Card list — for non-tabular records | DataGrid — for large datasets requiring virtual scrolling
  PREFER_OVER Ad-hoc div-based grids that lack semantic table markup.
  STATES default | row-selected | row-hover | sort-ascending | sort-descending
  RESPONSIVE Wrap in ScrollArea for horizontal scrolling on narrow viewports. Table itself does not collapse — implement column hiding at the data layer if needed.
  A11Y role=table, rowgroup, row, columnheader, cell keys="Native table keyboard navigation. Interactive cells (sortable headers) receive Tab focus. Enter/Space activates sort."
  WCAG 1.3.1 Info and Relationships 2.1.1 Keyboard 4.1.2 Name, Role, Value
  EX "Booking history table" <Table><TableCaption>Recent bookings</TableCaption><TableHeader><TableRow><TableHead>Route</TableHead><TableHead sortable sortDirection="asc" onSort={handleSort}>Date</TableHead><TableHead>Price</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>DXB → LHR</TableCell><TableCell>12 Mar</TableCell><TableCell>$420</TableCell></TableRow></TableBody></Table>
  EX "Selected row" <TableRow selected><TableCell>Selected booking</TableCell></TableRow>

C ui/tabs Tabs [orientation:horizontal|vertical=horizontal] @tabs
  P icon:React.ReactNode?
  P badge:number?
  SLOTS icon badge
  WHEN Switching between distinct views of related content within the same page context — Flights/Hotels/Cars search forms, Outbound/Return legs, Details/Policy/Reviews panels. Content panels are mutually exclusive.
  NOT Navigation between separate pages/routes (use links/nav). Filtering a single list (use a filter chip group). Accordion-style expand/collapse (use Accordion).
  ALT Accordion — for show/hide sections that can be open simultaneously | SegmentedControl — for very small option sets that look more like a button group
  PREFER_OVER Custom tab implementations built from divs — Tabs provides roving tabindex, arrow key navigation, and correct ARIA roles automatically.
  STATES default | active | focused | disabled
  RESPONSIVE TabsList supports orientation="horizontal" (default, scrollable row) and orientation="vertical" (stacked column for sidebar tabs).
  A11Y role=tablist (TabsList), tab (TabsTrigger), tabpanel (TabsContent) keys="Tab moves focus into the tablist. Left/Right arrows move between tabs (horizontal). Up/Down arrows move between tabs (vertical). Home/End jump to first/last. Tab again moves into the active panel."
  WCAG 2.1.1 Keyboard 4.1.2 Name, Role, Value 1.3.1 Info and Relationships
  EX "Search form tabs" <Tabs defaultValue="flights"><TabsList><TabsTrigger value="flights">Flights</TabsTrigger><TabsTrigger value="hotels">Hotels</TabsTrigger><TabsTrigger value="cars">Cars</TabsTrigger></TabsList><TabsContent value="flights"><FlightSearchForm /></TabsContent></Tabs>
  EX "Tab with badge" <TabsTrigger value="alerts" badge={3}>Alerts</TabsTrigger>
  EX "Vertical tabs" <TabsList orientation="vertical"><TabsTrigger value="details">Details</TabsTrigger><TabsTrigger value="policy">Policy</TabsTrigger></TabsList>

C ui/textarea Textarea
  # Show character count (requires maxLength)
  P error:string?
  P showCount:boolean?
  P autoResize:boolean?
  WHEN Multi-line freeform text input — special requests, booking notes, travel itinerary descriptions, contact messages, review submissions. Use when the expected input is longer than a single line.
  NOT Single-line inputs like name, email, or search (use Input). Structured data entry with known format (use separate Input fields). Rich text with formatting (use a rich text editor).
  ALT Input — for single-line text | RichTextEditor — for formatted content creation
  PREFER_OVER Native <textarea> — provides integrated error display, character counter, and auto-resize behavior.
  STATES default | focused | error | disabled | read-only
  ANIM Height transition when autoResize adjusts to content
  RESPONSIVE Full-width by default, constrained by its container. autoResize eliminates fixed-height scrolling on short content.
  A11Y role=textbox (multiline) keys="Tab to focus. All standard text editing keyboard shortcuts apply."
  WCAG 1.3.1 Info and Relationships 3.3.1 Error Identification 3.3.3 Error Suggestion 1.4.3 Contrast
  EX "Special requests with character limit" <Textarea id="requests" placeholder="Any special requests?" maxLength={500} showCount />
  EX "With validation error" <Textarea id="notes" error="Notes cannot exceed 500 characters." maxLength={500} />
  EX "Auto-resizing" <Textarea placeholder="Describe your itinerary…" autoResize />

C ui/toast Toast [variant:default|success|error|warning=default] @toast
  WHEN Non-blocking, transient feedback for completed actions: save success, copy confirmation, booking created. Auto-dismisses after a timeout.
  NOT Critical errors requiring user action (use Alert or Dialog). Persistent status messages. Information the user needs to read carefully.
  ALT Alert — for persistent, inline status banners | Dialog — for errors requiring acknowledgment | NotificationBadge — for unread count indicators
  STATES entering | visible | dismissing | dismissed
  ANIM Slides in from bottom-right, fades out on dismiss
  RESPONSIVE Full-width on mobile, fixed-width on desktop. Stacks vertically for multiple toasts.
  A11Y role=status (default) or alert (for error/warning variants) keys="Focus is not moved to toast — it is non-blocking. Close button is focusable."
  WCAG 4.1.3 Status Messages 2.2.1 Timing Adjustable
  EX "Success notification" toast({ title: 'Booking confirmed', description: 'Check your email for details.', variant: 'success' })
  EX "Error notification" toast({ title: 'Payment failed', description: 'Please try a different card.', variant: 'error' })

C ui/tooltip Tooltip @tooltip
  WHEN Non-essential supplementary information revealed on hover or focus — icon button labels, abbreviated cell values, field hints, fare condition explanations. Content must be short (one phrase or sentence).
  NOT Critical information users need to complete a task (put it inline). Interactive content like links or buttons inside the tooltip (use Popover). On touch-only surfaces where hover is unavailable.
  ALT Popover — for interactive or rich content anchored to a trigger | Dialog — for important information requiring user acknowledgement
  STATES hidden | visible
  ANIM Tooltip fades/scales in on open, fades/scales out on close
  RESPONSIVE Renders in a portal to avoid overflow clipping. sideOffset defaults to 4px. Position auto-adjusts to stay within viewport.
  A11Y role=tooltip (content) keys="Tab to focus the trigger — tooltip appears automatically. Escape dismisses. Tooltip is not in the tab order."
  WCAG 1.4.13 Content on Hover or Focus 2.1.1 Keyboard 4.1.3 Status Messages
  EX "Icon button label" <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Share itinerary"><Share2 /></Button></TooltipTrigger><TooltipContent>Share itinerary</TooltipContent></Tooltip></TooltipProvider>
  EX "Fare condition hint" <TooltipProvider><Tooltip><TooltipTrigger><InfoIcon className="w-4 h-4" /></TooltipTrigger><TooltipContent>Non-refundable. Changes allowed for a fee.</TooltipContent></Tooltip></TooltipProvider>

C travel/activity-card ActivityCard
  P title:string req
  P category:object req
  P imageUrl:string?
  P description:string?
  P duration:string req
  P difficulty:object?
  P ratingScore:number?
  P reviewCount:number?
  P pricePerPerson:string req
  P currency:string?
  P instantConfirmation:boolean?
  P freeCancellation:boolean?
  SLOTS description

C travel/booking-confirmation BookingConfirmation
  P confirmationNumber:string req
  P bookingDate:string req
  P status:enum(confirmed|pending|cancelled)?
  P segments:array req
  P totalAmount:string req
  P currency:string?
  P contactEmail:string?
  P onAddToCalendar:function?
  P onShareItinerary:function?
  P onPrint:function?
  WHEN Post-payment confirmation page to display booking reference, itinerary segments, total paid, and share/print actions. Use after a successful (or pending/cancelled) booking transaction.
  NOT Mid-funnel booking steps — this is a terminal read-only view, not a form. Do not use as a booking summary panel during checkout.
  ALT PriceBreakdown — for showing cost details during checkout, not after | ItineraryTimeline — for displaying trip events without the confirmation reference / QR context
  PREFER_OVER Custom confirmation layouts that duplicate the QR placeholder, copy-to-clipboard reference, and segment icon logic.
  STATES confirmed — green success banner with checkmark | pending — neutral banner with "Booking Pending" heading | cancelled — destructive badge with "Booking Cancelled" heading
  RESPONSIVE Reference number row stacks vertically on narrow viewports. Action buttons wrap.
  A11Y role=region (implicit div) keys="Tab through copy button, then optional Add to Calendar / Share / Print action buttons."
  WCAG 2.1.1 Keyboard 1.3.1 Info and Relationships
  EX "Confirmed booking with flight + hotel segments" <BookingConfirmation confirmationNumber="TRV-2024-XYZ789" bookingDate="8 Mar 2026" status="confirmed" contactEmail="traveler@example.com" totalAmount="$1,248.00" currency="USD" segments={[ { type: 'flight', title: 'NYC → LON', subtitle: 'British Airways BA 178', date: '12 Mar 2026', details: [{ label: 'Seat', value: '14A' }, { label: 'Class', value: 'Economy' }] }, { type: 'hotel', title: 'The Savoy', subtitle: 'Superior Room', date: '12–19 Mar 2026', details: [{ label: 'Check-in', value: '3:00 PM' }] }, ]} onAddToCalendar={() => addToCalendar()} onShareItinerary={() => shareItinerary()} onPrint={() => window.print()} />

C travel/booking-stepper BookingStepper
  P steps:array req
  P onStepClick:function?
  P 'aria-label':string?
  WHEN Multi-step booking funnel (Search → Select → Customize → Passengers → Payment → Confirmation) to show users where they are and allow navigation back to completed steps.
  NOT Single-page forms or wizards with fewer than 3 steps. Non-booking flows like account settings where steps are not linearly ordered.
  ALT ui/Breadcrumb — for hierarchical page location, not sequential step progress
  PREFER_OVER Custom progress indicator implementations. Use createBookingSteps(activeStepIndex) factory for the standard 6-step travel booking flow.
  STATES completed — step shows checkmark icon, clickable if onStepClick is provided | active — step highlighted, aria-current="step" set, not clickable (current position) | upcoming — step shows numeric index, disabled button, greyed out
  A11Y role=navigation (nav element) keys="Tab through completed step buttons; upcoming steps are disabled and skipped in tab order. Active step button is focusable but clicking it does nothing without onStepClick."
  WCAG 2.1.1 Keyboard 4.1.2 Name, Role, Value 2.4.8 Location
  EX "Standard 6-step booking funnel at Passengers step" <BookingStepper steps={createBookingSteps(3)} onStepClick={(id) => navigateTo(id)} />
  EX "Custom steps" <BookingStepper steps={[ { id: 'flights', label: 'Flights', status: 'completed' }, { id: 'hotels', label: 'Hotels', status: 'active' }, { id: 'payment', label: 'Payment', status: 'upcoming' }, ]} onStepClick={(id) => navigateTo(id)} aria-label="Trip builder progress" />

C travel/car-card CarCard
  P name:string req
  P category:object req
  P imageUrl:string?
  P specs:object req
  P pickupLocation:string req
  P dropoffLocation:string?
  P pricePerDay:string req
  P totalPrice:string?
  P currency:string?
  P providerName:string req
  P providerLogo:string?
  P insuranceOptions:array?

C travel/destination-item-content DestinationItemContent [destinationType:airport|'airport-indented'|city|neighborhood|country|landmark|area=city]
  P destinationType:object?
  P title:React.ReactNode req
  P subtitle:string?
  P imageUrl:string?
  P imageAlt:string?
  SLOTS title
  WHEN Row content inside a destination autocomplete dropdown or combobox list. Renders the appropriate icon (Plane, Building2, MapPin, Globe2, Landmark, Map) based on destination type, or a thumbnail image for cities.
  NOT Standalone display outside a list/combobox context — this is a content fragment, not a self-contained card. Do not use as a full destination detail view.
  ALT HotelCard — for full hotel result cards with images, price, and CTA | FlightCard — for flight search results
  STATES city with imageUrl — renders thumbnail <img> instead of icon | airport — Plane icon with airport-specific decoration styles | airport-indented — Plane icon indented for sub-airport display (terminal/gate grouping) | city (no image) — Building2 icon | neighborhood — MapPin icon | country — Globe2 icon | landmark — Landmark icon | area — Map icon
  RESPONSIVE Inline flex content; inherits width from the list container.
  A11Y role=fragment (no wrapper element; renders as sibling spans) keys="No interactive elements; keyboard navigation is managed by the parent combobox/listbox."
  WCAG 1.1.1 Non-text Content
  EX "Airport suggestion with IATA code subtitle" <DestinationItemContent destinationType="airport" title="John F. Kennedy International" subtitle="New York, US · JFK" />
  EX "City suggestion with thumbnail" <DestinationItemContent destinationType="city" title="London" subtitle="United Kingdom" imageUrl="/images/destinations/london.jpg" imageAlt="London skyline" />
  EX "Indented airport for sub-airport grouping" <DestinationItemContent destinationType="airport-indented" title="London Heathrow" subtitle="LHR" />

C travel/filter-bar FilterBar
  P filters:object req
  P onChange:function req
  P sortBy:object?
  P onSortChange:function?
  P sidebarOpen:boolean req
  P onToggleSidebar:function req
  P airlineOptions:array?
  P maxPrice:number?
  WHEN Horizontal quick-filter strip above flight search results. Manages chip order, FLIP animation, and coordination between sidebar and inline filters.
  NOT Hotel or car filter bars (FilterPanel with mode="hotels|cars" is more appropriate). Vertical filter layouts.
  ALT FilterPanel — full sidebar panel with all filter options | Chip — for standalone toggle chips outside the results page
  STATES default | with-active-filters (chips reorder via FLIP) | sidebar-open (AllFiltersChip active)
  ANIM FLIP position animation on chip activation (useFlip hook) | Chip reordering is frozen while a popover is open to prevent layout jump
  RESPONSIVE Single scrollable row; no wrapping.
  A11Y role=toolbar (implicit via structure) keys="Tab between chips. Each chip handles its own keyboard interaction."
  WCAG 2.1.1 Keyboard
  EX "Full filter bar" <FilterBar filters={filters} onChange={setFilters} sortBy={sortBy} onSortChange={setSortBy} sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} airlineOptions={airlines} maxPrice={2000} />

C travel/filter-chip FilterChip
  # When active, clicking the chip label opens this popover instead of dismissing the filter.
  P label:string req
  P activeLabel:string?
  P isActive:boolean?
  P popoverContent:React.ReactNode?
  P onClear:function?
  P onOpenChange:function?
  P style:React.CSSProperties?
  P 'data-flip-id':string?
  SLOTS label popoverContent
  WHEN Filter bar chips in travel search results. Three exports for three roles: FilterChip (dropdown filter with popover), QuickFilterChip (single toggle), AllFiltersChip (opens full filter panel).
  NOT Generic toggle chips outside the filter bar context (use Chip). Static labels (use Badge).
  ALT Chip — generic interactive chip outside filter bar context | FilterBar — the full filter bar that composes these chips
  PREFER_OVER Custom filter dropdown implementations.
  STATES inactive | active (filled style + clear icon) | popover-open
  ANIM FLIP animation via data-flip-id when chips reorder on activation | Popover fade/slide transition
  RESPONSIVE FilterBar handles horizontal scroll; chips do not wrap.
  A11Y role=button keys="Tab to focus. Enter/Space to activate. Popover traps focus when open, Escape closes."
  WCAG 2.1.1 Keyboard 4.1.2 Name Role Value
  EX "Dropdown filter chip" <FilterChip label="Price" activeLabel="Up to £500" isActive={priceActive} popoverContent={<PriceRangeSlider />} onClear={() => clearPrice()} />
  EX "Quick toggle chip" <QuickFilterChip label="Nonstop only" isActive={nonstopOnly} onClick={() => setNonstopOnly(v => !v)} onClear={() => setNonstopOnly(false)} />
  EX "All filters chip" <AllFiltersChip activeCount={3} onClick={toggleSidebar} isActive={sidebarOpen} />

C travel/filter-panel FilterPanel
  # Controlled open state — false collapses the sidebar
  P filters:object req
  P onChange:function req
  P onClearAll:function?
  P sortBy:object?
  P onSortChange:function?
  P providerOptions:array?
  P amenityOptions:array?
  P allianceOptions:array?
  P maxPrice:number?
  P mode:enum(flights|hotels|cars)?
  P isOpen:boolean?
  WHEN Sidebar filter panel on flight, hotel, or car search results pages. Renders mode-specific filter sections — stops/departure/arrival time for flights; star rating/amenities for hotels — alongside shared price range and provider filters.
  NOT Quick inline filters on a map view or compact chip-based filtering — use FilterChip or QuickFilterChip instead. Do not use for non-search contexts.
  ALT FilterChip — for individual filter chips in a filter bar | QuickFilterChip — for pre-set quick filter options
  PREFER_OVER Custom sidebar filter implementations. Use createDefaultFilters(maxPrice) factory to initialise the FilterState object.
  STATES isOpen=true — panel renders normally | isOpen=false — component returns null (fully hidden) | activeCount > 0 — notification badge on "Filters" heading and "Clear all" button appear | allAirlinesSelected — select-all switch is checked
  RESPONSIVE Apply Filters button shown at bottom on mobile. Panel width is controlled by the parent layout.
  A11Y role=aside (landmark) keys="All controls (sliders, checkboxes, radio buttons, switches, star buttons) are keyboard accessible. Accordion sections are navigable via keyboard."
  WCAG 2.1.1 Keyboard 1.3.1 Info and Relationships 4.1.2 Name, Role, Value
  EX "Flights mode with airline options" <FilterPanel mode="flights" filters={filters} onChange={setFilters} onClearAll={() => setFilters(createDefaultFilters())} sortBy={sortBy} onSortChange={setSortBy} providerOptions={[ { value: 'ba', label: 'British Airways', logoUrl: '/logos/ba.png' }, { value: 'ua', label: 'United Airlines', logoUrl: '/logos/ua.png' }, ]} maxPrice={3000} />
  EX "Hotels mode" <FilterPanel mode="hotels" filters={filters} onChange={setFilters} onClearAll={() => setFilters(createDefaultFilters())} maxPrice={500} />

C travel/flight-card FlightCard
  # Display label e.g. "New York → London". Inferred from segments if omitted.
  P legs:array req
  P price:string req
  P currency:string?
  P totalPrice:string?
  P fareClass:string?
  P fareBreakdown:array?
  P baggage:object?
  P isBestValue:boolean?
  P isCheapest:boolean?
  P seatsLeft:number?
  P isCompact:boolean?
  P isSelected:boolean?
  WHEN Display a single flight option in search results. Supports one-way, round-trip, and multi-city (up to 6 legs). Use isCompact for the 400px mini-list panel.
  NOT Full itinerary detail (use FlightDetails). Hotel or car results (use HotelCard, CarCard). Static schedule display without selection.
  ALT FlightDetails — full expanded itinerary with fare options | ActivityCard / HotelCard — for non-flight travel products
  PREFER_OVER Custom flight result row implementations.
  STATES default | hover (elevated shadow) | selected (isSelected=true — 2px primary border) | compact (isCompact=true — stacked layout)
  ANIM Shadow transition on hover | Container-query switches to compact layout at 480px
  RESPONSIVE Desktop: content | price column. Compact/narrow: stacked with price strip at bottom.
  A11Y role=article keys="Tab to focus card (tabIndex=0). Enter/Space triggers onSelect. Select button and Pin button are independently focusable."
  WCAG 2.1.1 Keyboard 1.3.1 Info and Relationships
  EX "One-way nonstop" <FlightCard legs={[{ segments: [{ airline: 'BA', flightNumber: 'BA178', origin: 'JFK', destination: 'LHR', departureTime: '10:00 PM', arrivalTime: '10:15 AM+1', duration: '7h 15m', class: 'Economy' }], stops: 0, duration: '7h 15m' }]} price="£420" totalPrice="£840" baggage={{ carryOn: 1, checked: 0 }} onSelect={handleSelect} />
  EX "Compact (mini-list)" <FlightCard {...props} isCompact isSelected />
  EX "With urgency and best-value tag" <FlightCard {...props} isBestValue seatsLeft={3} />

C travel/flight-details FlightDetails
  # Night count between outbound arrival and return departure
  P title:string req
  P legs:array req
  P nightsBetween:number?
  P fareOptions:array?
  P isOpen:boolean req
  P onClose:function req
  P onShare:function?
  P onSelectFare:function?
  WHEN Full itinerary detail panel shown when a FlightCard is selected. Displays all segments, layovers, fare options, and nights between legs.
  NOT Compact result list (use FlightCard). Booking confirmation (use BookingConfirmation). Static schedule display.
  ALT FlightCard — compact result card | BookingConfirmation — post-booking receipt
  PREFER_OVER Custom itinerary detail implementations.
  STATES closed (isOpen=false) | open (isOpen=true, slides in from right) | fare-option selected
  ANIM Panel slides in from the right when isOpen changes to true
  RESPONSIVE Full-height panel, 720px wide on desktop. Full-width on mobile.
  A11Y role=dialog keys="Escape or close button to close. Focus managed on open/close."
  WCAG 2.1.1 Keyboard 1.3.1 Info and Relationships
  EX "Basic usage" <FlightDetails title="New York → London" legs={flightLegs} fareOptions={fareOptions} isOpen={detailOpen} onClose={() => setDetailOpen(false)} onSelectFare={handleFareSelect} />

C travel/flight-map FlightMap
  # [origin, destination] — great-circle arc is generated internally
  P airports:array req
  P paths:array?
  P initialViewState:object?
  WHEN Visualise flight routes on a map alongside search results or flight detail. Renders great-circle arcs with animated dashes and airport markers.
  NOT Static route diagrams (use ItineraryTimeline). Hotel location maps. Non-flight geographic contexts.
  ALT ItineraryTimeline — for linear, text-based segment display without a map
  STATES loading (map tiles loading) | loaded | animating dashes (RAF loop) | refitting (fitBounds on airport or resize change)
  ANIM Animated white dashes on flight paths via requestAnimationFrame at ~20fps | fitBounds camera animation (900ms on airport change, 700ms on resize) | Pulsing ring on origin airport marker
  RESPONSIVE Must be placed in a flex:1 container to fill remaining space. Container must have overflow:hidden.
  A11Y role=img (map canvas) keys="Map canvas is not keyboard-navigable by default. Navigation controls removed. Ensure route information is also available as text (ItineraryTimeline)."
  WCAG 1.1.1 Non-text Content — provide text alternative of route via ItineraryTimeline alongside the map
  EX "Single flight route" <FlightMap airports={[ { id: 'JFK', lat: 40.64, lng: -73.78, label: 'JFK', isOrigin: true }, { id: 'LHR', lat: 51.47, lng: -0.45, label: 'LHR', isDestination: true }, ]} paths={[{ id: 'seg-1', originId: 'JFK', destinationId: 'LHR', coordinates: [[-73.78, 40.64], [-0.45, 51.47]] }]} />
  EX "With connecting stop" <FlightMap airports={[ { id: 'JFK', lat: 40.64, lng: -73.78, label: 'JFK', isOrigin: true }, { id: 'ZRH', lat: 47.46, lng: 8.56 }, { id: 'LHR', lat: 51.47, lng: -0.45, label: 'LHR', isDestination: true }, ]} paths={[ { id: 's1', originId: 'JFK', destinationId: 'ZRH', coordinates: [[-73.78, 40.64], [8.56, 47.46]] }, { id: 's2', originId: 'ZRH', destinationId: 'LHR', coordinates: [[8.56, 47.46], [-0.45, 51.47]] }, ]} />

C travel/hotel-card HotelCard
  P name:string req
  P starRating:enum(1|2|3|4|5) req
  P images:array?
  P location:string req
  P distanceToCenter:string?
  P amenities:array?
  P pricePerNight:string req
  P totalPrice:string?
  P currency:string?
  P reviewScore:number?
  P reviewCount:number?
  P isFavorite:boolean?
  WHEN Hotel search result card in a results list or grid. Displays hotel name, star classification, image carousel, location, review score, amenity pills, per-night price, and a "View Deal" CTA.
  NOT Compact list rows where image carousels would be too heavy — use a plain text row instead. Do not use for flight or car results.
  ALT FlightCard — for flight search results | DestinationItemContent — for destination autocomplete rows
  PREFER_OVER Custom hotel listing cards that duplicate the carousel, favorite toggle, and review badge logic.
  STATES default — card with image carousel and all provided content | no images — placeholder graphic shown in the 4:3 image area | isFavorite=true — heart icon filled, aria-pressed="true" | isFavorite=false — heart icon outline, aria-pressed="false" | reviewScore >= 8.5 — "deal" badge variant | reviewScore >= 7.0 — "popular" badge variant | reviewScore < 7.0 — default badge variant
  RESPONSIVE Card is vertical with full-width image top. Image area uses 4:3 AspectRatio. Amenity pills truncate after 5 with a "+N more" label.
  A11Y role=generic (div) keys="Tab through: carousel prev button, carousel next button, dot navigation buttons, favorite button, View Deal button."
  WCAG 2.1.1 Keyboard 1.1.1 Non-text Content 4.1.2 Name, Role, Value
  EX "Hotel card with carousel and review score" <HotelCard name="The Savoy" starRating={5} images={['/images/savoy-1.jpg', '/images/savoy-2.jpg']} location="Strand, London" distanceToCenter="0.3 km" amenities={['Free WiFi', 'Spa', 'Restaurant', 'Fitness Center', 'Pool']} pricePerNight="$450" totalPrice="$3,150" currency="USD" reviewScore={9.2} reviewCount={2847} isFavorite={false} onFavoriteToggle={() => toggleFavorite(id)} onViewDeal={() => navigateToHotel(id)} />

C travel/itinerary-timeline ItineraryTimeline
  # Duration gap before next event, e.g. "2h 30m layover"
  P events:array req
  WHEN Chronological view of a multi-segment trip itinerary — flights, hotel stays, car rentals, activities, layovers, and transfers — displayed as a vertical timeline with expandable detail cards.
  NOT Simple single-segment bookings where a flat summary card suffices. Do not use for non-travel timelines (e.g. order history, notification feed).
  ALT BookingConfirmation — for the post-booking confirmation view which includes a flat segment list without expand/collapse or gap indicators
  STATES confirmed — default badge, full opacity event card | pending — secondary badge, full opacity | cancelled — destructive badge, card and icon node at 50–60% opacity | completed — outline badge, full opacity | expanded — detail key/value grid visible below time row | collapsed — only title, subtitle, time, and location visible | empty events array — "No itinerary events." message rendered
  ANIM Chevron rotates 180° on expand via CSS transition
  RESPONSIVE Vertical scroll timeline. Detail grids use 2-column layout. Gap indicators span full width.
  A11Y role=generic (div) with aria-label="Itinerary timeline" keys="Tab to each event's expand/collapse button. Events without details have no interactive element."
  WCAG 2.1.1 Keyboard 4.1.2 Name, Role, Value 1.4.1 Use of Color — status conveyed by badge text not color alone
  EX "Multi-segment trip with layover gap" <ItineraryTimeline events={[ { id: 'f1', type: 'flight', status: 'confirmed', title: 'NYC → LHR', subtitle: 'British Airways BA 178', startTime: '21:30', endTime: '09:15+1', duration: '7h 45m', location: 'JFK Terminal 7', details: [{ label: 'Seat', value: '14A' }, { label: 'Class', value: 'Economy' }], gapToNext: '2h 30m until check-in', }, { id: 'h1', type: 'hotel', status: 'confirmed', title: 'The Savoy', subtitle: 'Superior Room', startTime: 'Check-in 15:00', endTime: 'Check-out 11:00', duration: '7 nights', location: 'Strand, London', }, ]} />

C travel/nav-bar NavBar
  P brandName:string?
  P brandLogo:React.ReactNode?
  P search:object?
  P onSearchClick:function?
  P supportPhone:string?
  P onAccountClick:function?
  P onMenuClick:function?
  SLOTS brandLogo
  WHEN Top-level page header on all travel pages. Shows brand, optional mini search pill, 24/7 support phone, account button, and hamburger menu.
  NOT In-page section headers. Mobile bottom tab bars. Sub-navigation within a page (use Tabs).
  ALT ui/nav-bar — the generic base NavBar without travel-specific search pill | Tabs — for in-page tab navigation
  PREFER_OVER Custom header implementations.
  STATES default | with-search-pill (search prop provided) | scrolled (consumer manages)
  RESPONSIVE Search pill collapses or hides on narrow viewports (CSS contract handles).
  A11Y role=banner keys="Tab through brand, search pill, support link, account button, menu button."
  WCAG 2.1.1 Keyboard 2.4.1 Bypass Blocks — pair with SkipLink
  EX "With search pill" <NavBar brandName="TravelCo" search={{ route: 'NYC → LON', dates: '12–19 Mar', passengers: 2 }} onSearchClick={openSearchOverlay} supportPhone="+1 800 123 4567" onAccountClick={openAccount} onMenuClick={openMenu} />
  EX "Brand only" <NavBar brandName="TravelCo" onAccountClick={openAccount} onMenuClick={openMenu} />

C travel/passenger-form PassengerForm
  P index:number req
  P type:enum(Adult|Child|Infant) req
  P initialData:object?
  P onSave:function?
  P onCopyFromPrimary:function?
  P isPrimary:boolean?
  WHEN Passenger details step in the booking funnel. Collects personal information (title, name, date of birth), travel document details (nationality, passport number and expiry), contact info (primary traveler only), and optional extras (frequent flyer number, meal preference, wheelchair assistance, special requests).
  NOT Account registration or profile editing — this form is scoped to travel booking data including passport fields. Do not use for non-passenger form contexts.
  ALT ui/Input, ui/Select, ui/Label — if building a custom form layout from scratch
  PREFER_OVER Ad hoc passenger forms that duplicate the built-in validation and "Copy from primary traveler" logic.
  STATES isPrimary=true — shows "Primary Traveler" legend and email/phone contact fields; hides "Copy from primary traveler" button | isPrimary=false — shows "{type} {index+1}" legend; shows "Copy from primary traveler" button when onCopyFromPrimary is provided | validation errors — inline error messages shown below each invalid field after save attempt | valid submission — calls onSave with complete PassengerData; errors cleared
  RESPONSIVE Personal details grid: 1 col on mobile, 2 cols on sm, 4 cols on md. Passport details: 1 col on mobile, 3 cols on sm. Contact row: 1 col on mobile, 2 cols on sm.
  A11Y role=group (fieldset element) keys="Standard form keyboard navigation. All inputs, selects, and checkboxes are reachable via Tab. Select dropdowns support arrow key navigation."
  WCAG 2.1.1 Keyboard 1.3.1 Info and Relationships 3.3.1 Error Identification 3.3.2 Labels or Instructions
  EX "Primary traveler (adult)" <PassengerForm index={0} type="Adult" isPrimary onSave={(data) => savePassenger(0, data)} />
  EX "Secondary passenger with copy-from-primary" <PassengerForm index={1} type="Adult" onSave={(data) => savePassenger(1, data)} onCopyFromPrimary={() => getPrimaryPassengerData()} />

C travel/price-breakdown PriceBreakdown
  # Makes the component sticky-positioned on desktop
  P lineItems:array req
  P passengerBreakdown:array?
  P promoCode:string?
  P promoDiscount:string?
  P currency:string?
  P totalAmount:string req
  P sticky:boolean?
  WHEN Checkout sidebar or payment page panel that itemises base fare, fees, add-ons, taxes, discounts, and promo codes, with a prominent total. Use sticky=true to keep it visible as the user scrolls through a long checkout form.
  NOT Post-booking confirmation page — use BookingConfirmation which has the QR code and reference number context. Do not use for non-monetary summaries.
  ALT BookingConfirmation — includes total paid in a post-booking read-only view
  PREFER_OVER Custom price summary panels that duplicate the accordion tax/passenger breakdown and promo badge logic.
  STATES sticky=true — component uses sticky positioning for desktop sidebar placement | sticky=false (default) — static positioning | passengerBreakdown provided — collapsible "Passenger details" accordion section shown | taxItems present — collapsible "Taxes & fees" accordion section shown | discountItems present — discount rows shown in green with minus prefix | promoCode + promoDiscount provided — promo row with "PROMO" deal badge shown
  A11Y role=generic (div) with aria-label="Price breakdown" keys="Tab through accordion triggers for Passenger details and Taxes & fees. Accordion content is keyboard expandable."
  WCAG 2.1.1 Keyboard 1.3.1 Info and Relationships
  EX "Checkout sidebar with passenger breakdown and promo" <PriceBreakdown sticky currency="USD" totalAmount="$1,248.00" passengerBreakdown={[ { type: 'Adult', count: 2, priceEach: '$520.00', subtotal: '$1,040.00' }, { type: 'Child', count: 1, priceEach: '$180.00', subtotal: '$180.00' }, ]} lineItems={[ { label: 'Base fare', amount: '$1,220.00', type: 'base' }, { label: 'Seat selection', amount: '$45.00', type: 'addon', description: '3× preferred seats' }, { label: 'Airport tax', amount: '$38.00', type: 'tax' }, { label: 'Fuel surcharge', amount: '$22.00', type: 'tax' }, { label: 'Early bird discount', amount: '−$50.00', type: 'discount' }, ]} promoCode="SUMMER25" promoDiscount="$27.00" />

C travel/room-gallery RoomGallery
  P rooms:array req
  P onSelectRoom:function?

C travel/search-form SearchForm [divider:bottom|top|none=none] [indent:true|false=false] [active:true|false=false] [selected:true|false=false]
  # Controlled tab — when provided the internal tablist is hidden
  P defaultTab:object?
  P activeTab:object?
  P onTabChange:function?
  P destinationOptions:array?
  P airportOptions:array?
  P recentSearches:array?
  P onSearch:function?
  WHEN Primary flight/hotel search entry point. Handles origin/destination, date range, passenger count, cabin class, and trip type. Use in the nav bar or as a standalone hero search.
  NOT Read-only search summary display (use the nav bar search pill). Car or activity search (those require different form fields).
  ALT NavBar search pill — compact read-only summary with edit trigger | SearchOverlay — wrapper that slides the SearchForm into full-screen on mobile
  STATES collapsed (in nav) | expanded (hero or overlay) | tab-flights | tab-hotels | trip-type: one-way|round-trip|multi-city
  ANIM Divider variants (top/bottom) animate on scroll | Destination suggestion list fades in
  RESPONSIVE Stacks vertically on narrow viewports. SearchOverlay wraps for mobile full-screen mode.
  A11Y role=search (form with role=search) keys="Tab through all fields. Combobox supports arrow keys for suggestion navigation. Date picker is keyboard-navigable."
  WCAG 2.1.1 Keyboard 3.3.2 Labels or Instructions 1.3.1 Info and Relationships
  EX "Hero search form" <SearchForm destinationOptions={destinations} airportOptions={airports} recentSearches={recent} onSearch={handleSearch} />
  EX "Controlled active tab" <SearchForm activeTab="hotels" onTabChange={setTab} onSearch={handleSearch} />

C travel/search-overlay SearchOverlay
  P isOpen:boolean req
  P onClose:function req
  P children:React.ReactNode req
  SLOTS children
  WHEN Full-screen modal overlay triggered from the NavBar search pill or a "Edit search" button on results pages. Wraps a SearchForm (or any children) in a focus-trapped, scroll-locked dialog.
  NOT Inline search forms embedded directly in a page layout — only use this when search needs to cover the full viewport. Do not use for non-search dialogs; prefer ui/Dialog for general-purpose modals.
  ALT ui/Dialog — for general modal dialogs with Radix-managed focus trap and portal | ui/Drawer — for bottom-sheet panels on mobile
  PREFER_OVER Custom overlay implementations that must manually wire focus trapping, body scroll lock, and Escape key handling.
  STATES isOpen=true, not exiting — overlay visible with entry state classes | isOpen=false, isExiting=true — overlay visible with "travel-search-overlay--exiting" class for exit animation (EXIT_DURATION currently 0ms) | isOpen=false, not exiting — component returns null, fully unmounted
  ANIM Entry/exit CSS class toggling via travel-search-overlay--exiting; consumers control the animation in CSS
  RESPONSIVE Full-viewport overlay. Panel width and height are controlled by CSS classes.
  A11Y role=dialog keys="Focus moves to first focusable element on open. Tab/Shift+Tab are trapped within the panel. Escape closes the overlay."
  WCAG 2.1.1 Keyboard 2.1.2 No Keyboard Trap (focus is trapped intentionally while modal is open) 3.2.2 On Input
  EX "Wrapping a SearchForm inside the overlay" <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)}> <SearchForm onSearch={(params) => { runSearch(params); setSearchOpen(false); }} /> </SearchOverlay>

C travel/seat-picker SeatPicker
  P seats:array req
  P selectedSeatIds:array?
  P onSeatSelect:function?
  P maxSelections:number?

C travel/support-chat SupportChat
  # If true, message has an attachment stub
  P messages:array?
  P bookingReference:string?
  P agentName:string?
  P agentAvatar:string?
  P isTyping:boolean?
  P onSendMessage:function?
  P onClose:function?

# DEPS
ui/accordion -> ui/icon
ui/alert -> ui/icon
ui/alert-dialog -> ui/button
ui/breadcrumb -> ui/icon
ui/calendar -> ui/button
ui/checkbox -> ui/icon
ui/combobox -> ui/icon
ui/date-picker -> ui/popover ui/button ui/calendar
ui/dialog -> ui/icon
ui/dropdown-menu -> ui/icon
ui/icon -> ui/icon
ui/navigation-menu -> ui/icon
ui/pagination -> ui/icon ui/button
ui/radio-group -> ui/icon
ui/select -> ui/icon
ui/sheet -> ui/icon
ui/tabs -> ui/notification-badge
ui/toast -> ui/icon
travel/activity-card -> ui/button ui/badge ui/aspect-ratio
travel/booking-confirmation -> ui/button ui/badge ui/separator
travel/car-card -> ui/button ui/badge ui/switch
travel/destination-item-content -> ui/icon
travel/filter-bar -> ui/slider ui/checkbox ui/label travel/filter-chip travel/filter-panel
travel/filter-chip -> ui/popover ui/icon
travel/filter-panel -> ui/button ui/notification-badge ui/checkbox ui/slider ui/switch ui/accordion ui/label ui/radio-group
travel/flight-card -> ui/button
travel/flight-details -> ui/button ui/badge travel/flight-card
travel/flight-map -> travel/flight-map
travel/hotel-card -> ui/button ui/badge ui/aspect-ratio
travel/itinerary-timeline -> ui/badge
travel/passenger-form -> ui/button ui/input ui/label ui/select ui/checkbox ui/textarea
travel/price-breakdown -> ui/badge ui/accordion ui/separator
travel/room-gallery -> ui/button ui/badge ui/aspect-ratio ui/dialog
travel/search-form -> ui/icon ui/calendar ui/popover ui/button travel/destination-item-content
travel/support-chat -> ui/button

# PATTERNS
PAT search-form "Search Form" [travel/search-form,travel/search-overlay,ui/input,ui/button,ui/popover]
  # Origin/destination input with date range and passenger count
  EXAMPLE <SearchForm onSearch={fn} />
PAT filter-bar "Filter Bar" [travel/filter-bar,travel/filter-chip,travel/filter-panel]
  # Horizontal chip strip for quick flight filtering
  EXAMPLE <FilterBar chips={chips} onFilter={fn} />
PAT flight-listing "Flight Listing" [travel/flight-card,ui/badge,ui/skeleton]
  # Scrollable list of flight result cards
  EXAMPLE <FlightCard flight={flight} onSelect={fn} />
PAT flight-detail "Flight Detail" [travel/flight-details,travel/flight-map,travel/itinerary-timeline,travel/price-breakdown,ui/button]
  # Expanded flight details panel with map, timeline, and booking
  EXAMPLE <FlightDetails flight={flight} onBook={fn} />
PAT booking-flow "Booking Flow" [travel/booking-stepper,travel/passenger-form,travel/seat-picker,travel/booking-confirmation,ui/dialog,ui/button]
  # Multi-step booking: passengers → seats → confirmation
  EXAMPLE <BookingStepper steps={steps} />
PAT hotel-listing "Hotel Listing" [travel/hotel-card,travel/room-gallery,ui/badge,ui/skeleton]
  # Hotel result cards with room gallery
  EXAMPLE <HotelCard hotel={hotel} onSelect={fn} />
PAT nav-bar "Navigation Bar" [travel/nav-bar,ui/button,ui/dropdown-menu]
  # Top navigation with brand logo, locale switcher, and auth
  EXAMPLE <NavBar brand={brand} />
PAT notification "Notification / Toast" [ui/toast,ui/notification-badge]
  # Transient feedback messages
  EXAMPLE <Toast message="..." variant="success" />
PAT form-fields "Form Fields" [ui/input,ui/label,ui/select,ui/checkbox,ui/radio-group,ui/textarea]
  # Labeled inputs with validation feedback
  EXAMPLE <Input label="Email" type="email" />
PAT data-table "Data Table" [ui/table,ui/pagination,ui/skeleton]
  # Structured tabular data with pagination
  EXAMPLE <Table columns={cols} rows={rows} />

# SCREENS
SCR flights-search "Flights Search" [ui/card,ui/nav-bar,travel/filter-bar,travel/filter-panel,travel/flight-card,travel/flight-details,travel/flight-map,travel/nav-bar,travel/search-form,travel/search-overlay]
  PAT search-form filter-bar flight-listing flight-detail nav-bar
SCR hotels-search "Hotels Search" [travel/hotel-card,travel/room-gallery,ui/badge,ui/skeleton,travel/nav-bar,ui/button,ui/dropdown-menu]
  PAT hotel-listing nav-bar
SCR booking "Booking" [travel/booking-stepper,travel/passenger-form,travel/seat-picker,travel/booking-confirmation,ui/dialog,ui/button]
  PAT booking-flow
SCR home "Home" []
  PAT nav-bar search-form
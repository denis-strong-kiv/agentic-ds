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

C ui/alert Alert [variant:info|success|warning|error=info]
  # Optional dismiss callback — renders a close button when provided
  P onDismiss:function?

C ui/alert-dialog AlertDialog @alert-dialog

C ui/aspect-ratio AspectRatio @aspect-ratio

C ui/avatar Avatar @avatar
  # Status indicator dot overlay for Avatar
  P status:enum(online|away|busy|offline) req

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

C ui/card Card [variant:elevated|outlined=outlined]

C ui/checkbox Checkbox @checkbox

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

C ui/date-picker DatePicker
  P value:object?
  P onChange:function?
  P placeholder:string?
  P minDate:object?
  P maxDate:object?
  P disabledDates:array?

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

C ui/icon Icon
  # A Lucide icon or a custom OTA icon component
  P icon:enum(LucideIcon|OtaIcon) req
  P size:object='md'?
  P label:string?
  SLOTS icon label

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

C ui/navigation-menu NavigationMenu @navigation-menu

C ui/notification-badge NotificationBadge [variant:brand|accent|success|warning|danger|neutral|inverted=brand] [size:lg|md=lg]
  # Numeric count to display. Omit to render children (icon/dot mode).
  P count:number?
  P max:number?

C ui/pagination Pagination

C ui/popover Popover @popover

C ui/progress Progress @progress

C ui/radio-group RadioGroup @radio-group

C ui/scroll-area ScrollArea @scroll-area

C ui/select Select @select

C ui/separator Separator @separator

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

C ui/slider Slider @slider
  # Show formatted value labels above thumbs
  P showValue:boolean?
  P formatValue:function?

C ui/switch Switch @switch
  # Label positioning relative to the switch
  P labelPosition:enum(left|right)?
  P label:string?
  SLOTS label

C ui/table Table
  # Highlight row as selected
  P selected:boolean?

C ui/tabs Tabs [orientation:horizontal|vertical=horizontal] @tabs
  P icon:React.ReactNode?
  P badge:number?
  SLOTS icon badge

C ui/textarea Textarea
  # Show character count (requires maxLength)
  P error:string?
  P showCount:boolean?
  P autoResize:boolean?

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

C travel/booking-stepper BookingStepper
  P steps:array req
  P onStepClick:function?
  P 'aria-label':string?

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

C travel/itinerary-timeline ItineraryTimeline
  # Duration gap before next event, e.g. "2h 30m layover"
  P events:array req

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

C travel/price-breakdown PriceBreakdown
  # Makes the component sticky-positioned on desktop
  P lineItems:array req
  P passengerBreakdown:array?
  P promoCode:string?
  P promoDiscount:string?
  P currency:string?
  P totalAmount:string req
  P sticky:boolean?

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
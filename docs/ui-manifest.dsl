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

C ui/breadcrumb Breadcrumb

C ui/button Button [variant:primary|secondary|tertiary|neutral|'inverted-primary'|'inverted-secondary'|'inverted-tertiary'|outline|ghost|destructive|link=primary] [size:sm|md|lg|xl|icon=md]
  # Shows a loading spinner and disables the button
  P isLoading:boolean?
  P spinner:React.ReactNode?
  SLOTS spinner

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

C ui/skeleton Skeleton [animation:pulse|shimmer|none=pulse]

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

C travel/flight-map FlightMap
  # [origin, destination] — great-circle arc is generated internally
  P airports:array req
  P paths:array?
  P initialViewState:object?

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
SCR flights-search "Flights Search" [ui/breadcrumb,ui/card,ui/nav-bar,ui/select,travel/filter-bar,travel/filter-panel,travel/flight-card,travel/flight-details,travel/flight-map,travel/nav-bar,travel/search-form,travel/search-overlay]
  PAT search-form filter-bar flight-listing flight-detail nav-bar
SCR hotels-search "Hotels Search" [travel/hotel-card,travel/room-gallery,ui/badge,ui/skeleton,travel/nav-bar,ui/button,ui/dropdown-menu]
  PAT hotel-listing nav-bar
SCR booking "Booking" [travel/booking-stepper,travel/passenger-form,travel/seat-picker,travel/booking-confirmation,ui/dialog,ui/button]
  PAT booking-flow
SCR home "Home" []
  PAT nav-bar search-form
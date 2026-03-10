/**
 * mock-flights.ts
 * Realistic JFK/EWR/LGA → LHR round-trip flight results for local development.
 * Airline logos via https://www.skymonde.com/images/square-carriers/logo/{iata}.png
 */

import type { FlightLeg, BaggageAllowance } from '@travel/ui/components/travel/flight-card';
import type { FareOption } from '@travel/ui/components/travel/flight-details';
import type { DestinationOption } from '@travel/ui/components/travel/search-form';

// ─── Airline logo helper ───────────────────────────────────────────────────────

function logo(iata: string) {
  return `https://www.skymonde.com/images/square-carriers/logo/${iata.toLowerCase()}.png`;
}

// ─── Shared fare option sets ───────────────────────────────────────────────────

const ECONOMY_FARES: FareOption[] = [
  {
    id: 'basic',
    name: 'Basic',
    fareClass: 'Economy',
    price: '$549',
    features: ['1 carry-on bag', 'No seat selection', 'No changes allowed'],
  },
  {
    id: 'standard',
    name: 'Standard',
    fareClass: 'Economy',
    price: '$673',
    features: ['1 carry-on + 1 checked bag (23 kg)', 'Standard seat selection', 'Free rebooking'],
    isRecommended: true,
  },
  {
    id: 'flex',
    name: 'Flex',
    fareClass: 'Economy',
    price: '$798',
    features: ['1 carry-on + 2 checked bags', 'Any seat incl. exit rows', 'Free changes', 'Fully refundable'],
  },
];

const BUSINESS_FARES: FareOption[] = [
  {
    id: 'club',
    name: 'Club World',
    fareClass: 'Business',
    price: '$3,450',
    features: ['Flat-bed seat', '2 checked bags (32 kg)', 'Lounge access', 'Priority boarding'],
    isRecommended: true,
  },
  {
    id: 'club-flex',
    name: 'Club World Flex',
    fareClass: 'Business',
    price: '$4,100',
    features: ['Flat-bed seat', '2 checked bags (32 kg)', 'Lounge access', 'Free changes', 'Refundable'],
  },
];

// ─── FlightResult type ─────────────────────────────────────────────────────────

export interface FlightResult {
  id: string;
  legs: FlightLeg[];
  price: string;
  totalPrice?: string;
  fareClass?: string;
  fareBreakdown?: { label: string; amount: string; type?: 'base' | 'tax' | 'fee' | 'total' }[];
  fareOptions?: FareOption[];
  baggage?: BaggageAllowance;
  isCheapest?: boolean;
  isBestValue?: boolean;
  seatsLeft?: number;
  similarCount?: number;
}

// ─── 20 mock flights ───────────────────────────────────────────────────────────

export const MOCK_FLIGHTS: FlightResult[] = [
  // ── f1: Swiss via ZRH — cheapest ──────────────────────────────────────────
  {
    id: 'f1',
    isCheapest: true,
    seatsLeft: 4,
    price: '$598',
    totalPrice: '$1,196',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 0, checkedFee: '+$138' },
    fareOptions: ECONOMY_FARES,
    fareBreakdown: [
      { label: 'Base fare', amount: '$474', type: 'base' },
      { label: 'Taxes & fees', amount: '$124', type: 'tax' },
      { label: 'Total', amount: '$598', type: 'total' },
    ],
    legs: [
      {
        duration: '10h 40m', stops: 1, stopAirports: ['ZRH'],
        segments: [
          { airline: 'Swiss', airlineLogo: logo('lx'), flightNumber: 'LX 87', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'ZRH', destinationCity: 'Zurich', destinationAirportName: 'Zurich Airport', departureTime: '4:15 PM', arrivalTime: '6:05 AM+1', duration: '8h 50m', class: 'Economy' },
          { airline: 'Swiss', airlineLogo: logo('lx'), flightNumber: 'LX 318', origin: 'ZRH', originCity: 'Zurich', originAirportName: 'Zurich Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '7:05 AM', arrivalTime: '7:55 AM', duration: '1h 50m', class: 'Economy' },
        ],
      },
      {
        duration: '11h 18m', stops: 1, stopAirports: ['YYZ'],
        segments: [
          { airline: 'Air Canada', airlineLogo: logo('ac'), flightNumber: 'AC 849', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'YYZ', destinationCity: 'Toronto', destinationAirportName: 'Toronto Pearson Airport', departureTime: '8:30 AM', arrivalTime: '11:25 AM', duration: '8h 55m', class: 'Economy' },
          { airline: 'Air Canada', airlineLogo: logo('ac'), flightNumber: 'AC 781', origin: 'YYZ', originCity: 'Toronto', originAirportName: 'Toronto Pearson Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '1:10 PM', arrivalTime: '2:48 PM', duration: '1h 38m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f2: United nonstop EWR — best value ───────────────────────────────────
  {
    id: 'f2',
    isBestValue: true,
    price: '$675',
    totalPrice: '$1,350',
    fareClass: 'Economy',
    similarCount: 2,
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '7h 25m', stops: 0,
        segments: [
          { airline: 'United Airlines', airlineLogo: logo('ua'), flightNumber: 'UA 9838', origin: 'EWR', originCity: 'Newark', originAirportName: 'Newark Liberty Intl Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '5:30 PM', arrivalTime: '5:55 AM+1', duration: '7h 25m', class: 'Economy' },
        ],
      },
      {
        duration: '12h 5m', stops: 1, stopAirports: ['ZRH'],
        segments: [
          { airline: 'Swiss', airlineLogo: logo('lx'), flightNumber: 'LX 4905', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'ZRH', destinationCity: 'Zurich', destinationAirportName: 'Zurich Airport', departureTime: '6:00 AM', arrivalTime: '9:05 AM', duration: '2h 5m', class: 'Economy' },
          { airline: 'Swiss', airlineLogo: logo('lx'), flightNumber: 'LX 22', origin: 'ZRH', originCity: 'Zurich', originAirportName: 'Zurich Airport', destination: 'EWR', destinationCity: 'Newark', destinationAirportName: 'Newark Liberty Intl Airport', departureTime: '10:30 AM', arrivalTime: '1:05 PM', duration: '9h 35m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f3: British Airways nonstop both ways ──────────────────────────────────
  {
    id: 'f3',
    price: '$712',
    totalPrice: '$1,424',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '6h 55m', stops: 0,
        segments: [
          { airline: 'British Airways', airlineLogo: logo('ba'), flightNumber: 'BA 117', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '7:05 PM', arrivalTime: '7:00 AM+1', duration: '6h 55m', class: 'Economy' },
        ],
      },
      {
        duration: '8h 10m', stops: 0,
        segments: [
          { airline: 'British Airways', airlineLogo: logo('ba'), flightNumber: 'BA 178', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '11:00 AM', arrivalTime: '2:10 PM', duration: '8h 10m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f4: Air Canada via YYZ + British Airways return ───────────────────────
  {
    id: 'f4',
    price: '$691',
    totalPrice: '$1,382',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 2 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '9h 45m', stops: 1, stopAirports: ['YYZ'],
        segments: [
          { airline: 'Air Canada', airlineLogo: logo('ac'), flightNumber: 'AC 856', origin: 'LGA', originCity: 'New York', originAirportName: 'LaGuardia Airport', destination: 'YYZ', destinationCity: 'Toronto', destinationAirportName: 'Toronto Pearson Airport', departureTime: '6:40 AM', arrivalTime: '8:00 AM', duration: '1h 20m', class: 'Economy' },
          { airline: 'Air Canada', airlineLogo: logo('ac'), flightNumber: 'AC 808', origin: 'YYZ', originCity: 'Toronto', originAirportName: 'Toronto Pearson Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '9:30 AM', arrivalTime: '10:15 PM', duration: '7h 45m', class: 'Economy' },
        ],
      },
      {
        duration: '8h 30m', stops: 0,
        segments: [
          { airline: 'British Airways', airlineLogo: logo('ba'), flightNumber: 'BA 176', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '3:30 PM', arrivalTime: '6:00 PM', duration: '8h 30m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f5: Delta via CDG ──────────────────────────────────────────────────────
  {
    id: 'f5',
    price: '$709',
    totalPrice: '$1,418',
    fareClass: 'Economy',
    seatsLeft: 7,
    baggage: { carryOn: 1, checked: 0, checkedFee: '+$120' },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '11h 20m', stops: 1, stopAirports: ['CDG'],
        segments: [
          { airline: 'Delta', airlineLogo: logo('dl'), flightNumber: 'DL 263', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'CDG', destinationCity: 'Paris', destinationAirportName: 'Charles de Gaulle Airport', departureTime: '6:45 PM', arrivalTime: '8:05 AM+1', duration: '7h 20m', class: 'Economy' },
          { airline: 'Air France', airlineLogo: logo('af'), flightNumber: 'AF 1681', origin: 'CDG', originCity: 'Paris', originAirportName: 'Charles de Gaulle Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '10:20 AM', arrivalTime: '10:35 AM', duration: '1h 15m', class: 'Economy' },
        ],
      },
      {
        duration: '10h 55m', stops: 1, stopAirports: ['CDG'],
        segments: [
          { airline: 'Air France', airlineLogo: logo('af'), flightNumber: 'AF 1680', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'CDG', destinationCity: 'Paris', destinationAirportName: 'Charles de Gaulle Airport', departureTime: '7:30 AM', arrivalTime: '9:50 AM', duration: '1h 20m', class: 'Economy' },
          { airline: 'Delta', airlineLogo: logo('dl'), flightNumber: 'DL 264', origin: 'CDG', originCity: 'Paris', originAirportName: 'Charles de Gaulle Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '11:30 AM', arrivalTime: '1:25 PM', duration: '8h 55m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f6: Lufthansa via FRA ──────────────────────────────────────────────────
  {
    id: 'f6',
    price: '$721',
    totalPrice: '$1,442',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '11h 50m', stops: 1, stopAirports: ['FRA'],
        segments: [
          { airline: 'Lufthansa', airlineLogo: logo('lh'), flightNumber: 'LH 401', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'FRA', destinationCity: 'Frankfurt', destinationAirportName: 'Frankfurt Airport', departureTime: '5:05 PM', arrivalTime: '7:00 AM+1', duration: '7h 55m', class: 'Economy' },
          { airline: 'Lufthansa', airlineLogo: logo('lh'), flightNumber: 'LH 902', origin: 'FRA', originCity: 'Frankfurt', originAirportName: 'Frankfurt Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '9:35 AM', arrivalTime: '10:00 AM', duration: '1h 25m', class: 'Economy' },
        ],
      },
      {
        duration: '10h 25m', stops: 1, stopAirports: ['FRA'],
        segments: [
          { airline: 'Lufthansa', airlineLogo: logo('lh'), flightNumber: 'LH 903', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'FRA', destinationCity: 'Frankfurt', destinationAirportName: 'Frankfurt Airport', departureTime: '2:05 PM', arrivalTime: '5:00 PM', duration: '1h 55m', class: 'Economy' },
          { airline: 'Lufthansa', airlineLogo: logo('lh'), flightNumber: 'LH 400', origin: 'FRA', originCity: 'Frankfurt', originAirportName: 'Frankfurt Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '6:00 PM', arrivalTime: '8:25 PM', duration: '9h 25m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f7: KLM via AMS ───────────────────────────────────────────────────────
  {
    id: 'f7',
    price: '$734',
    totalPrice: '$1,468',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '11h 15m', stops: 1, stopAirports: ['AMS'],
        segments: [
          { airline: 'KLM', airlineLogo: logo('kl'), flightNumber: 'KL 641', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'AMS', destinationCity: 'Amsterdam', destinationAirportName: 'Amsterdam Schiphol Airport', departureTime: '6:00 PM', arrivalTime: '7:50 AM+1', duration: '7h 50m', class: 'Economy' },
          { airline: 'KLM', airlineLogo: logo('kl'), flightNumber: 'KL 1009', origin: 'AMS', originCity: 'Amsterdam', originAirportName: 'Amsterdam Schiphol Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '9:30 AM', arrivalTime: '9:45 AM', duration: '1h 15m', class: 'Economy' },
        ],
      },
      {
        duration: '11h 35m', stops: 1, stopAirports: ['AMS'],
        segments: [
          { airline: 'KLM', airlineLogo: logo('kl'), flightNumber: 'KL 1008', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'AMS', destinationCity: 'Amsterdam', destinationAirportName: 'Amsterdam Schiphol Airport', departureTime: '6:15 AM', arrivalTime: '8:30 AM', duration: '1h 15m', class: 'Economy' },
          { airline: 'KLM', airlineLogo: logo('kl'), flightNumber: 'KL 642', origin: 'AMS', originCity: 'Amsterdam', originAirportName: 'Amsterdam Schiphol Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '10:35 AM', arrivalTime: '12:10 PM', duration: '8h 35m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f8: Aer Lingus via DUB ────────────────────────────────────────────────
  {
    id: 'f8',
    price: '$748',
    totalPrice: '$1,496',
    fareClass: 'Economy',
    seatsLeft: 3,
    baggage: { carryOn: 1, checked: 0, checkedFee: '+$100' },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '11h 45m', stops: 1, stopAirports: ['DUB'],
        segments: [
          { airline: 'Aer Lingus', airlineLogo: logo('ei'), flightNumber: 'EI 105', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'DUB', destinationCity: 'Dublin', destinationAirportName: 'Dublin Airport', departureTime: '7:15 PM', arrivalTime: '7:00 AM+1', duration: '6h 45m', class: 'Economy' },
          { airline: 'Aer Lingus', airlineLogo: logo('ei'), flightNumber: 'EI 161', origin: 'DUB', originCity: 'Dublin', originAirportName: 'Dublin Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '9:05 AM', arrivalTime: '10:05 AM', duration: '1h 00m', class: 'Economy' },
        ],
      },
      {
        duration: '9h 45m', stops: 1, stopAirports: ['DUB'],
        segments: [
          { airline: 'Aer Lingus', airlineLogo: logo('ei'), flightNumber: 'EI 162', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'DUB', destinationCity: 'Dublin', destinationAirportName: 'Dublin Airport', departureTime: '12:00 PM', arrivalTime: '1:00 PM', duration: '1h 00m', class: 'Economy' },
          { airline: 'Aer Lingus', airlineLogo: logo('ei'), flightNumber: 'EI 108', origin: 'DUB', originCity: 'Dublin', originAirportName: 'Dublin Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '2:25 PM', arrivalTime: '4:10 PM', duration: '7h 45m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f9: Virgin Atlantic nonstop both ways ──────────────────────────────────
  {
    id: 'f9',
    price: '$762',
    totalPrice: '$1,524',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '7h 10m', stops: 0,
        segments: [
          { airline: 'Virgin Atlantic', airlineLogo: logo('vs'), flightNumber: 'VS 3', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '9:45 PM', arrivalTime: '9:55 AM+1', duration: '7h 10m', class: 'Economy' },
        ],
      },
      {
        duration: '8h 25m', stops: 0,
        segments: [
          { airline: 'Virgin Atlantic', airlineLogo: logo('vs'), flightNumber: 'VS 4', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '1:15 PM', arrivalTime: '4:40 PM', duration: '8h 25m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f10: TAP via LIS (2 stops return) ────────────────────────────────────
  {
    id: 'f10',
    price: '$679',
    totalPrice: '$1,358',
    fareClass: 'Economy',
    seatsLeft: 9,
    baggage: { carryOn: 1, checked: 0, checkedFee: '+$138' },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '9h 45m', stops: 1, stopAirports: ['LIS'],
        segments: [
          { airline: 'TAP Air Portugal', airlineLogo: logo('tp'), flightNumber: 'TP 207', origin: 'EWR', originCity: 'Newark', originAirportName: 'Newark Liberty Intl Airport', destination: 'LIS', destinationCity: 'Lisbon', destinationAirportName: 'Lisbon Humberto Delgado Airport', departureTime: '9:00 PM', arrivalTime: '8:45 AM+1', duration: '6h 45m', class: 'Economy' },
          { airline: 'TAP Air Portugal', airlineLogo: logo('tp'), flightNumber: 'TP 1362', origin: 'LIS', originCity: 'Lisbon', originAirportName: 'Lisbon Humberto Delgado Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '11:15 AM', arrivalTime: '1:15 PM', duration: '2h 00m', class: 'Economy' },
        ],
      },
      {
        duration: '23h 5m', stops: 2, stopAirports: ['BOS', 'LIS'],
        segments: [
          { airline: 'TAP Air Portugal', airlineLogo: logo('tp'), flightNumber: 'TP 1361', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'LIS', destinationCity: 'Lisbon', destinationAirportName: 'Lisbon Humberto Delgado Airport', departureTime: '3:35 AM', arrivalTime: '5:45 AM', duration: '2h 10m', class: 'Economy' },
          { airline: 'TAP Air Portugal', airlineLogo: logo('tp'), flightNumber: 'TP 201', origin: 'LIS', originCity: 'Lisbon', originAirportName: 'Lisbon Humberto Delgado Airport', destination: 'BOS', destinationCity: 'Boston', destinationAirportName: 'Logan International Airport', departureTime: '9:25 AM', arrivalTime: '12:55 PM', duration: '8h 30m', class: 'Economy' },
          { airline: 'American Airlines', airlineLogo: logo('aa'), flightNumber: 'AA 2173', origin: 'BOS', originCity: 'Boston', originAirportName: 'Logan International Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '5:55 PM', arrivalTime: '6:29 PM', duration: '1h 34m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f11: American nonstop JFK-LHR ─────────────────────────────────────────
  {
    id: 'f11',
    price: '$788',
    totalPrice: '$1,576',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '6h 45m', stops: 0,
        segments: [
          { airline: 'American Airlines', airlineLogo: logo('aa'), flightNumber: 'AA 100', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '10:20 PM', arrivalTime: '10:05 AM+1', duration: '6h 45m', class: 'Economy' },
        ],
      },
      {
        duration: '9h 10m', stops: 0,
        segments: [
          { airline: 'American Airlines', airlineLogo: logo('aa'), flightNumber: 'AA 101', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '12:05 PM', arrivalTime: '3:15 PM', duration: '9h 10m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f12: Finnair via HEL ──────────────────────────────────────────────────
  {
    id: 'f12',
    price: '$799',
    totalPrice: '$1,598',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '15h 30m', stops: 1, stopAirports: ['HEL'],
        segments: [
          { airline: 'Finnair', airlineLogo: logo('ay'), flightNumber: 'AY 5', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'HEL', destinationCity: 'Helsinki', destinationAirportName: 'Helsinki-Vantaa Airport', departureTime: '4:15 PM', arrivalTime: '11:00 AM+1', duration: '9h 45m', class: 'Economy' },
          { airline: 'Finnair', airlineLogo: logo('ay'), flightNumber: 'AY 833', origin: 'HEL', originCity: 'Helsinki', originAirportName: 'Helsinki-Vantaa Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '12:45 PM', arrivalTime: '2:15 PM', duration: '3h 30m', class: 'Economy' },
        ],
      },
      {
        duration: '13h 45m', stops: 1, stopAirports: ['HEL'],
        segments: [
          { airline: 'Finnair', airlineLogo: logo('ay'), flightNumber: 'AY 834', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'HEL', destinationCity: 'Helsinki', destinationAirportName: 'Helsinki-Vantaa Airport', departureTime: '3:00 PM', arrivalTime: '8:30 PM', duration: '3h 30m', class: 'Economy' },
          { airline: 'Finnair', airlineLogo: logo('ay'), flightNumber: 'AY 6', origin: 'HEL', originCity: 'Helsinki', originAirportName: 'Helsinki-Vantaa Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '9:30 PM', arrivalTime: '12:15 AM+1', duration: '9h 45m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f13: Iberia via MAD ───────────────────────────────────────────────────
  {
    id: 'f13',
    price: '$814',
    totalPrice: '$1,628',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '12h 20m', stops: 1, stopAirports: ['MAD'],
        segments: [
          { airline: 'Iberia', airlineLogo: logo('ib'), flightNumber: 'IB 6253', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'MAD', destinationCity: 'Madrid', destinationAirportName: 'Adolfo Suárez Madrid-Barajas Airport', departureTime: '7:40 PM', arrivalTime: '8:20 AM+1', duration: '7h 40m', class: 'Economy' },
          { airline: 'Iberia', airlineLogo: logo('ib'), flightNumber: 'IB 3165', origin: 'MAD', originCity: 'Madrid', originAirportName: 'Adolfo Suárez Madrid-Barajas Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '10:45 AM', arrivalTime: '12:10 PM', duration: '2h 25m', class: 'Economy' },
        ],
      },
      {
        duration: '12h 55m', stops: 1, stopAirports: ['MAD'],
        segments: [
          { airline: 'Iberia', airlineLogo: logo('ib'), flightNumber: 'IB 3164', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'MAD', destinationCity: 'Madrid', destinationAirportName: 'Adolfo Suárez Madrid-Barajas Airport', departureTime: '7:00 AM', arrivalTime: '10:25 AM', duration: '2h 25m', class: 'Economy' },
          { airline: 'Iberia', airlineLogo: logo('ib'), flightNumber: 'IB 6254', origin: 'MAD', originCity: 'Madrid', originAirportName: 'Adolfo Suárez Madrid-Barajas Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '12:00 PM', arrivalTime: '2:55 PM', duration: '9h 55m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f14: Turkish Airlines via IST ─────────────────────────────────────────
  {
    id: 'f14',
    price: '$689',
    totalPrice: '$1,378',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '14h 30m', stops: 1, stopAirports: ['IST'],
        segments: [
          { airline: 'Turkish Airlines', airlineLogo: logo('tk'), flightNumber: 'TK 1', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'IST', destinationCity: 'Istanbul', destinationAirportName: 'Istanbul Airport', departureTime: '5:15 PM', arrivalTime: '11:25 AM+1', duration: '10h 10m', class: 'Economy' },
          { airline: 'Turkish Airlines', airlineLogo: logo('tk'), flightNumber: 'TK 1976', origin: 'IST', originCity: 'Istanbul', originAirportName: 'Istanbul Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '1:50 PM', arrivalTime: '3:45 PM', duration: '3h 55m', class: 'Economy' },
        ],
      },
      {
        duration: '15h 10m', stops: 1, stopAirports: ['IST'],
        segments: [
          { airline: 'Turkish Airlines', airlineLogo: logo('tk'), flightNumber: 'TK 1977', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'IST', destinationCity: 'Istanbul', destinationAirportName: 'Istanbul Airport', departureTime: '6:45 AM', arrivalTime: '1:30 PM', duration: '3h 45m', class: 'Economy' },
          { airline: 'Turkish Airlines', airlineLogo: logo('tk'), flightNumber: 'TK 2', origin: 'IST', originCity: 'Istanbul', originAirportName: 'Istanbul Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '3:15 PM', arrivalTime: '7:25 PM', duration: '11h 10m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f15: BA Business ──────────────────────────────────────────────────────
  {
    id: 'f15',
    price: '$3,450',
    totalPrice: '$6,900',
    fareClass: 'Business',
    baggage: { carryOn: 1, checked: 2 },
    fareOptions: BUSINESS_FARES,
    legs: [
      {
        duration: '6h 55m', stops: 0,
        segments: [
          { airline: 'British Airways', airlineLogo: logo('ba'), flightNumber: 'BA 113', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '8:25 PM', arrivalTime: '8:20 AM+1', duration: '6h 55m', class: 'Business' },
        ],
      },
      {
        duration: '7h 50m', stops: 0,
        segments: [
          { airline: 'British Airways', airlineLogo: logo('ba'), flightNumber: 'BA 112', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '10:20 AM', arrivalTime: '1:10 PM', duration: '7h 50m', class: 'Business' },
        ],
      },
    ],
  },

  // ── f16: United via ORD ───────────────────────────────────────────────────
  {
    id: 'f16',
    price: '$718',
    totalPrice: '$1,436',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '13h 10m', stops: 1, stopAirports: ['ORD'],
        segments: [
          { airline: 'United Airlines', airlineLogo: logo('ua'), flightNumber: 'UA 1184', origin: 'EWR', originCity: 'Newark', originAirportName: 'Newark Liberty Intl Airport', destination: 'ORD', destinationCity: 'Chicago', destinationAirportName: "O'Hare International Airport", departureTime: '6:00 AM', arrivalTime: '7:18 AM', duration: '2h 18m', class: 'Economy' },
          { airline: 'United Airlines', airlineLogo: logo('ua'), flightNumber: 'UA 918', origin: 'ORD', originCity: 'Chicago', originAirportName: "O'Hare International Airport", destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '9:35 AM', arrivalTime: '11:25 PM', duration: '8h 50m', class: 'Economy' },
        ],
      },
      {
        duration: '7h 30m', stops: 0,
        segments: [
          { airline: 'United Airlines', airlineLogo: logo('ua'), flightNumber: 'UA 923', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'EWR', destinationCity: 'Newark', destinationAirportName: 'Newark Liberty Intl Airport', departureTime: '4:00 PM', arrivalTime: '7:30 PM', duration: '7h 30m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f17: Delta nonstop JFK-LHR ────────────────────────────────────────────
  {
    id: 'f17',
    price: '$845',
    totalPrice: '$1,690',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '7h 0m', stops: 0,
        segments: [
          { airline: 'Delta', airlineLogo: logo('dl'), flightNumber: 'DL 401', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '6:45 PM', arrivalTime: '6:45 AM+1', duration: '7h 0m', class: 'Economy' },
        ],
      },
      {
        duration: '9h 0m', stops: 0,
        segments: [
          { airline: 'Delta', airlineLogo: logo('dl'), flightNumber: 'DL 402', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '10:00 AM', arrivalTime: '1:00 PM', duration: '9h 0m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f18: Norse Atlantic nonstop ───────────────────────────────────────────
  {
    id: 'f18',
    price: '$489',
    totalPrice: '$978',
    fareClass: 'Economy',
    isCheapest: false,
    seatsLeft: 2,
    baggage: { carryOn: 1, checked: 0, checkedFee: '+$90' },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '7h 15m', stops: 0,
        segments: [
          { airline: 'Norse Atlantic', airlineLogo: logo('n0'), flightNumber: 'N0 1', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'LGW', destinationCity: 'London', destinationAirportName: 'London Gatwick Airport', departureTime: '9:00 PM', arrivalTime: '9:15 AM+1', duration: '7h 15m', class: 'Economy' },
        ],
      },
      {
        duration: '8h 55m', stops: 0,
        segments: [
          { airline: 'Norse Atlantic', airlineLogo: logo('n0'), flightNumber: 'N0 2', origin: 'LGW', originCity: 'London', originAirportName: 'London Gatwick Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '11:00 AM', arrivalTime: '2:55 PM', duration: '8h 55m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f19: Icelandair via KEF ───────────────────────────────────────────────
  {
    id: 'f19',
    price: '$645',
    totalPrice: '$1,290',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 0, checkedFee: '+$65' },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '11h 45m', stops: 1, stopAirports: ['KEF'],
        segments: [
          { airline: 'Icelandair', airlineLogo: logo('fi'), flightNumber: 'FI 611', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'KEF', destinationCity: 'Reykjavik', destinationAirportName: 'Keflavik International Airport', departureTime: '7:00 PM', arrivalTime: '6:00 AM+1', duration: '6h 00m', class: 'Economy' },
          { airline: 'Icelandair', airlineLogo: logo('fi'), flightNumber: 'FI 451', origin: 'KEF', originCity: 'Reykjavik', originAirportName: 'Keflavik International Airport', destination: 'LHR', destinationCity: 'London', destinationAirportName: 'London Heathrow Airport', departureTime: '7:30 AM', arrivalTime: '11:15 AM', duration: '2h 45m', class: 'Economy' },
        ],
      },
      {
        duration: '11h 20m', stops: 1, stopAirports: ['KEF'],
        segments: [
          { airline: 'Icelandair', airlineLogo: logo('fi'), flightNumber: 'FI 452', origin: 'LHR', originCity: 'London', originAirportName: 'London Heathrow Airport', destination: 'KEF', destinationCity: 'Reykjavik', destinationAirportName: 'Keflavik International Airport', departureTime: '12:00 PM', arrivalTime: '2:50 PM', duration: '2h 50m', class: 'Economy' },
          { airline: 'Icelandair', airlineLogo: logo('fi'), flightNumber: 'FI 612', origin: 'KEF', originCity: 'Reykjavik', originAirportName: 'Keflavik International Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '3:45 PM', arrivalTime: '5:05 PM', duration: '5h 20m', class: 'Economy' },
        ],
      },
    ],
  },

  // ── f20: Air France nonstop both ways ────────────────────────────────────
  {
    id: 'f20',
    price: '$856',
    totalPrice: '$1,712',
    fareClass: 'Economy',
    baggage: { carryOn: 1, checked: 1 },
    fareOptions: ECONOMY_FARES,
    legs: [
      {
        duration: '7h 20m', stops: 0,
        segments: [
          { airline: 'Air France', airlineLogo: logo('af'), flightNumber: 'AF 23', origin: 'JFK', originCity: 'New York', originAirportName: 'John F. Kennedy Intl Airport', destination: 'CDG', destinationCity: 'Paris', destinationAirportName: 'Charles de Gaulle Airport', departureTime: '4:30 PM', arrivalTime: '6:20 AM+1', duration: '7h 50m', class: 'Economy' },
        ],
      },
      {
        duration: '8h 50m', stops: 0,
        segments: [
          { airline: 'Air France', airlineLogo: logo('af'), flightNumber: 'AF 24', origin: 'CDG', originCity: 'Paris', originAirportName: 'Charles de Gaulle Airport', destination: 'JFK', destinationCity: 'New York', destinationAirportName: 'John F. Kennedy Intl Airport', departureTime: '10:25 AM', arrivalTime: '12:15 PM', duration: '8h 50m', class: 'Economy' },
        ],
      },
    ],
  },
];

// ─── Airports ─────────────────────────────────────────────────────────────────

export const MOCK_AIRPORTS: (DestinationOption & { lat: number; lng: number })[] = [
  { id: 'airport-jfk', iata: 'JFK', city: 'New York', country: 'United States', label: 'John F. Kennedy Intl Airport', itemType: 'airport', shortName: 'New York', distance: '13 km from city center', geographicBreadcrumbs: [{ type: 'city', label: 'New York' }, { type: 'country', label: 'United States' }], lat: 40.6413, lng: -73.7781 },
  { id: 'airport-ewr', iata: 'EWR', city: 'Newark', country: 'United States', label: 'Newark Liberty Intl Airport', itemType: 'airport', shortName: 'Newark', distance: '9 km from city center', geographicBreadcrumbs: [{ type: 'city', label: 'Newark' }, { type: 'country', label: 'United States' }], lat: 40.6895, lng: -74.1745 },
  { id: 'airport-lga', iata: 'LGA', city: 'New York', country: 'United States', label: 'LaGuardia Airport', itemType: 'airport', shortName: 'New York', distance: '8 km from city center', geographicBreadcrumbs: [{ type: 'city', label: 'New York' }, { type: 'country', label: 'United States' }], lat: 40.7769, lng: -73.8740 },
  { id: 'airport-lhr', iata: 'LHR', city: 'London', country: 'United Kingdom', label: 'London Heathrow Airport', itemType: 'airport', shortName: 'London', geographicBreadcrumbs: [{ type: 'city', label: 'London' }, { type: 'country', label: 'United Kingdom' }], lat: 51.4700, lng: -0.4543 },
  { id: 'airport-lgw', iata: 'LGW', city: 'London', country: 'United Kingdom', label: 'London Gatwick Airport', itemType: 'airport', shortName: 'London', geographicBreadcrumbs: [{ type: 'city', label: 'London' }, { type: 'country', label: 'United Kingdom' }], lat: 51.1537, lng: -0.1821 },
  { id: 'airport-cdg', iata: 'CDG', city: 'Paris', country: 'France', label: 'Charles de Gaulle Airport', itemType: 'airport', lat: 49.0097, lng: 2.5479 },
  { id: 'airport-ams', iata: 'AMS', city: 'Amsterdam', country: 'Netherlands', label: 'Amsterdam Schiphol Airport', itemType: 'airport', lat: 52.3105, lng: 4.7683 },
  { id: 'airport-fra', iata: 'FRA', city: 'Frankfurt', country: 'Germany', label: 'Frankfurt Airport', itemType: 'airport', lat: 50.0379, lng: 8.5622 },
  { id: 'airport-zrh', iata: 'ZRH', city: 'Zurich', country: 'Switzerland', label: 'Zurich Airport', itemType: 'airport', lat: 47.4582, lng: 8.5555 },
  { id: 'airport-yyz', iata: 'YYZ', city: 'Toronto', country: 'Canada', label: 'Toronto Pearson Airport', itemType: 'airport', lat: 43.6777, lng: -79.6248 },
  { id: 'airport-lis', iata: 'LIS', city: 'Lisbon', country: 'Portugal', label: 'Lisbon Humberto Delgado Airport', itemType: 'airport', lat: 38.7742, lng: -9.1342 },
  { id: 'airport-bos', iata: 'BOS', city: 'Boston', country: 'United States', label: 'Logan International Airport', itemType: 'airport', lat: 42.3656, lng: -71.0096 },
  { id: 'airport-dub', iata: 'DUB', city: 'Dublin', country: 'Ireland', label: 'Dublin Airport', itemType: 'airport', lat: 53.4213, lng: -6.2700 },
  { id: 'airport-hel', iata: 'HEL', city: 'Helsinki', country: 'Finland', label: 'Helsinki-Vantaa Airport', itemType: 'airport', lat: 60.3172, lng: 24.9633 },
  { id: 'airport-mad', iata: 'MAD', city: 'Madrid', country: 'Spain', label: 'Adolfo Suárez Madrid-Barajas Airport', itemType: 'airport', lat: 40.4983, lng: -3.5676 },
  { id: 'airport-ist', iata: 'IST', city: 'Istanbul', country: 'Turkey', label: 'Istanbul Airport', itemType: 'airport', lat: 41.2608, lng: 28.7418 },
  { id: 'airport-kef', iata: 'KEF', city: 'Reykjavik', country: 'Iceland', label: 'Keflavik International Airport', itemType: 'airport', lat: 63.9850, lng: -22.6056 },
  { id: 'airport-ord', iata: 'ORD', city: 'Chicago', country: 'United States', label: "O'Hare International Airport", itemType: 'airport', lat: 41.9742, lng: -87.9073 },
];

// ─── Airlines ─────────────────────────────────────────────────────────────────

export const MOCK_AIRLINES = [
  { value: 'UA', label: 'United Airlines' },
  { value: 'BA', label: 'British Airways' },
  { value: 'LX', label: 'Swiss' },
  { value: 'AC', label: 'Air Canada' },
  { value: 'TP', label: 'TAP Air Portugal' },
  { value: 'DL', label: 'Delta' },
  { value: 'AF', label: 'Air France' },
  { value: 'KL', label: 'KLM' },
  { value: 'AA', label: 'American Airlines' },
  { value: 'LH', label: 'Lufthansa' },
  { value: 'VS', label: 'Virgin Atlantic' },
  { value: 'EI', label: 'Aer Lingus' },
  { value: 'AY', label: 'Finnair' },
  { value: 'IB', label: 'Iberia' },
  { value: 'TK', label: 'Turkish Airlines' },
  { value: 'N0', label: 'Norse Atlantic' },
  { value: 'FI', label: 'Icelandair' },
];

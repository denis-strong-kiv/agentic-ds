/**
 * Type-safe navigation components and hooks from next-intl.
 * Import Link, redirect, usePathname, useRouter from this file
 * instead of next/navigation to get locale-aware behaviour.
 */
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

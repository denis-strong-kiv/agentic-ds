/**
 * CVA (class-variance-authority) composition conventions for this design system.
 *
 * Pattern every component follows:
 *
 * ```ts
 * import { cva, type VariantProps } from 'class-variance-authority';
 * import { cn } from './cn';
 *
 * const componentVariants = cva(
 *   // base — always applied
 *   'inline-flex items-center font-medium transition-colors',
 *   {
 *     variants: {
 *       variant: {
 *         primary: 'bg-[--color-primary-default] text-[--color-primary-foreground]',
 *         secondary: 'bg-[--color-secondary-default] text-[--color-secondary-foreground]',
 *       },
 *       size: {
 *         sm: 'h-8 px-3 text-sm',
 *         md: 'h-10 px-4 text-base',
 *         lg: 'h-12 px-6 text-lg',
 *       },
 *     },
 *     defaultVariants: {
 *       variant: 'primary',
 *       size: 'md',
 *     },
 *   }
 * );
 *
 * interface ComponentProps
 *   extends React.HTMLAttributes<HTMLElement>,
 *     VariantProps<typeof componentVariants> {}
 *
 * export function Component({ variant, size, className, ...props }: ComponentProps) {
 *   return <div className={cn(componentVariants({ variant, size }), className)} {...props} />;
 * }
 * ```
 *
 * Rules:
 * - All color values MUST use CSS custom property references: `bg-[--color-primary-default]`
 * - Never hard-code hex, oklch, or Tailwind color utilities (e.g. `bg-blue-500`)
 * - Always export VariantProps for consumers to type their wrapper components
 * - Always pass `className` through `cn()` as the last argument for consumer overrides
 * - `data-state`, `data-disabled`, `aria-*` attributes come from Radix — use CSS selectors
 *   to style them: `data-[state=checked]:bg-[--color-primary-default]`
 */

export { cva, type VariantProps } from 'class-variance-authority';

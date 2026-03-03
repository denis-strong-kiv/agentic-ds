'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function HomePage() {
  const t = useTranslations('search');
  const tNav = useTranslations('nav');

  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background-default)] px-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-[var(--color-foreground-default)]">
          {t('title')}
        </h1>
        <nav className="mt-8 flex flex-wrap justify-center gap-4">
          {(['flights', 'hotels', 'cars', 'activities'] as const).map((key) => (
            <Link
              key={key}
              href={`/${key}`}
              className="rounded-[var(--shape-radius-button)] bg-[var(--color-primary-default)] px-6 py-3 text-sm font-medium text-[var(--color-primary-foreground)] transition hover:opacity-90"
            >
              {tNav(key)}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

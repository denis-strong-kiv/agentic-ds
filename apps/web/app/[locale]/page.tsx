'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function HomePage() {
  const t = useTranslations('search');
  const tNav = useTranslations('nav');

  return (
    <main id="main-content" className="web-locale-home">
      <div className="web-locale-home-container">
        <h1 className="web-locale-home-title">
          {t('title')}
        </h1>
        <nav className="web-locale-home-nav">
          {(['flights', 'hotels', 'cars', 'activities'] as const).map((key) => (
            <Link
              key={key}
              href={`/${key}`}
              className="web-locale-home-link"
            >
              {tNav(key)}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

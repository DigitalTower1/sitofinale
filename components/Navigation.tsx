'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { MagneticButton } from './MagneticButton';
import { useTheme } from '../hooks/useTheme';

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Servizi' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/about', label: 'Chi siamo' },
  { href: '/contact', label: 'Contatti' }
];

export function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const active = useMemo(() => links.find((link) => pathname === link.href)?.href, [pathname]);

  return (
    <header className={clsx('nav', { 'nav--open': menuOpen })}>
      <div className="nav__glass" aria-hidden />
      <div className="nav__content">
        <Link href="/" className="nav__logo" aria-label="Digital Tower home">
          <span className="nav__mark" />
          <span className="nav__wordmark">Digital Tower</span>
        </Link>
        <nav className="nav__links" aria-label="Principale">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={clsx('nav__link', { 'is-active': active === link.href })}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav__actions">
          <button className="nav__theme" onClick={toggleTheme} aria-label="Cambia tema">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <MagneticButton as="a" href="/contact" className="nav__cta" aria-label="Parliamo del tuo progetto">
            Avvia progetto
          </MagneticButton>
          <button
            className="nav__menu"
            aria-expanded={menuOpen}
            aria-controls="nav-drawer"
            aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <nav id="nav-drawer" className="nav__drawer" aria-label="Mobile" aria-hidden={!menuOpen}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="nav__drawer-link" onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

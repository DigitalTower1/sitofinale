'use client';

import Link from 'next/link';

const footerLinks = [
  {
    title: 'Servizi',
    items: [
      { label: 'Social Media Management', href: '/services#social-media' },
      { label: 'Web Design & Branding', href: '/services#web-design' },
      { label: 'Advertising', href: '/services#advertising' },
      { label: 'SEO', href: '/services#seo' }
    ]
  },
  {
    title: 'Agenzia',
    items: [
      { label: 'Chi siamo', href: '/about' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Processo', href: '/about#process' }
    ]
  }
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" aria-label="Piè di pagina">
      <div className="footer__grid">
        <div>
          <p className="footer__tagline">Scaliamo insieme la torre del successo.</p>
          <p className="footer__copy">
            Digital Tower orchestra strategie creative e performance marketing per brand che vogliono dominare il panorama
            digitale.
          </p>
        </div>
        {footerLinks.map((column) => (
          <div key={column.title}>
            <h3 className="footer__heading">{column.title}</h3>
            <ul>
              {column.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="footer__heading">Contatti</h3>
          <p>
            <a href="mailto:hello@digitaltower.agency">hello@digitaltower.agency</a>
          </p>
          <p>
            <a href="tel:+390200000000">+39 02 0000 0000</a>
          </p>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {year} Digital Tower. All rights reserved.</span>
        <div className="footer__social">
          <a href="https://www.instagram.com/digitaltower" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.linkedin.com/company/digitaltower" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

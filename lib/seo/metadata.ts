import type { Metadata } from 'next';

export const baseUrl = 'https://digitaltower.agency';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Digital Tower — Scaliamo insieme la torre del successo',
    template: '%s · Digital Tower'
  },
  description:
    'Digital Tower è l\'agenzia marketing full-stack che fonde design cinematografico, tecnologia WebGL e strategie data-driven per scalare il tuo brand.',
  applicationName: 'Digital Tower',
  keywords: ['marketing agency', 'digital marketing', 'WebGL', 'branding', 'Digital Tower'],
  authors: [{ name: 'Digital Tower' }],
  creator: 'Digital Tower',
  publisher: 'Digital Tower',
  openGraph: {
    title: 'Digital Tower — Scaliamo insieme la torre del successo',
    description:
      'Esperienze digitali cinematografiche per brand audaci. Social media, web design, advertising e SEO orchestrati con tecnologia WebGL.',
    url: baseUrl,
    siteName: 'Digital Tower',
    images: [{ url: '/og/cover.svg', width: 1200, height: 630, alt: 'Digital Tower hero' }],
    locale: 'it_IT',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@digitaltower',
    site: '@digitaltower',
    title: 'Digital Tower — Scaliamo insieme la torre del successo',
    description:
      'Esperienze digitali cinematografiche per brand audaci. Social media, web design, advertising e SEO orchestrati con tecnologia WebGL.',
    images: ['/og/cover.svg']
  },
  alternates: {
    canonical: baseUrl
  },
  category: 'marketing',
  robots: {
    index: true,
    follow: true
  }
};

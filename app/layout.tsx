import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Playfair_Display, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/Providers';
import { ThemeScript } from '../components/ThemeScript';
import { defaultMetadata } from '../lib/seo/metadata';
import { organizationSchema, serviceSchema, kpiDatasetSchema } from '../lib/seo/schema';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { CursorAura } from '../components/CursorAura';
import { MotionReduceBoundary } from '../components/MotionReduceBoundary';
import { MarbleBackground } from '../components/MarbleBackground';
import { ScrollProgressBar } from '../components/ScrollProgressBar';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-display-active'
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-sans-active'
});

export const metadata: Metadata = {
  ...defaultMetadata,
  other: {
    schemaOrganization: JSON.stringify(organizationSchema),
    schemaService: JSON.stringify(serviceSchema),
    schemaDataset: JSON.stringify(kpiDatasetSchema)
  }
};

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="it"
      data-theme="dark"
      className={`${playfair.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body data-theme="dark" suppressHydrationWarning>
        <ThemeScript />
        <MarbleBackground />
        <Providers>
          <a href="#main" className="skip-link">
            Salta al contenuto principale
          </a>
          <MotionReduceBoundary>
            <ScrollProgressBar />
            <Navigation />
            <main id="main" aria-label="Contenuto principale">
              {children}
            </main>
            <Footer />
            <CursorAura />
          </MotionReduceBoundary>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(kpiDatasetSchema) }} />
      </body>
    </html>
  );
}

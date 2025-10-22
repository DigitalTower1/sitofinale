import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Playfair_Display, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/Providers';
import { defaultMetadata } from '../lib/seo/metadata';
import { organizationSchema, serviceSchema } from '../lib/seo/schema';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { CursorAura } from '../components/CursorAura';
import { MotionReduceBoundary } from '../components/MotionReduceBoundary';

const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap', variable: '--font-display-active' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-sans-active' });

export const metadata: Metadata = {
  ...defaultMetadata,
  other: {
    schemaOrganization: JSON.stringify(organizationSchema),
    schemaService: JSON.stringify(serviceSchema)
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
    <html lang="it" className={`${playfair.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          <a href="#main" className="skip-link">
            Salta al contenuto principale
          </a>
          <MotionReduceBoundary>
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
      </body>
    </html>
  );
}

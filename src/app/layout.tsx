import './globals.css';
import type { Metadata, Viewport } from 'next';
import LenisProvider from './components/LenisProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Sito Finale — Visione Immersiva',
    template: '%s · Sito Finale'
  },
  description:
    'Esperienza portfolio immersiva con torre 3D interattiva, transizioni cinematografiche e performance ottimizzate.',
  keywords: [
    'React 19',
    'Next.js 15',
    'Three.js',
    'Portfolio',
    'Case Study'
  ],
  authors: [{ name: 'Team Visionario' }],
  openGraph: {
    type: 'website',
    url: 'https://example.com',
    title: 'Sito Finale — Visione Immersiva',
    description:
      'Esplora la torre interattiva con luci teal & orange, carosello 3D e casi studio cinematografici.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Sito Finale OG' }]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f141a'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="bg-black">
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}

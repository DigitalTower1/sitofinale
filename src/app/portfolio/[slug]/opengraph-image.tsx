import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630
};

export const contentType = 'image/png';

const CASES: Record<string, { title: string; tagline: string }> = {
  'neon-skyscraper': {
    title: 'Neon Skyscraper',
    tagline: 'Luci teal/orange, torre progressiva, esperienza immersiva.'
  },
  'aurora-gateway': {
    title: 'Aurora Gateway',
    tagline: 'Portale volumetrico con flare cinematici.'
  },
  'cobalt-horizon': {
    title: 'Cobalt Horizon',
    tagline: 'Dashboard filmica con carosello 3D.'
  }
};

export default function OgImage({ params }: { params: { slug: string } }) {
  const fallback = { title: 'Case study', tagline: 'Esperienze immersive tailor-made.' };
  const data = CASES[params.slug] ?? fallback;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 30% 30%, #ff6b35 0%, #06090f 40%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '120px',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <p style={{ letterSpacing: '0.45em', textTransform: 'uppercase', fontSize: 20, opacity: 0.7 }}>Case study</p>
        <h1 style={{ fontSize: 72, fontWeight: 700, margin: '20px 0' }}>{data.title}</h1>
        <p style={{ fontSize: 28, maxWidth: 640, lineHeight: 1.4 }}>{data.tagline}</p>
      </div>
    ),
    { ...size }
  );
}

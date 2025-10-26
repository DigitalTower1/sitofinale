import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630
};

export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '120px',
          background: 'radial-gradient(circle at 20% 20%, #ff6b35 0%, #06090f 42%, #020307 100%)',
          color: '#f8fafc',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <span
          style={{
            fontSize: 22,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            opacity: 0.7
          }}
        >
          Sito Finale
        </span>
        <h1
          style={{
            fontSize: 78,
            fontWeight: 700,
            lineHeight: 1.05,
            margin: '30px 0 16px'
          }}
        >
          Visione immersiva in 3D
        </h1>
        <p style={{ fontSize: 30, maxWidth: 680, lineHeight: 1.4, color: '#e2e8f0' }}>
          Torre reattiva, carosello 3D e post-processing cinematografico su Next.js 15 static export.
        </p>
      </div>
    ),
    { ...size }
  );
}

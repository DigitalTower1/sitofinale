import type { Metadata } from 'next';
import Link from 'next/link';

const CASE_STUDIES = [
  {
    slug: 'neon-skyscraper',
    title: 'Neon Skyscraper',
    tagline: 'Brandscape verticale con luce progressiva sincronizzata alla torre hero.',
    content:
      'Approccio modulare con sezioni animate tramite ScrollTrigger e sincronizzazione Lenis per un flusso continuo.',
    year: '2024'
  },
  {
    slug: 'aurora-gateway',
    title: 'Aurora Gateway',
    tagline: 'Esperienza portale con luce volumetrica teal/orange e atmosfera cinematic.',
    content:
      'Mix di post-processing filmico, transizioni gsap e fallback WebGL ottimizzati per dispositivi a bassa potenza.',
    year: '2023'
  },
  {
    slug: 'cobalt-horizon',
    title: 'Cobalt Horizon',
    tagline: 'Dashboard immersiva con carosello 3D e path camera verticale.',
    content:
      'Integrazione fra UI reattiva, torre 3D e micro-dolly CTA per massimizzare l’ingaggio.',
    year: '2023'
  }
];

type Params = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return CASE_STUDIES.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const study = CASE_STUDIES.find((item) => item.slug === params.slug);
  if (!study) {
    return {
      title: 'Case study'
    };
  }
  return {
    title: `${study.title} · Case study`,
    description: study.tagline,
    openGraph: {
      title: `${study.title} · Case study`,
      description: study.content,
      images: [{ url: `/portfolio/${study.slug}/opengraph-image`, width: 1200, height: 630 }]
    }
  };
}

export default function CaseStudyPage({ params }: Params) {
  const study = CASE_STUDIES.find((item) => item.slug === params.slug);

  if (!study) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-6 text-center text-white">
        <h1 className="text-5xl font-semibold">Caso non trovato</h1>
        <p className="text-lg text-slate-300">Il case study richiesto non esiste. Torna alla panoramica.</p>
        <Link href="/" className="rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.3em]">
          Torna alla home
        </Link>
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-16 px-6 pb-24 pt-32 text-white">
      <header className="space-y-4">
        <Link href="/" className="text-xs uppercase tracking-[0.35em] text-orange-200/80">
          ← Portfolio
        </Link>
        <h1 className="text-5xl font-semibold md:text-6xl">{study.title}</h1>
        <p className="text-lg text-slate-200/90">{study.tagline}</p>
      </header>
      <section className="grid gap-12 md:grid-cols-[2fr_1fr]">
        <article className="space-y-6 text-base leading-relaxed text-slate-200">
          <p>{study.content}</p>
          <p>
            Ogni sezione è esportata staticamente con Next.js 15 (output export) garantendo SEO ottimale e caricamento immediato.
          </p>
          <p>
            Il fallback riduce post-processing mantenendo texture ottimizzate, luci calibrate e transizioni leggere.
          </p>
        </article>
        <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Anno</span>
            <p className="text-xl text-white">{study.year}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Servizi</span>
            <ul className="space-y-1 text-sm text-slate-200">
              <li>Design experience</li>
              <li>3D &amp; motion</li>
              <li>Performance audit</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}

import { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';

export const metadata: Metadata = {
  title: 'Chi siamo',
  description: 'Creative technologists e strategist uniti per scalare brand attraverso esperienze digitali cinematografiche.'
};

const pillars = [
  {
    title: 'Creative Direction',
    description: 'Direzione artistica, design language e narrazione multisensoriale per brand memorabili.'
  },
  {
    title: 'Technology',
    description: 'Stack moderno: Next.js, WebGL/WebGPU, pipeline 3D ottimizzate, automazioni data-driven.'
  },
  {
    title: 'Performance',
    description: 'Growth framework integrato con analisi predittive, misurazione avanzata e iterazione continua.'
  }
];

export default function AboutPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="About"
        title="Siamo Digital Tower"
        description="15+ anni tra brand luxury, tech e hospitality. Un collettivo di creative director, strategist e developer che unisce bellezza e performance."
      />
      <section className="page__grid">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="page-card">
            <h2>{pillar.title}</h2>
            <p>{pillar.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

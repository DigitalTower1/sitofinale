import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { caseStudies } from '../../../../content/case-studies';

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

interface CaseStudyPageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const study = caseStudies.find((item) => item.slug === params.slug);
  if (!study) return {};
  return {
    title: `${study.title} · Case Study`,
    description: study.summary
  };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const study = caseStudies.find((item) => item.slug === params.slug);
  if (!study) return notFound();

  return (
    <article className="page">
      <header className="page-header">
        <p className="page-header__eyebrow">Case Study</p>
        <h1>{study.title}</h1>
        <p>{study.summary}</p>
      </header>
      <div className="page__grid">
        <section className="page-card">
          <h2>La sfida</h2>
          <p>{study.challenge}</p>
        </section>
        <section className="page-card">
          <h2>La soluzione</h2>
          <p>{study.solution}</p>
        </section>
        <section className="page-card">
          <h2>Risultati</h2>
          <ul>
            {study.outcome.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

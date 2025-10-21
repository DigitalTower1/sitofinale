import { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '../../../components/PageHeader';
import { caseStudies } from '../../../content/case-studies';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Progetti selezionati di Digital Tower tra luxury, mobility, hospitality e tech.'
};

export default function CaseStudiesPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="Case Studies"
        title="Storie di brand che hanno scalato"
        description="Una selezione di lanci, riposizionamenti e campagne integrate che hanno ridefinito le aspettative dei clienti."
      />
      <div className="page__grid">
        {caseStudies.map((study) => (
          <Link key={study.slug} href={`/case-studies/${study.slug}`} className="page-card">
            <h2>{study.title}</h2>
            <p>{study.summary}</p>
            <ul>
              {study.outcome.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </div>
  );
}

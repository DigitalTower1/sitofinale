import { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { services } from '../../../content/services';
import { MagneticButton } from '../../../components/MagneticButton';

export const metadata: Metadata = {
  title: 'Servizi Signature',
  description:
    'Social media management, web design & branding, advertising e SEO integrati per scalare il tuo brand con precisione.'
};

export default function ServicesPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="Servizi"
        title="Soluzioni full-stack per brand che vogliono ascendere"
        description="Costruiamo ecosistemi end-to-end: strategia, design, media e tecnologia fusi in un unico flusso ad alte prestazioni."
      />
      <div className="page__grid">
        {services.map((service) => (
          <article key={service.id} className="page-card" id={service.id}>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <ul>
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <MagneticButton as="a" href={`/contact?topic=${service.id}`} variant="primary">
              Pianifica una call
            </MagneticButton>
          </article>
        ))}
      </div>
    </div>
  );
}

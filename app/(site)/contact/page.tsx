import { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { ContactForm } from '../../../components/ContactForm';

export const metadata: Metadata = {
  title: 'Contatti',
  description: 'Prenota una discovery call con Digital Tower e scopri come scalare il tuo brand con esperienze cinematografiche.'
};

export default function ContactPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="Contatti"
        title="Raccontaci la tua prossima vetta"
        description="Compila il form per ricevere entro 24h una proposta su misura. Preferisci una call? Scrivici a hello@digitaltower.agency."
      />
      <ContactForm />
    </div>
  );
}

'use client';

import { MagneticButton } from '../MagneticButton';

export function CtaSection() {
  return (
    <section className="section cta" aria-labelledby="cta-heading">
      <div className="cta__content">
        <h2 id="cta-heading">Prenota la call strategica e proiettiamoci verso le 7 figures.</h2>
        <p>
          Allineiamo visione, dati e craft cinematografico per trasformare la tua idea nel prossimo brand iconico. Dal primo
          moodboard al monitoraggio continuo dei KPI condivisi.
        </p>
        <div className="cta__actions">
          <MagneticButton as="a" href="/contact" variant="primary">
            Prenota la strategic call
          </MagneticButton>
          <MagneticButton as="a" href="mailto:hello@digitaltower.agency" variant="ghost">
            Scrivici ora
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

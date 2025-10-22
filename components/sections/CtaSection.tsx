'use client';

import { MagneticButton } from '../MagneticButton';

export function CtaSection() {
  return (
    <section className="section cta" aria-labelledby="cta-heading">
      <div className="cta__content">
        <h2 id="cta-heading">Scaliamo la tua prossima vetta.</h2>
        <p>
          Un team full-stack di strategist, designer e creative engineer al tuo fianco. Dal primo moodboard al monitoraggio
          continuo dei KPI.
        </p>
        <div className="cta__actions">
          <MagneticButton as="a" href="/contact" variant="primary">
            Pianifica una sessione
          </MagneticButton>
          <MagneticButton as="a" href="mailto:hello@digitaltower.agency" variant="ghost">
            Scrivici ora
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

import { HeroSection } from '../../components/sections/HeroSection';
import { SocialProofSection } from '../../components/sections/SocialProofSection';
import { CaseStudiesSection } from '../../components/sections/CaseStudiesSection';
import { KpiSection } from '../../components/sections/KpiSection';
import { ServicesSection } from '../../components/sections/ServicesSection';
import { ProcessSection } from '../../components/sections/ProcessSection';
import { CtaSection } from '../../components/sections/CtaSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofSection />
      <CaseStudiesSection />
      <KpiSection />
      <ServicesSection />
      <ProcessSection />
      <CtaSection />
    </>
  );
}

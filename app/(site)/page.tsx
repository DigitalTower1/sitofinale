import { HeroSection } from '../../components/sections/HeroSection';
import { ServicesSection } from '../../components/sections/ServicesSection';
import { CaseStudiesSection } from '../../components/sections/CaseStudiesSection';
import { ProcessSection } from '../../components/sections/ProcessSection';
import { CtaSection } from '../../components/sections/CtaSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <CaseStudiesSection />
      <ProcessSection />
      <CtaSection />
    </>
  );
}

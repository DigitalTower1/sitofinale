import { HeroSection } from '../../components/sections/HeroSection';
import { AboutSection } from '../../components/sections/AboutSection';
import { ServicesSection } from '../../components/sections/ServicesSection';
import { CaseStudiesSection } from '../../components/sections/CaseStudiesSection';
import { KpiSection } from '../../components/sections/KpiSection';
import { BlogSection } from '../../components/sections/BlogSection';
import { ProcessSection } from '../../components/sections/ProcessSection';
import { SocialProofSection } from '../../components/sections/SocialProofSection';
import { CtaSection } from '../../components/sections/CtaSection';
import { CinematicScrollController } from '../../components/storytelling/CinematicScrollController';
import { ScrollProgress } from '../../components/storytelling/ScrollProgress';

export default function HomePage() {
  return (
    <>
      <CinematicScrollController />
      <ScrollProgress />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <CaseStudiesSection />
      <KpiSection />
      <BlogSection />
      <ProcessSection />
      <SocialProofSection />
      <CtaSection />
    </>
  );
}

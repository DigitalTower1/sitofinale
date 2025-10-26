import HeroScene from './components/HeroScene';
import ExperienceCarousel from './components/ExperienceCarousel';
import TowerPhases from './components/TowerPhases';
import PerformanceOverlay from './components/PerformanceOverlay';

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <HeroScene />
      <PerformanceOverlay />
      <section className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[200vh] bg-gradient-to-b from-transparent via-black/40 to-black" />
      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-32 px-6 pb-32 pt-[60vh]">
        <TowerPhases />
        <article className="space-y-6 text-balance text-lg text-slate-200">
          <h2 className="text-4xl font-semibold text-white">Visione coordinata</h2>
          <p>
            L&apos;intera esperienza ruota attorno alla torre, fulcro del brand. Ogni sezione scatenata da <code
              className="rounded bg-white/10 px-2 py-1 font-mono text-sm text-orange-200"
            >
              tower-phase
            </code>{' '}
            sincronizza micro-dolly della camera, parallasse UI e variazioni atmosferiche.
          </p>
          <p>
            Il controllo preferenze di movimento riduce post-processing e animazioni mantenendo accessibile la narrativa.
          </p>
        </article>
        <ExperienceCarousel />
      </section>
    </main>
  );
}

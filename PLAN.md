# Digital Tower — Piano Esecutivo

## Audit stack & gap analysis
- **Stack attuale**: repository vuoto (solo README). Nessun framework/configurazione presente → libertà totale nella scelta tech stack.
- **Obiettivi**: Next.js 14 (App Router) con React 18, TypeScript, React Three Fiber + Drei, GSAP per motion, Tailored CSS (CSS Modules + tokens globali), Zustand per stato leggero delle feature flags.
- **Routing & code-splitting**: App Router con segmenti server-side (landing, servizi, case-study, contatti). Client components isolati per 3D hero, cursor, audio toggle, form.
- **Immagini & media**: Uso di Next Image con AVIF/WEBP, generazione LQIP via blurDataURL statico. 3D hero WebGL.
- **CSS**: architettura utility-light con tokens.css globale, component-scoped styles via CSS Modules. prefers-reduced-motion e theming dark/light.
- **JS bundle**: inizializzare con edge runtime + streaming SSR, code-splitting per 3D pipeline tramite dynamic import condizionato (feature flag + viewport intersection).

## Executive Plan
1. **Fundamentals & infra**
   - Configurare Next.js 14 + TypeScript + ESLint/Prettier.
   - Setup Edge runtime, RSC, sitemap/robots, metadata generica.
2. **Design system**
   - Definire tokens.css (colori, typo, spazi), motion.json (tempi/easing), tipografia fluid clamp.
   - Implementare `DesignTokensProvider` per esporre preferenze (light/dark) e `useMotionPreferences`.
   - Curare palette, tipografia e micro-texture ispirandosi a Immersive Garden per mantenere un linguaggio luxury minimal coerente.
3. **3D pipeline**
   - Cartella `3d/`: scene, loaders (KTX2/DRACO), assets manifest, feature flags.
   - React Three Fiber scene modulare con SSR fallback (hero poster + transition).
   - Direzione creativa asset: 20% fotografia art-directed, 40% elementi PBR metal/glass, 40% grafica procedurale sincronizzata al motion.
4. **UI & storytelling**
   - Pagine: `/` (landing), `/services`, `/case-studies/[slug]`, `/about`, `/contact`.
   - Sections modulare (Hero, Social Proof, Case Deep Dive, KPI Dashboard, Services, Process, CTA) con motion primitives.
   - Social proof con badge partner (Shopify, Meta, TikTok, Google) e testimonianze di crescita.
   - Sequenza narrativa motivazionale: social proof → case ispirazionale → proof KPI → servizi → CTA "Book strategic call".
5. **Motion system & transitions**
   - GSAP timelines + ScrollTrigger, page transition overlay, cursor aura, magnetic buttons, parallax.
   - prefers-reduced-motion gating.
   - Arco emozionale "Ascend": progressione 0→40% scroll con flare/bloom graduale, capitoli case che passano da Inspire → Ignite → Impact.
6. **Accessibility & performance**
   - Focus states, skip link, semantic landmarks, axe config.
   - PerformanceObserver + Web Vitals logging, feature flags degrade gracefully.
   - Bilanciare effetti (volumetric, SSR) con i budget per mantenere LCP ≤ 2s e INP ≤ 150ms anche durante animazioni complesse.
7. **SEO & analytics**
   - Metadata, OG/Twitter, schema.org Organization + Service.
   - Event tracking + consent-friendly analytics loader.
   - KPI dashboard marcato con schema `Dataset` per valorizzare i dati nel SERP.
8. **Testing & QA**
   - Playwright E2E, visual snapshots (Percy stub), Lighthouse config & targets, vitals check script.

## Mappa transizioni & motion primitives
- **Route transitions**
  - Landing → Services/About/Contact: overlay morph (SVG) in/out + content fade-up (200ms stagger).
  - Services ↔ Case detail: FLIP per cards, background gradient morph, camera parallax on hero.
  - KPI dashboard entry: depth-of-field ramp + counters animati (SummitCounter) per enfatizzare la scalata.
  - Global exit: blur + vignette deepen + color grade shift 0.2s.
- **Primitives**
  - `LuxFade`: opacity + slight y translation (12px) with ease-out-lux.
  - `PerspectiveReveal`: clip-path inset + perspective/rotationX 6°.
  - `SilkParallax`: translateZ-based layered parallax bound ±24px desktop.
  - `MagneticHover`: lerp position + scale 1.04, highlight sheen.
  - `CursorAura`: canvas-based light cone with blend-mode screen.
  - `FLIPMorph`: `gsap.context`-driven state-based morph for cards → modal.
  - `SummitCounter`: timeline su oggetti numerici con snap progressivo per KPI motivazionali.

## Art direction 3D
- **Asset**: Torre astratta composta da cilindri metallici champagne con inserti glass fumé, orbita particellare instanced (≤80k). Base piano lucido con SSR.
- **HDRI**: Studio softbox warm (e.g. “SmallHangarSoft”). Intensity 0.9.
- **Materiali**: PBR con clearcoat, anisotropic brushed metal, tinted glass (IOR 1.52, absorption smoky).
- **Camera**: 35mm equival., dolly leggero su hero (GSAP timeline).
- **PostFX**: ACES tone mapping, bloom morbido (threshold 0.65, strength 0.35), vignette, LUT oro.
- **Mix asset**: 20% fotografia curata (ritratti team/ambienti), 40% elementi PBR hero, 40% pattern e particelle procedurali con color grading coordinato.
- **Fallback**: poster high-res + subtle noise overlay; su prefers-reduced-motion disabilita particelle & dolly.

## Design & motion tokens (overview)
- **Palette**: Lux Black (#050505), Obsidian (#0F0F11), Smoked Glass (#1B1E24 / alpha), Champagne Gold (#DCC28A), Porcelain (#F5F1E8), Accento (#E8B86B), Error (#FF6F5B), Success (#4ED0A8).
- **Typo**: Display serif “Playfair Display” (fallback Marcellus), grotesk “Space Grotesk”. Fluid clamp 32→88 hero.
- **Spacing**: scale 4 → 128 px (4×).
- **Motion timing**: fast 160ms, base 280ms, slow 520ms, hero cinematic 2200ms dolly.
- **Easing**: cubic-bezier(.16,.84,.44,1), (.33,.01,.15,1), (.17,.67,.45,.98).
- **Depth**: cursor 9999, overlays 9000, 3D canvas 100, nav 200, content 0.

## Rifacimento IA (keep vs rewrite)
- **Tenere**: repository baseline (git history). Nessuna struttura da conservare.
- **Riscrivere/creare**:
  - Nuovo progetto Next.js con config personalizzata.
  - Tutto il design system, componenti UI, pipeline 3D, motion.
  - Documentazione (PLAN, MOTION_BIBLE, checklist, fallback plan, etc.).

## Tabella rischi & impatti
| Rischio | Impatto | Probabilità | Mitigazione |
| --- | --- | --- | --- |
| Bundle JS oltre 180 kB | Alto | Medio | Route-level code-splitting, dynamic imports, ridurre dipendenze (GSAP core + plugins tree-shaken). |
| FPS hero < target su mobile | Alto | Medio | Feature flags per particelle/SSR, ottimizzare geometrie (instancing, LOD). |
| Bloom/SSR causa ghosting | Medio | Bassa | Parametri calibrati + toggle fallback, QA su vari device. |
| Accessibilità compromessa da motion | Alto | Medio | prefers-reduced-motion, focus states, test con axe/keyboard. |
| LCP > 2s per carico 3D | Alto | Medio | Splash poster + lazy load 3D, streaming SSR, preloading font/hero assets. |
| Timeline GSAP confligge con RSC | Medio | Bassa | Confinare GSAP a client components con `useIsomorphicLayoutEffect`. |
| Gestione asset KTX2/DRACO complessa | Medio | Medio | Script `preload-assets.mjs`, documentazione pipeline. |

## Gantt sintetico (milestones)
- **M1 — Setup & Infra (Giorni 1-2)**: bootstrap Next, config lint/test, tokens base.
- **M2 — Design System & Tokens (Giorni 2-3)**: tokens.css, motion.json, tipografia, layout grid.
- **M3 — 3D Hero & Motion Core (Giorni 3-5)**: scena R3F, postFX, GSAP primitives, fallback logic.
- **M4 — Contenuti & Routing (Giorni 5-7)**: pagine, sezioni, copy, SEO metadata.
- **M5 — QA & Performance (Giorni 7-8)**: Lighthouse, Web Vitals logging, Playwright, assets pipeline.
- **M6 — Polish & Delivery (Giorni 8-9)**: micro-interazioni, ambient audio, documentation finale.

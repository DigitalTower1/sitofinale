# Digital Tower — Motion Bible

## Motion Tokens
- **Timing** (ms): instant 120, fast 160, base 300, slow 600, cinematic 2200.
- **Easing**: `--ease-out-lux (0.16,0.84,0.44,1)`, `--ease-in-lux (0.33,0.01,0.15,1)`, `--ease-in-out-lux (0.17,0.67,0.45,0.98)`, `--ease-silk (0.19,0.92,0.36,1.01)`.
- **Depth layers**: cursor 9999, overlay 9000, menu 8000, modal 7000, canvas 100, nav 200, content 0.

## Primitives
| Nome | Descrizione | Utilizzo |
| --- | --- | --- |
| LuxFade | Fade + translateY 12px, ease-out-lux | Cards servizi, CTA |
| PerspectiveReveal | Clip-path + rotateX 6° + blur ridotto | Titoli sezione, page header |
| SilkParallax | Lerp parallax ±24px con inertia | Hero background, cursor |
| MagneticHover | Lerp su pointer per CTA | MagneticButton |
| CursorAura | Spotlight reattivo, blend screen | Cursor aura global |
| FLIPMorph | FLIP GSAP per card → dettaglio | Case studies routing |

## Route transitions
- **Home → Services/About/Contact**: overlay morph scura (SVG) + fade content (`LuxFade`), durata 420ms.
- **Services → Case detail**: FLIP delle card, background gradient morph, camera parallax.
- **Global exit**: overlay smoked glass + intensità vignette 0.3→0.6.

## Scroll & Interaction
- Hero pinned (ScrollTrigger) con parallax dolce. preferenza ridotta → no pin.
- Services cards rivelate con stagger 80ms, offset 40px.
- Process timeline: progress line `scaleY` legata allo scroll.
- Cursor aura segue pointer con spring (stiffness 180/damping 24).

## Performance guardrails
- Animazioni sempre `will-change: transform/opacity` limitate.
- ScrollTrigger disattivato su `prefers-reduced-motion`.
- GSAP timeline isolate via `gsap.context` per cleanup.

## Accessibility
- Focus states non mascherati, transitions disabilitate con `.reduced-motion`.
- Magnetic hover fallback su keyboard (no translate).

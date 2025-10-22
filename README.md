# Digital Tower

Sito cinematografico per l'agenzia marketing Digital Tower. Stack Next.js 14 + React Three Fiber + GSAP con focus su performance enterprise e motion system coerente.

## Scripts
- `npm run dev` — avvia ambiente di sviluppo.
- `npm run build` — build di produzione.
- `npm run start` — avvia server di produzione.
- `npm run lint` — ESLint.
- `npm run test:e2e` — Playwright smoke tests.
- `npm run check:vitals` — verifica bundle budgets.
- `npm run preload:assets` — aggiorna manifest asset 3D.

## Struttura
- `app/` — App Router Next.js con pagine server/client.
- `components/` — UI, sezioni e motion primitives.
- `3d/` — Scene React Three Fiber e shaders custom.
- `styles/` — tokens e stylesheet globali.
- `content/` — dati strutturati per servizi e case studies.
- `docs/` — fallback plan, checklist e motion bible.

## QA
- Playwright per flussi principali.
- Lighthouse target mobile in `LIGHTHOUSE.config.cjs`.
- Web Vitals logging via `/api/analytics`.

# Digital Tower — Fallback Plan

## Feature flags
- `ENABLE_3D`: disattiva completamente la scena WebGL, sostituendola con poster statico.
- `ENABLE_BLOOM`: spegne il pass Bloom per device low-end o preferenze di performance.

## prefers-reduced-motion
- Rimuove parallax, ScrollTrigger pinning e timeline di ingresso.
- Sostituisce Cursor Aura con nulla e forza stato statico per CTA magnetiche.

## Low-power/mobile detection
- Canvas `dpr` clampato a `[1, 1.2]` via `performance` prop di R3F.
- Particelle disabilitate sotto 30 FPS misurati con PerformanceObserver.

## Offline / no WebGL
- Canvas racchiuso da `<Hero3D>` con fallback poster.
- Banner informativo opzionale se `!gl.getContextAttributes()`.

## Error handling
- API `/api/contact` e `/api/analytics` restituendo sempre 200 per evitare blocchi lato utente.
- Logging lato server e degradazione UI (messaggi success fallback).

## Progressive enhancement
- Layout, contenuti e CTA sempre renderizzati SSR.
- 3D, Cursor, Audio caricati via dynamic import dopo `IntersectionObserver`.

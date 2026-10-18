# Telegram Mini App versiyasi

**Asl AGROHUB Atelier v5 dizayni o‘zgartirilmagan.** Telegram integratsiyasi bo‘yicha o‘zbekcha yo‘riqnoma: [TELEGRAM_SETUP_UZ.md](TELEGRAM_SETUP_UZ.md). Bot menyu sozlash: `bot/configure-menu.mjs`. Mini App JS bridge: `src/telegram.ts`. Telegram autentifikatsiyasini tekshirish: `api/telegram-verify.mjs`.

# AGROHUB — Atelier v5

A calm, image-led agricultural platform concept redesigned with Uzbek-first localization and scroll-driven visual storytelling.

## Preview immediately

- Double-click **`AGROHUB_Interactive_Demo.html`** to view the interactive one-file demonstration (images embedded; no external photo service needed).
- Or launch a local preview with live form storage:

```bash
node server.mjs
```

Open `http://127.0.0.1:4173`. This serves the `offline/` site with all scripts, styles, and images locally, and stores valid enquiries in `data/leads.jsonl`. This file is created at runtime and is NOT included in the ZIP.

## React + TypeScript development

```bash
npm install
npm run dev
npm run build
```

The source is in `src/`, with design tokens and responsive styling in `src/styles.css`. Images are locally stored in `public/images/`, and the Vite production bundle goes to `dist/`.

## Project structure

| Directory/file | Purpose |
| --- | --- |
| `src/App.tsx` | React application, UI interaction and scroll-pinned story |
| `src/copy.ts` | All Uzbek, Russian and English UI copy |
| `src/styles.css` | Design system, typography, shapes and responsive styles |
| `public/images/*.webp` | Optimized, bundled agricultural concept photography |
| `public/favicon.svg` | App mark |
| `offline/` | Precompiled, ready-to-run static version |
| `AGROHUB_Interactive_Demo.html` | Single-file offline interactive preview |
| `api/` | Form validation and Vercel-compatible endpoint |
| `server.mjs` | Local server including JSONL enquiry storage |
| `supabase.sql` | Example database schema for hosted enquiries |
| `vercel.json` | Vite deployment configuration |

## How the scroll effect works

The “Journey” section has a tall `.journey-track` containing a `.journey-sticky` viewport. Scrolling updates the current stage and CSS variable `--scene-progress` using `requestAnimationFrame`. Photography cross-fades, stage text transitions, and translucent glass shapes drift subtly in the same pinned viewport. Standard native scrolling remains intact; there is no scroll hijacking.

For reduced-motion users, animations are suppressed via `prefers-reduced-motion`. The layout adapts to desktop, tablet and mobile.

## Languages

- **UZ** — default (Uzbek, Latin script)
- **RU** — Russian
- **EN** — English

Language changes cover navigation, CTA labels, sections, listings, forms, statuses and FAQs. Selection is saved in local storage. The document `lang`, title, and SEO description are updated accordingly.

## Functionality and demo limitations

- Functional on-page navigation, responsive menu, localized 6-item demo catalog with category/region/search filters, 3% commission calculator, FAQ, and contact form.
- **All catalog listings are examples.** They are not real-time inventory, live bookings, offers, or verified partners.
- Public deployment supports the lead endpoint only **after** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are securely configured in the hosting environment; create the table using `supabase.sql` first. Never put service-role secrets in the frontend.
- The standalone file is a self-contained **demo** and does not persist form submissions. Run `node server.mjs` for local persistence.
- The pictures are concept artwork for the design. They are not photographs of verified AGROHUB partners or premises.

## Checks and testing

```bash
node --test tests/*.test.mjs
node tools/build-offline.cjs
node tools/build-demo.cjs
```

Validation and HTTP API smoke tests were run in the development environment. Browser automation was restricted by its navigation policy at the final iteration; desktop/mobile reference images are provided under `previews/` but do not replace validation on an actual device before launch.

## Accessibility

Semantic sections, visible keyboard focus, readable text contrast, reduced-motion fallback, real buttons, accessible form labels and language selection are included. A final manual keyboard/screen-reader and device pass is recommended before a public launch.

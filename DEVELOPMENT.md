# Development and acceptance status

Updated 2026-11-26. Work continues; this is not a claim that every requested acceptance item is complete.

## Implemented in the current source

- [x] React, TypeScript, Vite, responsive styling, hash routes that survive reload, GitHub Pages base-relative assets, manifest, service worker, and vector logo.
- [x] Local guest onboarding with household size, country, currency, units, budget, dietary preferences, allergies, exclusions, reminder preference, and motivation. Optional fields can be skipped.
- [x] IndexedDB guest data with inventory entry/editing, quantity changes, history, locations, category, brand/barcode fields, entered dates, first/last timestamps, confidence field, status, and local export/delete.
- [x] Normalized duplicate suggestions, including previously unobserved items; separate packages remain separate records. Items can be marked unobserved only through an explicit review action and are not changed to consumed/discarded by missing-photo inference.
- [x] Multi-photo shelf review. TensorFlow.js COCO-SSD can optionally detect general COCO objects on-device. The supported food classes are limited; results have model confidence and require user review. It does not identify most groceries, brands, dates, or quantities and can miss or mislabel items.
- [x] Financial priority score with entered-date, age, quantity, value, and uncertainty factors; age classification; current inventory value; entered-date value at risk; explicit discard records; explicitly recorded rescue estimates. Scores are not freshness or safety predictions.
- [x] Rescue Center, editable item details, archaeology event timeline filters, refrigerator/freezer/pantry views, shopping list, five original recipe ideas, meal planner, favorites field in schema, challenges/achievements, local weekly reports, CSV/JSON export, and configurable local notification preference.
- [x] ZXing camera barcode scanner with manual entry and Open Food Facts lookup. Tesseract.js receipt OCR runs in the browser and exposes editable raw OCR text. OCR lines can be staged as unverified shopping entries; store/date/price parsing and automatic inventory updates are not implemented.
- [x] Food safety disclaimer with links to USDA FoodKeeper, FoodSafety.gov cold-storage charts, and USDA FSIS leftovers guidance.
- [x] Marketing/landing, help, contact, privacy, terms, plans (Pro clearly unavailable), SEO and social metadata, sitemap, robots.txt.
- [x] Responsive mobile bottom navigation, desktop sections, system/light/dark theme styling, keyboard focus indicators, reduced-motion preferences, and accessible names on key controls.
- [x] GitHub Actions workflow includes unit tests, production build, Chromium installation, Playwright E2E, and Pages deployment.

## Verification evidence

- Unit tests: `npm test` — 18 tests passed locally on 2026-11-26.
- Production build: `npm run build` — passed locally on 2026-11-26. Vite reports large TensorFlow.js chunks; those chunks are loaded only after choosing object recognition. The regular application entry is about 291 kB before gzip in this build.
- E2E discovery: `npx playwright test --list` — 4 browser tests discovered.
- E2E execution: **not passed locally**. The Playwright browser download host returned HTTP 403 in this environment, and the installed `/usr/bin/chromium` launcher points to a missing browser binary. GitHub Actions will run the suite on its hosted runner after push. Do not treat the suite as passed until that workflow completes successfully.
- Deployment: the previous repository Pages workflow run succeeded before these changes. The new version is not marked deployed until its post-commit workflow and live URL are checked.
- Accessibility audit, on-device detector accuracy benchmark, OCR accuracy benchmark, camera hardware check, and production browser verification remain outstanding.

## Known limitations and external services

- Cloud accounts, authentication, household invitations, synchronization, and cross-account isolation are not configured; there are no Supabase credentials assigned to this repository. Guest mode is fully local.
- Food guidance is source-linked reference copy, not a structured FoodKeeper data import or item-specific shelf-life calculator. No status, image, entered date, or score can determine safety.
- COCO-SSD only covers a small set of general objects useful as food suggestions. It cannot perform reliable full-fridge inventory or count sealed packages. Model code is Apache-2.0. Its weights are downloaded from Google-hosted TensorFlow model storage on first use; availability and browser storage limits are external.
- Barcode lookup sends the barcode to the Open Food Facts public API. The community catalog may omit or contain incorrect product data. Network and service policies apply.
- Tesseract.js receipt OCR uses a free open-source engine and English language data downloaded on demand. OCR output is untrusted text and must be manually checked. This is not a receipt parser.
- Notifications are browser permission plus in-app preferences. There is no server push; background delivery is not guaranteed.
- Analytics are limited to the actual data recorded on this device. Historical weekly/monthly trend charts, estimated unit costs, nutrition data, and household comparisons are not yet implemented. Consumed goods are not automatically counted as savings.
- The proposed $3.99/month or $29.99/year plan is unavailable; no checkout is configured.
- No paid API, trial, or payment service is configured. GitHub Pages, Open Food Facts, hosted model files, and browser storage are subject to third-party availability, free-service policies, and device/browser quotas.

## Local development

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The app works without an account. Optional features that contact public services are initiated by explicit user actions. Shelf photos are held temporarily in browser memory and are not uploaded by this application.

# Development and acceptance status

Updated 2026-11-26. Work continues; this is not a claim that every requested acceptance item is complete.

## Implemented in the current source

- [x] React, TypeScript, Vite, responsive styling, hash routes that survive reload, GitHub Pages base-relative assets, manifest, service worker, and vector logo.
- [x] Local guest onboarding with household size, country, currency, units, budget, dietary preferences, allergies, exclusions, reminder preference, and motivation. Optional fields can be skipped.
- [x] IndexedDB guest data with inventory entry/editing, quantity changes, history, locations, category, brand/barcode fields, distinct entered package, purchased, and opened dates, first/last timestamps, confidence field, status, and local export/delete.
- [x] Normalized duplicate checks, including previously unobserved items and barcode matches. Duplicate submission is blocked until the user updates a match or explicitly chooses a separate package. Items can be marked unobserved only through an explicit, storage-scoped review action and are never changed to consumed/discarded by missing-photo inference.
- [x] Multi-photo shelf review. TensorFlow.js COCO-SSD can optionally detect general COCO objects on-device. The supported food classes are limited; results have model confidence and require user review. It does not identify most groceries, brands, dates, or quantities and can miss or mislabel items.
- [x] Financial priority score with entered-date, age, quantity, value, and uncertainty factors; age classification; current inventory value; entered-date value at risk; explicit discard records; explicitly recorded rescue estimates. Scores are not freshness or safety predictions.
- [x] Rescue Center, editable item detail routes, archaeology event timeline filters (date, category, storage, event), refrigerator/freezer/pantry views, shopping list, five original recipe ideas with favorites and suggested substitutions, meal planner, persistent XP/achievement fields with starter unlocks, explicit rescued-value recording, eight-week waste/rescue charts, category totals, CSV/JSON export, and configurable in-app reminder types.
- [x] ZXing camera barcode scanner with manual entry and Open Food Facts lookup. Tesseract.js receipt OCR runs in the browser and exposes editable raw OCR text. OCR lines can be staged as unverified shopping entries; store/date/price parsing and automatic inventory updates are not implemented.
- [x] Food safety disclaimer with links to USDA FoodKeeper, FoodSafety.gov cold-storage charts, and USDA FSIS leftovers guidance. The encyclopedia includes 19 searchable, source-attributed cold-storage rows with opened/unopened variants where the chart distinguishes them, temperature assumptions, and a clear freezer quality note. Matching inventory details surface general chart rows with an explicit warning that they are not computed from the item's history.
- [x] Marketing/landing, help, contact, privacy, terms, plans (Pro clearly unavailable), SEO and social metadata, sitemap, robots.txt.
- [x] Responsive mobile bottom navigation, desktop sections, system/light/dark theme styling, keyboard focus indicators, reduced-motion preferences, and accessible names on key controls.
- [x] GitHub Actions workflow includes unit tests, production build, Chromium installation, Playwright E2E, and Pages deployment.

## Verification evidence

- Unit tests: `npm test` — 22 tests passed locally on 2026-11-26, including four storage-guidance search/source checks.
- Production build: `npm run build` — passed locally on 2026-11-26. Vite reports large TensorFlow.js chunks; those chunks are loaded only after choosing object recognition. The regular application entry is about 305 kB before gzip in this build.
- E2E discovery: `npx playwright test --list` — 8 browser tests discovered, including food-reference search, distinct date persistence, and contextual guidance coverage. The contextual guidance test is awaiting hosted Chromium execution.
- E2E execution: 7 Playwright browser tests passed on GitHub Actions hosted Chromium for commit `a01e487110cdcf32ea2d5f0582537db32fbb6878` (workflow run #12). Local execution is blocked because the browser download host returned HTTP 403 and the installed `/usr/bin/chromium` launcher points to a missing binary.
- Deployment: GitHub Actions Pages deploy step reported success for the same commit and assigned `https://pixelrisemedia1.github.io/Fridge-Archaeologist/`.
- Production browser inspection: not completed. The available browser control rejected navigation to the requested public URL under its URL policy. No alternate browser route was used. Hosted E2E exercised the Vite app before deployment, not the public Pages URL.
- Accessibility audit, on-device detector accuracy benchmark, OCR accuracy benchmark, and camera hardware check remain outstanding.

## Known limitations and external services

- Cloud accounts, authentication, household invitations, synchronization, account data migration, and cross-account isolation are not configured; there are no Supabase credentials assigned to this repository. Guest mode is fully local.
- Food guidance includes 19 selected rows from the FoodSafety.gov cold-storage chart, not a complete FoodKeeper data import or item-specific shelf-life calculator. No status, image, entered date, or score can determine safety.
- Package, purchase, and opening dates are stored separately, but there is no automatic storage-life countdown from purchase/opening dates; printed package dates are treated as user-entered reminders, not safety guarantees.
- COCO-SSD only covers a small set of general objects useful as food suggestions. It cannot perform reliable full-fridge inventory or count sealed packages. Model code is Apache-2.0. Its weights are downloaded from Google-hosted TensorFlow model storage on first use; availability and browser storage limits are external.
- Barcode lookup sends the barcode to the Open Food Facts public API. The community catalog may omit or contain incorrect product data. Network and service policies apply.
- Tesseract.js receipt OCR uses a free open-source engine and English language data downloaded on demand. OCR output is untrusted text and must be manually checked. This is not a receipt parser.
- Notifications are in-app reminders evaluated while the app is open, plus browser permission handling. There is no scheduler or server push; background delivery is not guaranteed.
- Analytics use only actual entries on this device. Eight-week waste/rescue charts and current category totals are available. Unit cost histories, nutrition data, household comparisons, and full month-by-month reports are not implemented. Consumed items count as rescued value only after explicit user action.
- Recipe serving scaling is not implemented. Allergy/exclusion filtering is a conservative string check, not a guarantee; users must verify packaging labels and recipe safety.
- No accessibility conformance audit has been run. The suite checks basic responsive navigation and key app flows, not every route/control or screen reader.
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

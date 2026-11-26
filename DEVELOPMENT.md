# Development and acceptance status

Updated 2026-11-27. Work continues; this is not a claim that every requested acceptance item is complete.

## Implemented in the current source

- [x] React, TypeScript, Vite, responsive styling, hash routes that survive reload, GitHub Pages base-relative assets, manifest, service worker, and vector logo.
- [x] Local guest onboarding with household size, country, currency, units, budget, dietary preferences, allergies, exclusions, reminder preference, and motivation. Optional fields can be skipped.
- [x] IndexedDB guest data with inventory entry/editing, quantity changes, history, locations, category, brand/barcode fields, distinct entered package, purchased, and opened dates, first/last timestamps, confidence field, status, and local export/delete.
- [x] Normalized duplicate checks, including previously unobserved items and barcode matches. Duplicate submission is blocked until the user updates a match or explicitly chooses a separate package. Items can be marked unobserved only through an explicit, storage-scoped review action and are never changed to consumed/discarded by missing-photo inference.
- [x] Multi-photo shelf review. TensorFlow.js COCO-SSD can optionally detect general COCO objects on-device. The supported food classes are limited; results have model confidence and require user review. The detector threshold is 0.3 to retain more candidate boxes, increasing false positives. It does not identify most groceries, brands, dates, or quantities and can miss or mislabel items.
- [x] Financial priority score with entered-date, age, quantity, value, and uncertainty factors; age classification; current inventory value; entered-date value at risk; explicit discard records linked to their source item; the graveyard shows recorded quantity, location, age at discard, reason, and entered value; explicitly recorded rescue estimates. Scores are not freshness or safety predictions.
- [x] Rescue Center, editable item detail routes, archaeology event timeline filters (date, category, storage, event), refrigerator/freezer/pantry views, shopping list, five original recipe ideas with favorites, saved serving adjustments and approximate ingredient quantities, suggested substitutions, meal planner, persistent XP, level, achievements, local claim-once challenges, and recordkeeping streaks, explicit rescued-value recording, eight-week and twelve-calendar-month waste/rescue views, category totals, CSV/JSON export, and configurable in-app reminder types.
- [x] ZXing camera barcode scanner with manual entry and Open Food Facts lookup. Tesseract.js receipt OCR runs in the browser and exposes editable raw text plus heuristic editable store/date/currency/total/item fields. Users must confirm before selected rows are added; possible inventory duplicates are skipped. OCR remains untrusted and non-matching rows stay visible for review.
- [x] Food safety disclaimer with links to USDA FoodKeeper, FoodSafety.gov cold-storage charts, and USDA FSIS leftovers guidance. The encyclopedia includes 49 searchable, source-attributed cold-storage rows with opened/unopened variants where the chart distinguishes them, temperature assumptions, and a clear freezer quality note. Matching inventory details surface general chart rows with an explicit warning that they are not computed from the item's history.
- [x] Marketing/landing with a clearly labeled illustrative dashboard, product explanation, benefits, privacy, pricing availability, FAQ, installation notes, support, and legal links; help, contact, privacy, terms, plans (Pro clearly unavailable), SEO/social metadata, sitemap, and robots.txt.
- [x] Responsive mobile bottom navigation, desktop sections, system/light/dark theme styling, keyboard focus indicators, reduced-motion preferences, and accessible names on key controls.
- [x] GitHub Actions workflow includes unit tests, production build, Chromium installation, Playwright E2E, and Pages deployment.

## Verification evidence

- Unit tests: `npm test` — 36 tests passed locally on 2026-11-27, including storage-guidance, receipt-parser, and recipe-scaling checks.
- Production build: `npm run build` — passed locally on 2026-11-27. Vite reports large TensorFlow.js chunks; those chunks are loaded only after choosing object recognition. COCO-SSD suggestions use a 0.3 threshold to retain more candidates, which raises false-positive risk and makes user review important. The regular application entry is about 321 kB before gzip in this build.
- E2E discovery: `npx playwright test --list` — 18 browser tests discovered locally, including recordkeeping streak/challenge persistence, real OCR review, persisted recipe serving adjustments, analytics periods, explicit discard and rescue records, onboarding/export flows, and landing-page disclosure.
- E2E execution: Run #25 passed 10/10 hosted Playwright tests; run #26 passed build and deployment for commit `f6e31edbbdf5a9c47e137fc12e2b7dedf27f6791`. Runs #27, #28, and #29 exposed and resolved selector/expectation issues, with 11/12, 12/14, and 15/16 passing respectively. Run #31 was canceled when the detector-threshold preservation commit arrived; run #32 reached 15/16 and showed the official storage-reference detail view had been dropped during the landing-page rewrite. That view is restored locally. Run #33 passed unit tests, production build, hosted Playwright E2E, and Pages deployment after the official food-detail view was restored. Run #34 passed the same stages for commit `960f394c46e14fdf08c77d98c6c3943f84937253`, including the streak/challenge behavior. Run #35 also passed build, unit tests, hosted Playwright E2E, and Pages deployment for commit `c48561bfde4eb854e608d77a0af6f046283f01f4`. Local E2E discovery is now 18 tests with an additional smoke sweep across every primary navigation route; those latest additions await the next hosted run. Local Playwright was attempted but could not launch because `/usr/bin/chromium` points to missing `/usr/lib/chromium/chromium`; downloading the Playwright browser was blocked by HTTP 403. Hosted Actions remains the browser verification path for local additions.
- Deployment: GitHub Actions Pages deploy step reported success for the same commit and assigned `https://pixelrisemedia1.github.io/Fridge-Archaeologist/`.
- Production browser inspection: not completed. The available browser control rejected navigation to the requested public URL under its URL policy. No alternate browser route was used. Hosted E2E exercised the Vite app before deployment, not the public Pages URL.
- `npm audit --audit-level=high` initially found two critical and one moderate advisory in the development Vitest/Tinypool chain. Vitest was upgraded to 5.1.2; the 36 unit tests and production build passed after the upgrade, and a repeat full `npm audit --audit-level=high` reports zero vulnerabilities. The dependency upgrade is awaiting hosted CI.

## Known limitations and external services

- Cloud accounts, authentication, household invitations, synchronization, account data migration, and cross-account isolation are not configured; there are no Supabase credentials assigned to this repository. Guest mode is fully local.
- Food guidance includes 49 selected rows from the FoodSafety.gov cold-storage chart, not a complete FoodKeeper data import or item-specific shelf-life calculator. The public USDA JSON endpoint returned HTTP 403 during this audit, so the full dataset could not be retrieved for safe offline inclusion. No status, image, entered date, or score can determine safety.
- Package, purchase, and opening dates are stored separately, but there is no automatic storage-life countdown from purchase/opening dates; printed package dates are treated as user-entered reminders, not safety guarantees.
- COCO-SSD only covers a small set of general objects useful as food suggestions. It cannot perform reliable full-fridge inventory or count sealed packages. Model code is Apache-2.0. Its weights are downloaded from Google-hosted TensorFlow model storage on first use; availability and browser storage limits are external.
- Barcode lookup sends the barcode to the Open Food Facts public API. The community catalog may omit or contain incorrect product data. Network and service policies apply.
- Tesseract.js receipt OCR uses a free open-source engine and English language data downloaded on demand. Receipt parsing uses conservative text heuristics, not a certified receipt model; all fields and rows require manual checking, and OCR text stays visible for comparison.
- Notifications are in-app reminders evaluated while the app is open, plus browser permission handling. There is no scheduler or server push; background delivery is not guaranteed.
- Analytics use only actual entries on this device. Eight-week and twelve-calendar-month waste/rescue views and current category totals are available. Unit cost histories, nutrition data, household comparisons, and richer financial reports are not implemented. Consumed items count as rescued value only after explicit user action.
- Recipe quantities are approximate amounts for five original ideas and scale with servings. Allergy/exclusion filtering is a conservative string check, not a guarantee; users must verify packaging labels and recipe safety.
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

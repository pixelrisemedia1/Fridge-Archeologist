# Acceptance checklist
Status: implementation in progress. No deployment or test pass has been verified.
- [x] React/TypeScript/Vite configuration, vector logo, local storage implementation
- [x] Initial guest onboarding, inventory, assisted photo review, matching suggestions, shopping, timeline, waste and financial totals
- [x] GitHub Pages workflow authored
- [x] Initial unit test fixtures authored
- [ ] Verify production build and unit tests
- [ ] Full onboarding, routes, accessibility and browser tests
- [ ] Actual on-device recognition, multi-photo review and scan history
- [ ] Robust historical matching and storage guidance with official sources
- [ ] Barcode and receipt OCR
- [ ] Recipes, meal plans, advanced reports, achievements, reminders
- [ ] Optional cloud accounts and household isolation
- [ ] Marketing, legal, proposed plans, SEO
- [ ] Verify deployment and production acceptance
## Local development
Node 22: npm install; npm run dev; npm test; npm run build.
## Limitations
Manual scan review only; no safety determination, no live billing, no cloud sync. Scores are financial estimates. No paid services configured. GitHub Pages and optional external services have usage limits.

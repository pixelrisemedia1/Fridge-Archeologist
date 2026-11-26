# Fridge Archaeologist

**Your fridge has secrets. Dig them up before they cost you.**

A local-first food inventory, meal-planning, and waste-recording PWA. Guest data is saved in the browser. There is no account or payment required.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Privacy and feature limits

Inventory data uses IndexedDB on this device. Shelf images are temporary and processed locally. Optional object recognition downloads a TensorFlow.js COCO-SSD model and only recognizes a limited set of common objects; all results require confirmation. Barcode lookup sends the scanned barcode to Open Food Facts. Receipt OCR runs locally after downloading the OCR engine and language file. See [DEVELOPMENT.md](./DEVELOPMENT.md) for current verification, known limits, and food-safety sources.

## Deployment

GitHub Actions builds, tests, and deploys `main` to GitHub Pages at [pixelrisemedia1.github.io/Fridge-Archeologist](https://pixelrisemedia1.github.io/Fridge-Archeologist/). A successful build is not a successful deployment; verify the Pages workflow and the public site after each push.

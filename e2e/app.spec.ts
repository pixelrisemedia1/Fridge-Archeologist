import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /continue privately as guest/i }).click();
});

test('guest adds, persists, edits, and marks an item used', async ({ page }) => {
  await page.getByRole('link', { name: /inventory/i }).first().click();
  await page.getByLabel('Food name').fill('Blueberries');
  await page.getByLabel('Quantity').fill('2');
  await page.getByLabel(/unit value/i).fill('4.5');
  await page.getByRole('button', { name: 'Add item' }).click();
  await expect(page.getByRole('heading', { name: 'Blueberries' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByLabel('Quantity').fill('3');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.reload();
  await page.getByRole('link', { name: /inventory/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Blueberries' })).toBeVisible();
  await page.getByRole('button', { name: 'Mark used' }).click();
  await page.getByRole('link', { name: /fridge graveyard/i }).click();
  await expect(page.getByText('No discarded food recorded')).toBeVisible();
});

test('missing shelf item stays unobserved and duplicate entries require a choice', async ({ page }) => {
  await page.getByRole('link', { name: /inventory/i }).first().click();
  await page.getByLabel('Food name').fill('Yogurt');
  await page.getByRole('button', { name: 'Add item' }).click();
  await page.getByLabel('Food name').fill('Yogurt');
  await expect(page.getByRole('button', { name: /update existing yogurt/i })).toBeVisible();
  await page.getByRole('button', { name: 'Add item' }).click();
  await expect(page.getByRole('status')).toContainText(/possible duplicate found/i);
  await expect(page.locator('.item-card')).toHaveCount(1);
  await page.getByLabel('Food name').fill('');
  await page.getByRole('button', { name: 'Yogurt' }).click();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Mark not seen on latest scan' }).click();
  await expect(page.getByText('Not seen · 1')).toBeVisible();
  await page.getByRole('link', { name: /scan history/i }).click();
  await expect(page.getByText('No scans recorded')).toBeVisible();
  await page.getByRole('link', { name: /archaeology timeline/i }).click();
  await expect(page.locator('.timeline p').filter({ hasText: 'unobserved' })).toBeVisible();
  await page.getByRole('link', { name: /inventory/i }).first().click();
  await page.getByRole('button', { name: 'Not seen · 1' }).click();
  await expect(page.getByRole('heading', { name: 'Yogurt' })).toBeVisible();
});

test('routes, food safety copy, export controls, and narrow mobile navigation render', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.mobile-nav')).toBeVisible();
  await page.locator('.mobile-nav').getByRole('button', { name: /rescue/i }).click();
  await expect(page.getByRole('heading', { name: 'Rescue Center' })).toBeVisible();
  await page.goto('/#/food-safety');
  await expect(page.getByText(/does not determine whether food is safe to eat/i)).toBeVisible();
  await page.goto('/#/settings');
  await expect(page.getByRole('button', { name: 'Export JSON' })).toBeVisible();
});

test('scan route clearly discloses manual review and private photo handling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.mobile-nav').getByRole('button', { name: 'Scan' }).click();
  await expect(page.getByText(/photos are processed locally and never uploaded/i)).toBeVisible();
  await expect(page.getByLabel(/photograph or choose shelf images/i)).toBeVisible();
});

test('analytics and reminder preferences render and save locally', async ({ page }) => {
  await page.locator('.sidebar').getByRole('link', { name: /Analytics/i }).click();
  await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible();
  await expect(page.locator('.chart-column')).toHaveCount(8);
  await page.locator('.sidebar').getByRole('link', { name: /Notifications/i }).click();
  const mealReminder = page.getByLabel('Meal planning nudge');
  await expect(mealReminder).toBeChecked();
  await mealReminder.uncheck();
  await page.reload();
  await page.locator('.sidebar').getByRole('link', { name: /Notifications/i }).click();
  await expect(page.getByLabel('Meal planning nudge')).not.toBeChecked();
});

test('food encyclopedia searches official refrigerated and frozen guidance', async ({ page }) => {
  await page.locator('.sidebar').getByRole('link', { name: /Food encyclopedia/i }).click();
  const search = page.getByRole('searchbox', { name: 'Search storage guidance' });
  await search.fill('minced beef');
  await expect(page.getByRole('heading', { name: 'Ground meat and ground poultry' })).toBeVisible();
  await expect(page.getByText(/Refrigerator .*1–2 days/)).toBeVisible();
  await expect(page.getByText(/Freezer .*3–4 months/)).toBeVisible();
  await expect(page.getByText(/Freezer storage periods below are for quality/i)).toBeVisible();
  await search.fill('hot dog');
  await expect(page.getByText('Opened package', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('Unopened package', { exact: false }).first()).toBeVisible();
});

test('inventory keeps package, purchase, and opening dates distinct', async ({ page }) => {
  await page.locator('.sidebar').getByRole('link', { name: /Inventory/i }).click();
  await page.getByLabel('Food name').fill('Cooked rice');
  await page.getByLabel('Best by/use by date on package').fill('2026-11-28');
  await page.getByLabel('Purchased on (optional)').fill('2026-11-24');
  await page.getByLabel('Opened on (optional)').fill('2026-11-25');
  await page.getByRole('button', { name: 'Add item' }).click();
  await expect(page.getByText(/Best by\/use by date entered: 2026-11-28/)).toBeVisible();
  await expect(page.getByText('Purchased: 2026-11-24')).toBeVisible();
  await expect(page.getByText('Opened: 2026-11-25')).toBeVisible();
  await page.reload();
  await page.locator('.sidebar').getByRole('link', { name: /Inventory/i }).click();
  await expect(page.getByText('Purchased: 2026-11-24')).toBeVisible();
  await expect(page.getByText('Opened: 2026-11-25')).toBeVisible();
});

test('food details surface a matching source without treating it as a safety result', async ({ page }) => {
  await page.locator('.sidebar').getByRole('link', { name: /Inventory/i }).click();
  await page.getByLabel('Food name').fill('Ground beef');
  await page.getByRole('button', { name: 'Add item' }).click();
  await page.getByRole('button', { name: 'Details' }).click();
  await expect(page.getByRole('heading', { name: 'Official storage reference' })).toBeVisible();
  await expect(page.getByText(/not calculated from this item's dates or history/i)).toBeVisible();
  await expect(page.getByText(/Refrigerator at 40°F \/ 4°C or below: 1–2 days/)).toBeVisible();
  await expect(page.getByRole('link', { name: /FoodSafety.gov Cold Food Storage Chart/i })).toBeVisible();
});

test('receipt OCR creates an editable review and does not change inventory automatically', async ({ page }) => {
  test.setTimeout(90_000);
  await page.locator('.sidebar').getByRole('link', { name: /Inventory/i }).click();
  await expect(page.locator('.item-card')).toHaveCount(0);
  await page.locator('.sidebar').getByRole('link', { name: /Receipt scanner/i }).click();
  await page.getByLabel(/Choose receipt image/i).setInputFiles('e2e/fixtures/receipt.png');
  await expect(page.getByLabel('Editable OCR text')).toBeVisible({ timeout: 75_000 });
  await expect(page.getByRole('region', { name: 'Receipt review' })).toBeVisible();
  await expect(page.getByLabel('Receipt store')).toBeVisible();
  await page.locator('.sidebar').getByRole('link', { name: /Inventory/i }).click();
  await expect(page.locator('.item-card')).toHaveCount(0);
});

test('recipe servings scale ingredient amounts and persist locally', async ({ page }) => {
  await page.locator('.sidebar').getByRole('link', { name: /^Recipes$/i }).click();
  const card = page.locator('.recipe-card').filter({ has: page.getByRole('heading', { name: 'Flexible vegetable frittata' }) });
  await card.getByRole('button', { name: 'View recipe' }).click();
  const servings = card.getByLabel('Servings for Flexible vegetable frittata');
  await servings.selectOption('4');
  await expect(card.getByRole('listitem').filter({ hasText: '8 eggs' })).toBeVisible();
  await page.reload();
  await page.locator('.sidebar').getByRole('link', { name: /^Recipes$/i }).click();
  const reloadedCard = page.locator('.recipe-card').filter({ has: page.getByRole('heading', { name: 'Flexible vegetable frittata' }) });
  await reloadedCard.getByRole('button', { name: 'View recipe' }).click();
  await expect(reloadedCard.getByLabel('Servings for Flexible vegetable frittata')).toHaveValue('4');
  await expect(reloadedCard.getByRole('listitem').filter({ hasText: '8 eggs' })).toBeVisible();
});

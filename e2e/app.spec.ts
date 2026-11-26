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

test('missing shelf item stays unobserved and remains eligible for a duplicate match', async ({ page }) => {
  await page.getByRole('link', { name: /inventory/i }).first().click();
  await page.getByLabel('Food name').fill('Yogurt');
  await page.getByRole('button', { name: 'Add item' }).click();
  await page.getByLabel('Food name').fill('Yogurt');
  await expect(page.getByRole('button', { name: /update existing yogurt/i })).toBeVisible();
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

import { test, expect } from '@playwright/test';

test('published Pages guest inventory loads, saves, and reloads without browser errors', async ({ page }) => {
  const browserErrors: string[] = [];
  page.on('pageerror', error => browserErrors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') browserErrors.push(message.text());
  });

  await page.goto('./');
  await expect(page.getByRole('button', { name: /continue privately as guest/i })).toBeVisible();
  await page.getByRole('button', { name: /continue privately as guest/i }).click();
  await page.locator('.sidebar').getByRole('link', { name: /Inventory/i }).click();
  await page.getByLabel('Food name').fill('Production smoke apple');
  await page.getByRole('button', { name: 'Add item' }).click();
  await expect(page.getByRole('heading', { name: 'Production smoke apple' })).toBeVisible();
  await page.reload();
  await page.locator('.sidebar').getByRole('link', { name: /Inventory/i }).click();
  await expect(page.getByRole('heading', { name: 'Production smoke apple' })).toBeVisible();
  expect(browserErrors).toEqual([]);
});

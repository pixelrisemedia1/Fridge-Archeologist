import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('primary destinations meet WCAG 2.1 A and AA automated checks', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /continue privately as guest/i }).click();
  const routes = [
    'Dashboard', 'Landing page', 'Inventory', 'Scan', 'Scan history', 'Archaeology timeline',
    'Fridge', 'Freezer', 'Pantry', 'Rescue Center', 'Recipes', 'Meal planner', 'Shopping list',
    'Barcode scanner', 'Receipt scanner', 'Food encyclopedia', 'Fridge Graveyard',
    'Savings dashboard', 'Analytics', 'Weekly reports', 'Challenges', 'Achievements',
    'Household', 'Notifications', 'Profile', 'Settings', 'Plans', 'Help', 'Contact',
    'Privacy', 'Terms', 'Food safety'
  ];

  for (const theme of ['light', 'dark'] as const) {
    await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
    for (const route of routes) {
    const href = `#/${route.toLowerCase().replaceAll(' ', '-')}`;
    await page.locator(`.sidebar a[href="${href}"]`).click();
    await expect(page.locator('main h1')).toBeVisible();
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(result.violations, `${theme} ${route} accessibility violations`).toEqual([]);
    }
  }
});

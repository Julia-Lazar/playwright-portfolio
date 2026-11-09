import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// fail only on the two worst levels; 'moderate' and 'minor' issues are documented in the README
const BLOCKING_IMPACTS = ['critical', 'serious'];

async function blockingViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.filter(violation => BLOCKING_IMPACTS.includes(violation.impact ?? ''));
}

test.describe('logged out', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('login page: no critical or serious accessibility violations', async ({ page }) => {
    await page.goto('/');
    // toEqual([]) lists every violation in the error message, so no console.log is needed
    expect(await blockingViolations(page)).toEqual([]);
  });
});

const loggedInPages = [
  { name: 'product list',               path: '/inventory.html' },
  { name: 'product details',            path: '/inventory-item.html?id=4' },
  { name: 'cart',                       path: '/cart.html' },
  { name: 'checkout: your information', path: '/checkout-step-one.html' },
  { name: 'checkout: overview',         path: '/checkout-step-two.html' },
];

for (const loggedInPage of loggedInPages) {
  test(`${loggedInPage.name}: no critical or serious accessibility violations`, async ({ page }) => {
    await page.goto(loggedInPage.path);
    // without a session the app redirects to the login page, and axe would scan the wrong page
    await expect(page).toHaveURL(loggedInPage.path);
    expect(await blockingViolations(page)).toEqual([]);
  });
}

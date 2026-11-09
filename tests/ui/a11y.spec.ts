import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ storageState: { cookies: [], origins: [] } });

test('login page: no critical accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter(violation => violation.impact === 'critical');
  console.log(critical.map(violation => `${violation.id}: ${violation.help}`));   // read this in the report
  expect(critical).toEqual([]);
});
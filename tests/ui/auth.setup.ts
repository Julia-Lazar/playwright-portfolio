import { test as setup, expect } from '@playwright/test';

// runs ONCE before the ui project, then every test starts already logged in
setup('log in and save the session', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill(process.env.SAUCE_PASSWORD ?? 'secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory/);
  await page.context().storageState({ path: '.auth/user.json' });
});
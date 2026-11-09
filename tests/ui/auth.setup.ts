import { uiTest as setup, expect } from '../../fixtures/fixtures';

// runs ONCE before the ui project, then every test starts already logged in
setup('log in and save the session', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', process.env.SAUCE_PASSWORD ?? 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
  await page.context().storageState({ path: '.auth/user.json' });
});

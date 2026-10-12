import { test, expect } from '../../fixtures/fixtures';

// these tests need a logged-OUT browser, so drop the saved session
test.use({ storageState: { cookies: [], origins: [] } });

test('standard user can log in @smoke', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
});

const badLogins = [
  { name: 'locked out user', user: 'locked_out_user', pass: 'secret_sauce', error: 'Sorry, this user has been locked out' },
  { name: 'wrong password',  user: 'standard_user',   pass: 'nope',         error: 'Username and password do not match' },
  { name: 'empty username',  user: '',                pass: 'secret_sauce', error: 'Username is required' },
];

for (const c of badLogins) {
  test(`login fails: ${c.name}`, async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(c.user, c.pass);
    await expect(loginPage.error).toContainText(c.error);
  });
}
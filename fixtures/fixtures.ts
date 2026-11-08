import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  checkoutPage: CheckoutPage;
};

type ApiFixtures = {
  booking: number;   // the ID of a fresh booking, created for this one test
};

export const newBooking = {
  firstname: 'Ada',
  lastname: 'Lovelace',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  additionalneeds: 'Breakfast',
};

export async function getAuthHeaders(request: APIRequestContext) {
  const auth = await request.post('/auth', { data: { username: 'admin', password: 'password123' } });
  expect(auth.ok()).toBeTruthy();
  const { token } = await auth.json();
  return { Cookie: `token=${token}` };
}

// UI tests can ask for { loginPage } instead of writing `new LoginPage(page)`
export const uiTest = base.extend<Pages>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  inventoryPage: async ({ page }, use) => { await use(new InventoryPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
});

// API tests can ask for { booking }: a fresh booking that is always cleaned up
export const apiTest = base.extend<ApiFixtures>({
  booking: async ({ request }, use) => {
    // setup: runs before the test
    const res = await request.post('/booking', { data: newBooking });
    expect(res.status()).toBe(200);
    const { bookingid } = await res.json();

    await use(bookingid);   // the test runs here

    // teardown: runs after the test, even when it failed.
    // No assertion: the test may have already deleted the booking itself.
    // Asserting 201 here would turn the CRUD test red because of the cleanup alone,
    // not because of a bug in the app: a false negative (the test fails although the app works).
    await request.delete(`/booking/${bookingid}`, { headers: await getAuthHeaders(request) });
  },
});

export { expect };

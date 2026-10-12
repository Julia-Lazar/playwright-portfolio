import { test, expect } from '../../fixtures/fixtures';

test.beforeEach(async ({ inventoryPage }) => {
  await inventoryPage.goto();                     // already logged in (storageState)
});

test('sorts products by price, low to high', async ({ inventoryPage }) => {
  await inventoryPage.sortBy('lohi');
  await expect(inventoryPage.prices.first()).toHaveText('$7.99');   // wait for the re-sort
  const prices = await inventoryPage.priceList();
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('adding two products updates the cart badge @smoke', async ({ inventoryPage }) => {
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.addToCart('sauce-labs-bike-light');
  await expect(inventoryPage.cartBadge).toHaveText('2');
});

test('full checkout @smoke', async ({ inventoryPage, checkoutPage }) => {
  await inventoryPage.addToCart('sauce-labs-backpack');
  await checkoutPage.start();
  await checkoutPage.fillInfo('Ada', 'Lovelace', '00-001');
  await checkoutPage.finish();
  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
});

test('checkout needs a first name', async ({ inventoryPage, checkoutPage }) => {
  await inventoryPage.addToCart('sauce-labs-backpack');
  await checkoutPage.start();
  await checkoutPage.fillInfo('', 'Lovelace', '00-001');
  await expect(checkoutPage.error).toContainText('First Name is required');
});
import { uiTest as test, expect } from '../../fixtures/fixtures';

test.beforeEach(async ({ inventoryPage }) => {
  await inventoryPage.goto();                     // already logged in (storageState)
});

test('sorts products by price, low to high', async ({ inventoryPage }) => {
  await expect(inventoryPage.prices.first()).toBeVisible();   // priceList() doesn't wait, so wait for the list first
  // expected = the same prices, sorted by us. Comparing against it catches wrong order,
  // missing products, an empty list and changed prices (just "is it sorted?" misses the last three)
  const before = await inventoryPage.priceList();
  const expected = [...before].sort((a, b) => a - b);

  await inventoryPage.sortBy('lohi');
  // priceList() is a one-off snapshot, so toPass re-takes it until the re-sort is done
  await expect(async () => {
    expect(await inventoryPage.priceList()).toEqual(expected);
  }).toPass({ timeout: 5000 });
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
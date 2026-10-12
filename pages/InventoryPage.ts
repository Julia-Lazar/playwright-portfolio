import type { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly prices: Locator;
  readonly sort: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.prices = page.getByTestId('inventory-item-price');
    this.sort = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async addToCart(slug: string) {           // e.g. 'sauce-labs-backpack'
    await this.page.getByTestId(`add-to-cart-${slug}`).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sort.selectOption(option);
  }

  async priceList(): Promise<number[]> {
    const texts = await this.prices.allTextContents();   // ['$7.99', '$9.99', …]
    return texts.map(t => Number(t.replace('$', '')));
  }
}
import type { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  get error() { return this.page.getByTestId('error'); }
  get completeHeader() { return this.page.getByTestId('complete-header'); }

  async start() {
    await this.page.getByTestId('shopping-cart-link').click();
    await this.page.getByTestId('checkout').click();
  }

  async fillInfo(first: string, last: string, zip: string) {
    await this.page.getByTestId('firstName').fill(first);
    await this.page.getByTestId('lastName').fill(last);
    await this.page.getByTestId('postalCode').fill(zip);
    await this.page.getByTestId('continue').click();
  }

  async finish() {
    await this.page.getByTestId('finish').click();
  }
}
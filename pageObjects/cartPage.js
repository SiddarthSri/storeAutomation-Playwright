import { expect } from '@playwright/test';

export class CartPage {
  constructor(page) {
    this.page = page;
    this.actionTimeout = 3000;
    this.cartTableBody = page.locator('#tbodyid');
    this.placeOrderButton = page.locator('.btn-success').filter({ hasText: 'Place Order' });
    this.totalPrice = page.locator('#totalp');
    
    // Place Order Modal
    this.nameInput = page.locator('#name');
    this.countryInput = page.locator('#country');
    this.cityInput = page.locator('#city');
    this.cardInput = page.locator('#card');
    this.monthInput = page.locator('#month');
    this.yearInput = page.locator('#year');
    this.purchaseButton = page.locator("//button[@onclick='purchaseOrder()']");
    this.sweetAlertSuccess = page.locator('.sweet-alert');
    this.sweetAlertOkButton = page.locator('.confirm.btn.btn-lg.btn-primary');
  }

  async verifyProductInCart(productName) {
    await this.cartTableBody.waitFor({ state: 'visible', timeout: this.actionTimeout });
    const productRow = this.cartTableBody.locator('tr').filter({ hasText: productName }).first();
    await productRow.waitFor({ state: 'visible', timeout: this.actionTimeout });
    const isVisible = await productRow.isVisible();
    expect(isVisible).toBe(true);
  }

  async deleteProductFromCart(productName) {
    // Wait for the specific product row to be fully loaded
    const productRow = this.cartTableBody.locator('tr').filter({ hasText: productName }).first();
    await productRow.waitFor({ state: 'visible', timeout: 10000 });
    
    const deleteButton = productRow.locator('a', { hasText: 'Delete' });
    await deleteButton.click();
    
    // Wait for the product row to be hidden from the DOM
    await productRow.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async clickPlaceOrder() {
    await this.placeOrderButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.placeOrderButton.click();
  }

  async fillPlaceOrderDetails(name, country, city, card, month, year) {
    await this.nameInput.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.nameInput.fill(name);
    await this.countryInput.fill(country);
    await this.cityInput.fill(city);
    await this.cardInput.fill(card);
    await this.monthInput.fill(month);
    await this.yearInput.fill(year);
  }

  async clickPurchase() {
    await this.purchaseButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.purchaseButton.click();
  }

  async verifyPurchaseSuccess() {
    await this.sweetAlertSuccess.waitFor({ state: 'visible', timeout: this.actionTimeout });
    const successText = await this.sweetAlertSuccess.locator('h2').textContent();
    expect(successText).toBe('Thank you for your purchase!');
    
    await this.sweetAlertOkButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.sweetAlertOkButton.click();
  }
}

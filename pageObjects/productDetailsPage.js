import { expect } from '@playwright/test';

export class ProductDetailsPage {
  constructor(page) {
    this.page = page;
    this.actionTimeout = 2000;
    this.productName = page.locator('.name');
    this.productPrice = page.locator('.price-container');
    this.productDescription = page.locator('#more-information');
    this.addToCartButton = page.locator('.btn-success');
  }

  async validateProductName(expectedName) {
    await this.productName.waitFor({ state: 'visible', timeout: this.actionTimeout });
    const nameText = await this.productName.textContent();
    expect(nameText.trim()).toBe(expectedName);
  }

  async clickAddToCartAndAcceptAlert() {
    try {
      // Import and instantiate BasePage to use the robust polling & Promise.race utility
      const { BasePage } = require('./basePage');
      const basePage = new BasePage(this.page);
      
      const dialog = await basePage.clickWithPollingAndWaitForDialog(this.addToCartButton, 10000);
      
      const alertMessage = dialog.message();
      console.log(`Alert message: ${alertMessage}`);
      await dialog.accept();
      
      expect(alertMessage).toContain('Product added');
      return alertMessage;
    } catch (error) {
      console.error('Error in clickAddToCartAndAcceptAlert:', error);
      throw error;
    }
  }
}

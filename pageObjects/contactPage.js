import { expect } from '@playwright/test';

export class ContactPage {
  constructor(page) {
    this.page = page;
    this.actionTimeout = 2000;
    this.contactEmailBox = page.locator('#recipient-email');
    this.contactNameBox = page.locator('#recipient-name');
    this.messageBox = page.locator('#message-text');
    this.sendMessageButton = page.locator("//button[@onclick='send()']");
    this.closeButton = page.locator(
      "//h5[@id='exampleModalLabel']//parent::div/following-sibling::div[@class='modal-footer'] //button[@data-dismiss='modal']"
    );
    this.contactCloseButton = page.locator("//h5[@id='exampleModalLabel']/following-sibling::button[@class='close']");
  }

  async populateContactForm(email, name, message) {
    await this.contactEmailBox.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.contactEmailBox.fill(email);
    await this.contactNameBox.fill(name);
    await this.messageBox.fill(message);
  }

  async clickOnSendMessage() {
    try {
      // Playwright's .click() automatically waits for the element to be visible, enabled, and stable.
      // We removed the redundant waitFor() and the aggressive 2-second timeout.
      await this.sendMessageButton.click();
    } catch (error) {
      console.error('Error in clickOnSendMessage:', error);
      throw error;
    }
  }

  async cancelContactAction() {
    await this.closeButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.closeButton.click();
  }

  async closeContactAction() {
    await this.contactCloseButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.contactCloseButton.click();
  }

  async performSendMessageAndAcceptAlert(email, name, message, expectedAlertMessage) {
    try {
      await this.populateContactForm(email, name, message);
      
      // Import and instantiate BasePage to use the robust polling & Promise.race utility
      const { BasePage } = require('./basePage');
      const basePage = new BasePage(this.page);
      
      const dialog = await basePage.clickWithPollingAndWaitForDialog(this.sendMessageButton, 10000);
      
      const alertMessage = dialog.message();
      console.log(`Alert message: ${alertMessage}`);
      await dialog.accept();
      
      expect(alertMessage).toBe(expectedAlertMessage);
      return alertMessage;
    } catch (error) {
      console.error('Error in performSendMessageAndAcceptAlert:', error);
      throw error;
    }
  }
}

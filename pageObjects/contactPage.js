import { expect } from '@playwright/test';
import { BasePage } from './basePage.js';

export class ContactPage {
  constructor(page) {
    this.page = page;
    this.actionTimeout = 2000;
    this.basePage = new BasePage(page);
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

      const dialog = await this.basePage.clickWithPollingAndWaitForDialog(this.sendMessageButton, 10000);

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

import { expect } from '@playwright/test';

export class SignUpPage {
  constructor(page) {
    this.page = page;
    this.actionTimeout = 2000;
    this.usernameBox = page.locator('#sign-username');
    this.passwordBox = page.locator('#sign-password');
    this.signUpButton = page.locator("//button[@onclick='register()']");
    this.closeButton = page.locator(
      "//h5[@id='signInModalLabel']//parent::div/following-sibling::div[@class='modal-footer'] //button[@data-dismiss='modal']"
    );
    this.signUpCloseButton = page.locator("//h5[@id='signInModalLabel']/following-sibling::button[@class='close']");
  }

  async populateSignUpDetails(username, password) {
    await this.usernameBox.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.usernameBox.fill(username);
    await this.passwordBox.fill(password);
  }

  async clickOnSignUpSubmit() {
    try {
      await this.signUpButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
      await this.signUpButton.click();
    } catch (error) {
      console.error('Error in clickOnSignUpSubmit:', error);
      throw error;
    }
  }

  async cancelSignUpAction() {
    await this.closeButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.closeButton.click();
  }

  async closeSignUpAction() {
    await this.signUpCloseButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.signUpCloseButton.click();
  }

  async performSignUpActionAndAcceptAlert(username, password, expectedAlertMessage) {
    try {
      await this.populateSignUpDetails(username, password);
      
      // Import and instantiate BasePage to use the robust polling & Promise.race utility
      const { BasePage } = require('./basePage');
      const basePage = new BasePage(this.page);
      
      const dialog = await basePage.clickWithPollingAndWaitForDialog(this.signUpButton, 10000);
      
      const alertMessage = dialog.message();
      console.log(`Alert message: ${alertMessage}`);
      await dialog.accept();
      
      expect(alertMessage).toBe(expectedAlertMessage);
      return alertMessage;
    } catch (error) {
      console.error('Error in performSignUpActionAndAcceptAlert:', error);
      throw error;
    }
  }
}

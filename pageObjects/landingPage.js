import { expect } from '@playwright/test';
//const credentials = JSON.parse(JSON.stringify(require('../data/credentials.json')));

export class LandingPage {
  constructor(page) {
    this.page = page;
    this.actionTimeout = 2000;
    this.webSiteurl = 'https://www.demoblaze.com/';
    this.loginButton = page.locator('#login2');
    this.usernameBox = page.locator('#loginusername');
    this.passwordBox = page.locator('#loginpassword');
    this.loginSubmit = page.locator("//button[@onclick='logIn()']");
    this.loggedInuser = page.locator('#nameofuser');
    this.closeButton = page.locator(
      "//h5[@id='logInModalLabel']//parent::div/following-sibling::div[@class='modal-footer'] //button[@data-dismiss='modal']"
    );
    this.loginCloseButton = page.locator("//h5[@id='logInModalLabel']/following-sibling::button[@class='close']");
  }

  async naviagetToDemoBlaze() {
    await this.page.goto(this.webSiteurl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickOnLoginButton() {
    await this.loginButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.loginButton.click();
  }

  async validateLoginButtonVisibility(loginVisibility) {
    try {
      await this.loginButton.waitFor({ state: loginVisibility ? 'visible' : 'hidden', timeout: this.actionTimeout });
      const isVisible = await this.loginButton.isVisible();
      expect(isVisible).toBe(loginVisibility);
    } catch (error) {
      console.error('Error in validateLoginButtonVisibility:', error);
      throw error;
    }
  }

  async populateLoginDetails(username, password) {
    await this.usernameBox.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.usernameBox.fill(username);
    await this.passwordBox.fill(password);
  }

  async clickOnLoginSubmit() {
    try {
      await this.loginSubmit.waitFor({ state: 'visible', timeout: this.actionTimeout });
      await this.loginSubmit.click();
    } catch (error) {
      console.error('Error in clickOnLoginSubmit:', error);
      throw error;
    }
  }

  async validateLoggedInUser(visibility = true) {
    try {
      await this.loggedInuser.waitFor({ state: visibility ? 'visible' : 'hidden', timeout: 10000 });
      const isVisible = await this.loggedInuser.isVisible();
      expect(isVisible).toBe(visibility);
    } catch (error) {
      console.error('Error in validateLoggedInUser:', error);
      throw error;
    }
  }

  async populateuserNameAndPassword(username = process.env.USERNAME, password = process.env.PASSWORD) {
    await this.usernameBox.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.usernameBox.fill(username);
    await this.passwordBox.fill(password);
  }

  async performSigninActionAndSaveState() {
    await this.loginSubmit.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.loginSubmit.click();
    await this.loggedInuser.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.context().storageState({ path: 'StorageState.json' });
  }

  async cancelLoginAction() {
    await this.closeButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.closeButton.click();
  }

  async closeLoginAction() {
    await this.loginCloseButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.loginCloseButton.click();
  }

  async performSigninWithInvalidCredentials(username, password, expectedAlertMessage) {
    try {
      let alertMessage = '';
      this.page.once('dialog', (dialog) => {
        alertMessage = dialog.message();
        console.log(`Alert message: ${alertMessage}`);
        dialog.accept();
      });
      await this.populateLoginDetails(username, password);
      await this.clickOnLoginSubmit();
      await this.page.waitForTimeout(1000);
      expect(alertMessage).toBe(expectedAlertMessage);
      return alertMessage;
    } catch (error) {
      console.error('Error in performSigninWithInvalidCredentials:', error);
      throw error;
    }
  }

  async performLoginaction(username, password) {
    try {
      console.log(`🔐 Logging in with: ${username} (PASSWORD: ${password ? '***' : 'NOT SET'})`);
      await this.populateLoginDetails(username, password);
      await this.clickOnLoginSubmit();
      await this.loggedInuser.waitFor({ state: 'visible', timeout: 10000 });
      console.log('✓ Login successful');
    } catch (error) {
      console.error('Error in performLoginaction:', error);
      throw error;
    }
  }
}

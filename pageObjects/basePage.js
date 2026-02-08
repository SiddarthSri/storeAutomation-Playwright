import { expect } from '@playwright/test';

export class BasePage {
  constructor(page) {
    this.page = page;
    this.actionTimeout = 2000;
    this.webSiteurl = 'https://www.demoblaze.com/';
  }
  async navigateToDemoBlaze() {
    await this.page.goto(this.webSiteurl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickOnLinkByName(linkName) {
    await this.page.getByRole('link', { name: linkName }).waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.page.getByRole('link', { name: linkName }).click();
  }

  async getPageTitle(expectedTitle) {
    const pageTitle = await this.page.title();
    expect(pageTitle).toBe(expectedTitle);
  }
}

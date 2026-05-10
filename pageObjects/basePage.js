import { expect } from '@playwright/test';

export class BasePage {
  constructor(page) {
    this.page = page;
    this.actionTimeout = 2000;
    this.webSiteurl = process.env.BASEURL || process.env.BASE_URL || 'https://www.demoblaze.com/';
  }

  async navigateToDemoBlaze() {
    await this.page.goto(this.webSiteurl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickOnLinkByName(linkName) {
    const linkLocator = this.page.getByRole('link', { name: linkName, exact: true }).or(this.page.locator('a').filter({ hasText: linkName })).first();
    await linkLocator.waitFor({ state: 'visible', timeout: 10000 });
    await linkLocator.click();
  }

  async getPageTitle(expectedTitle) {
    const pageTitle = await this.page.title();
    expect(pageTitle).toBe(expectedTitle);
  }

  // Robust utility: registers dialog listener FIRST, then clicks, races against timeout.
  async clickWithPollingAndWaitForDialog(locatorToClick, timeoutMs = 10000) {
    return new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout of ${timeoutMs}ms exceeded waiting for dialog`));
      }, timeoutMs);

      this.page.once('dialog', (dialog) => {
        clearTimeout(timer);
        resolve(dialog);
      });

      // Retry clicking until successful or timeout
      const startTime = Date.now();
      while (Date.now() - startTime < timeoutMs) {
        try {
          await locatorToClick.click({ timeout: 1500 });
          break;
        } catch {
          await this.page.waitForTimeout(200);
        }
      }
    });
  }
}

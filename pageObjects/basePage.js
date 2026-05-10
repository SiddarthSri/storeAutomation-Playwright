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
    // Using a longer timeout (10000ms) here because clicking links often depends on network requests (like loading products)
    const linkLocator = this.page.getByRole('link', { name: linkName, exact: true }).or(this.page.locator('a').filter({ hasText: linkName })).first();
    await linkLocator.waitFor({ state: 'visible', timeout: 10000 });
    await linkLocator.click();
  }

  async getPageTitle(expectedTitle) {
    const pageTitle = await this.page.title();
    expect(pageTitle).toBe(expectedTitle);
  }

  // Robust utility using Promise.race and Polling for uncertain UI states
  async clickWithPollingAndWaitForDialog(locatorToClick, timeoutMs = 10000) {
    const dialogPromise = this.page.waitForEvent('dialog');
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout of ${timeoutMs}ms exceeded waiting for dialog`)), timeoutMs);
    });

    const clickAction = async () => {
      // Polling: retry click if element is animating or unstable
      const startTime = Date.now();
      while (Date.now() - startTime < timeoutMs) {
        try {
          await locatorToClick.click({ timeout: 1000 });
          return; // Click succeeded
        } catch (e) {
          // If click fails due to instability, wait and poll again
          await this.page.waitForTimeout(200);
        }
      }
      throw new Error('Failed to click element within timeout');
    };

    // Use Promise.race to ensure we don't hang indefinitely
    const dialog = await Promise.race([
      Promise.all([dialogPromise, clickAction()]).then(([d]) => d),
      timeoutPromise
    ]);

    return dialog;
  }
}

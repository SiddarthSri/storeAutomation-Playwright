import { test as base, expect, request } from '@playwright/test';
import { LandingPage } from '../pageObjects/landingPage';

export const customTest = base.extend({
  authenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const landingPage = new LandingPage(page);
    await landingPage.performLoginaction();
    await context.storageState({ path: 'StorageState.json' });
    await use(context);
    await page.close();
    await context.close();
  },
});
export { expect, request };
import { test as base, expect, request } from '@playwright/test';
import { LandingPage } from '../pageObjects/landingPage';
import dotenv from 'dotenv';
import path from 'path'; 

const envName = process.env.ENV || 'prod'
dotenv.config({ path: path.resolve(process.cwd(), 'environmentFiles',`.env.${envName}`)})

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

  unauthenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await use({ context, page });
    await page.close();
    await context.close();
  },
});
export { expect, request };
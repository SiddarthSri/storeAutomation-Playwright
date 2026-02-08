import { test as base, expect, request } from '@playwright/test';
import { LandingPage } from '../pageObjects/landingPage';
import { BasePage } from '../pageObjects/basePage';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Force load environment variables FIRST
const envName = process.env.ENV || 'prod';
const projectRoot = process.cwd();
const envPath = path.join(projectRoot, 'environmentFiles', `.env.${envName}`);

// override: true forces dotenv to override existing env vars (like Windows USERNAME)
const result = dotenv.config({ path: envPath, override: true });
if (result.error) {
  console.error(`Failed to load .env file:`, result.error);
} else {
  console.log(`Credentials Loaded: ${process.env.USERNAME ? '***' : 'NOT SET'}`);
}

export const customTest = base.extend({
  authenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const landingPage = new LandingPage(page);
    const basePage = new BasePage(page);
    try {
      await basePage.navigateToDemoBlaze();
      await basePage.clickOnLinkByName('Log in');
      await landingPage.performLoginaction(process.env.USERNAME, process.env.PASSWORD);
      await context.storageState({ path: 'StorageState.json' });
      await use(context, page);
    } catch (error) {
      console.error('Error during authenticatedContext setup:', error);
      throw error;
    } finally {
      console.log('Closing page and context in authenticatedContext');
    }
  },
  unauthenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await use(page);
    } catch (error) {
      console.error('Error during unauthenticatedContext setup:', error);
      throw error;
    } finally {
      await context.close();
    }
  },
});
export { expect, request };

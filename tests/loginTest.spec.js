import { test, expect } from '@playwright/test';
import {LandingPage} from '../pageObjects/landingPage';

test('Validate user is able to exit login window using the Cancel button', async ({page})=>{
    const landingPage = new LandingPage(page);
    await landingPage.cancelLoginAction();
    expect(landingPage.loginButton.isVisible()).toBeTruthy();
})

test('Validate user is able to close login window using the x button', async ({page})=>{
    const landingPage = new LandingPage(page);
    await landingPage.closeLoginAction();
    expect(landingPage.loginButton.isVisible()).toBeTruthy();
})

test('Verify that user is able to login successfully on providing correct credentials', async ({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    const landingPage = new LandingPage(page);
    await landingPage.performLoginaction();
    await context.storageState({path: 'StorageState.json'});
    const isVisible = await landingPage.loggedInuser.isVisible();
    
    expect(isVisible).toBeTruthy();
})
const {test, expect} = require('@playwright/test');
const {LandingPage} = require('../pageObjects/landingPage')

test('Validate user is able to exit login window using the Cancel button', async ({page})=>{
    const landingPage = new LandingPage(page);
    await landingPage.cancelLoginAction();
    expect(landingPage.loginButton.isVisible()).toBeTruthy();
})

test.only('Validate user is able to close login window using the x button', async ({page})=>{
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
    expect(landingPage.loggedInuser.isVisible()).toBeTruthy();
})
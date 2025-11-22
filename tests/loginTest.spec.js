import { LandingPage } from '../pageObjects/landingPage';
import { customTest, expect } from '../customFixtures/preTestFixture';

let page;
let landingPage;

customTest.describe('This Block Tests the different flows related to Login, cancellations and Incorrect authentication', () => {
  customTest.beforeEach(async ({ unauthenticatedContext }) => {
    page = await unauthenticatedContext.page;
    landingPage = new LandingPage(page);
  });

  customTest('@regression @loginTests Validate user is able to exit login window using the Cancel button', async () => {
    await customTest.step(' Go on to the Login Window and Cancel it', async () => {
      await landingPage.cancelLoginAction();
    })
    await customTest.step('On returning to the landing page validate that the Login Button is once again visible', async () => {
      const isVisible = await landingPage.loginButton.isVisible();
      expect(isVisible).toBeTruthy();
    })
  })

  customTest('@regression @loginTests Validate user is able to close login window using the x button', async () => {
    await customTest.step('Go to the Login Window and Close it with the X button', async () => {
      await landingPage.closeLoginAction();
    })
    await customTest.step('Once the Login window is Closed, Validate that the Login page is Visible again on the home Window', async () => {
      const isVisible = await landingPage.loginButton.isVisible();
      expect(isVisible).toBeTruthy();
    })
  })

  customTest('@regression @loginTests Verify that user is able to login successfully on providing correct credentials', async () => {
    await customTest.step('Perform the Login Action with the Right Credentials and Store the cookies', async () => {
      await landingPage.performLoginaction();
      await page.context().storageState({ path: 'StorageState.json' });
    })
    await customTest.step('Once the User is actually logged in validate the Logged In User Text is Visible', async () => {
      const isVisible = await landingPage.loggedInuser.isVisible();
      expect(isVisible).toBeTruthy();
    })
  })
})
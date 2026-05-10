import { SignUpPage } from '../pageObjects/signUpPage';
import { customTest, expect } from '../customFixtures/preTestFixture';
import { BasePage } from '../pageObjects/basePage';

let page;
let signUpPage;
let basePage;

customTest.describe('These Tests verify the different flows related to Sign Up', () => {
  customTest.beforeEach(async ({ unauthenticatedContext }) => {
    page = await unauthenticatedContext;
    signUpPage = new SignUpPage(page);
    basePage = new BasePage(page);
  });

  customTest('@regression @signUpTests Validate user is able to close sign up window using the Cancel button', async () => {
    await customTest.step('Navigate to the demoBlaze Website', async () => {
      await basePage.navigateToDemoBlaze();
    });

    await customTest.step('Click on the Sign up Button to open the Sign Up Window', async () => {
      await basePage.clickOnLinkByName('Sign up');
    });

    await customTest.step('Cancel the Sign Up Window', async () => {
      await signUpPage.cancelSignUpAction();
    });
  });

  customTest('@regression @signUpTests Verify that user gets user already exists alert for existing user', async () => {
    await customTest.step('Navigate to the demoBlaze Website', async () => {
      await basePage.navigateToDemoBlaze();
    });

    await customTest.step('Click on the Sign up Button to open the Sign Up Window', async () => {
      await basePage.clickOnLinkByName('Sign up');
    });

    await customTest.step('Perform Sign Up Action with existing credentials and validate alert', async () => {
      // Assuming 'admin' and 'admin' are existing users, or the environment USERNAME
      const existingUser = process.env.APP_USERNAME || 'admin';
      const existingPass = process.env.PASSWORD || 'admin';
      await signUpPage.performSignUpActionAndAcceptAlert(
        existingUser,
        existingPass,
        'This user already exist.'
      );
    });
  });
});

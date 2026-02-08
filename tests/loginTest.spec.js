import { LandingPage } from '../pageObjects/landingPage';
import { customTest, expect } from '../customFixtures/preTestFixture';
import { BasePage } from '../pageObjects/basePage';

let page;
let landingPage;
let basePage;

customTest.describe(
  'These Test are to verify the different flows related to Login, cancellations and Incorrect authentication',
  () => {
    customTest.beforeEach(async ({ unauthenticatedContext }) => {
      page = await unauthenticatedContext;
      landingPage = new LandingPage(page);
      basePage = new BasePage(page);
    });

    customTest(
      '@regression @loginTests Validate user is able to exit login window using the Cancel button',
      async () => {
        await customTest.step('Navigate to the demoBlaze Website', async () => {
          await basePage.navigateToDemoBlaze();
        });

        await customTest.step('Click on the Login Button to open the Login Window', async () => {
          await basePage.clickOnLinkByName('Log in');
        });
        await customTest.step(' Go on to the Login Window and Cancel it', async () => {
          await landingPage.cancelLoginAction();
        });
        await customTest.step(
          'On returning to the landing page validate that the Login Button is once again visible and Logged In user text is not Visible',
          async () => {
            await landingPage.validateLoggedInUser(false);
            await landingPage.validateLoginButtonVisibility(true);
          }
        );
      }
    );

    customTest('@regression @loginTests Validate user is able to close login window using the x button', async () => {
      await customTest.step('Navigate to the demoBlaze Website', async () => {
        await basePage.navigateToDemoBlaze();
      });

      await customTest.step('Click on the Login Button to open the Login Window', async () => {
        await basePage.clickOnLinkByName('Log in');
      });

      await customTest.step('Go to the Login Window and Close it with the X button', async () => {
        await landingPage.closeLoginAction();
      });
      await customTest.step(
        'On returning to the landing page validate that the Login Button is once again visible and Logged In user text is not Visible',
        async () => {
          await landingPage.validateLoggedInUser(false);
          await landingPage.validateLoginButtonVisibility(true);
        }
      );
    });

    customTest(
      '@regression @loginTests Verify that user is able to login successfully on providing correct credentials',
      async () => {
        await customTest.step('Navigate to the demoBlaze Website', async () => {
          await basePage.navigateToDemoBlaze();
          await basePage.getPageTitle('STORE');
        });

        await customTest.step('Click on the Login Button to open the Login Window', async () => {
          await basePage.clickOnLinkByName('Log in');
        });
        await customTest.step('Perform the Login Action with the Right Credentials and Store the cookies', async () => {
          await landingPage.performLoginaction(process.env.USERNAME, process.env.PASSWORD);
        });
        await customTest.step(
          'Once the User is actually logged in validate the Logged In User Text is Visible',
          async () => {
            await landingPage.validateLoggedInUser(true);
            await landingPage.validateLoginButtonVisibility(false);
          }
        );
      }
    );
    customTest(
      '@regression @loginTests Verify that user is not allowed to login when the credentials are incorrect',
      async () => {
        await customTest.step('Navigate to the demoBlaze Website', async () => {
          await basePage.navigateToDemoBlaze();
        });

        await customTest.step('Click on the Login Button to open the Login Window', async () => {
          await basePage.clickOnLinkByName('Log in');
        });

        await customTest.step(
          'Perform Login Action but pass incorrect credentials and validate that the user is not logged in',
          async () => {
            const alertMessage = await landingPage.performSigninWithInvalidCredentials(
              'incorrectUser',
              'incorrectPassword',
              'User does not exist.'
            );
            console.log(`Captured alert: ${alertMessage}`);
            await landingPage.validateLoggedInUser(false);
          }
        );
      }
    );
  }
);

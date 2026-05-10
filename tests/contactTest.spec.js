import { ContactPage } from '../pageObjects/contactPage';
import { customTest, expect } from '../customFixtures/preTestFixture';
import { BasePage } from '../pageObjects/basePage';

let page;
let contactPage;
let basePage;

customTest.describe('These Tests verify the different flows related to Contact', () => {
  customTest.beforeEach(async ({ unauthenticatedContext }) => {
    page = await unauthenticatedContext;
    contactPage = new ContactPage(page);
    basePage = new BasePage(page);
  });

  customTest('@regression @contactTests Validate user is able to send a message successfully', async () => {
    await customTest.step('Navigate to the demoBlaze Website', async () => {
      await basePage.navigateToDemoBlaze();
    });

    await customTest.step('Click on the Contact Link to open the Contact Window', async () => {
      await basePage.clickOnLinkByName('Contact');
    });

    await customTest.step('Fill the contact form and send message', async () => {
      await contactPage.performSendMessageAndAcceptAlert(
        'test@example.com',
        'Test User',
        'This is a test message.',
        'Thanks for the message!!'
      );
    });
  });

  customTest('@regression @contactTests Validate user is able to close contact window using the Cancel button', async () => {
    await customTest.step('Navigate to the demoBlaze Website', async () => {
      await basePage.navigateToDemoBlaze();
    });

    await customTest.step('Click on the Contact Link to open the Contact Window', async () => {
      await basePage.clickOnLinkByName('Contact');
    });

    await customTest.step('Cancel the Contact Window', async () => {
      await contactPage.cancelContactAction();
    });
  });
});

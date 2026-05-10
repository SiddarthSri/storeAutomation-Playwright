import { AboutUsPage } from '../pageObjects/aboutUsPage';
import { customTest, expect } from '../customFixtures/preTestFixture';
import { BasePage } from '../pageObjects/basePage';

let page;
let aboutUsPage;
let basePage;

customTest.describe('These Tests verify the different flows related to About Us', () => {
  customTest.beforeEach(async ({ unauthenticatedContext }) => {
    page = await unauthenticatedContext;
    aboutUsPage = new AboutUsPage(page);
    basePage = new BasePage(page);
  });

  customTest('@regression @aboutUsTests Validate user is able to close About us window using the Cancel button', async () => {
    await customTest.step('Navigate to the demoBlaze Website', async () => {
      await basePage.navigateToDemoBlaze();
    });

    await customTest.step('Click on the About us Link to open the About Us Window', async () => {
      await basePage.clickOnLinkByName('About us');
    });

    await customTest.step('Cancel the About Us Window', async () => {
      await aboutUsPage.cancelAboutUsAction();
    });
  });

  customTest('@regression @aboutUsTests Validate user is able to play the video', async () => {
    await customTest.step('Navigate to the demoBlaze Website', async () => {
      await basePage.navigateToDemoBlaze();
    });

    await customTest.step('Click on the About us Link to open the About Us Window', async () => {
      await basePage.clickOnLinkByName('About us');
    });

    await customTest.step('Click the play video button', async () => {
      await aboutUsPage.clickOnPlayVideo();
      // Added a brief wait to ensure click registers
      await page.waitForTimeout(1000);
    });
  });
});

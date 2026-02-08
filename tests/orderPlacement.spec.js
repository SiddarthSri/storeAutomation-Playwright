import { LandingPage } from '../pageObjects/landingPage';
import { customTest, expect } from '../customFixtures/preTestFixture';
import { BasePage } from '../pageObjects/basePage';

let page;
let landingPage;
let basePage;

customTest.describe('This Block Tests the flow covering adding a particular product to the cart and purchases', () => {
  customTest.beforeEach(async ({ authenticatedContext }) => {
    page = await authenticatedContext.newPage();
    landingPage = new LandingPage(page);
    basePage = new BasePage(page);
  });

  customTest(
    '@regression @cartTests Validate user is able to Select a particular category and view the right product',
    async () => {
      await customTest.step('Navigate to the demoBlaze Website', async () => {
        await basePage.navigateToDemoBlaze();
      });

      await customTest.step('Select the Category Monitors and validate user is Navigated there', async () => {
        await basePage.clickOnLinkByName('Monitors');
      });

      await customTest.step('Validate the product Aria Snapshot', async () => {
        await landingPage.validateProductAriaSnapshot('ASUS Full HD');
      });
    }
  );
});

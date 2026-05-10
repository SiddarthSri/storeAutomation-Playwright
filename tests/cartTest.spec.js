import { LandingPage } from '../pageObjects/landingPage';
import { ProductDetailsPage } from '../pageObjects/productDetailsPage';
import { CartPage } from '../pageObjects/cartPage';
import { customTest, expect } from '../customFixtures/preTestFixture';
import { BasePage } from '../pageObjects/basePage';

let page;
let landingPage;
let productDetailsPage;
let cartPage;
let basePage;

customTest.describe('These Tests verify the different flows related to Cart management', () => {
  customTest.beforeEach(async ({ unauthenticatedContext }) => {
    page = await unauthenticatedContext;
    landingPage = new LandingPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    cartPage = new CartPage(page);
    basePage = new BasePage(page);
  });

  customTest('@regression @cartTests Validate user is able to delete an item from the cart', async () => {
    await customTest.step('Navigate to the demoBlaze Website', async () => {
      await basePage.navigateToDemoBlaze();
    });

    await customTest.step('Add a product to cart', async () => {
      await basePage.clickOnLinkByName('Phones');
      await basePage.clickOnLinkByName('Samsung galaxy s6');
      await productDetailsPage.validateProductName('Samsung galaxy s6');
      await productDetailsPage.clickAddToCartAndAcceptAlert();
    });

    await customTest.step('Navigate to Cart', async () => {
      await basePage.clickOnLinkByName('Cart');
      await cartPage.verifyProductInCart('Samsung galaxy s6');
    });

    await customTest.step('Delete product from cart', async () => {
      await cartPage.deleteProductFromCart('Samsung galaxy s6');
      // Adding a small wait to ensure UI updates
      await page.waitForTimeout(1000);
    });
  });
});

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

customTest.describe('This Block Tests the flow covering adding a particular product to the cart and purchases', () => {
  customTest.beforeEach(async ({ authenticatedContext }) => {
    page = await authenticatedContext.newPage();
    landingPage = new LandingPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    cartPage = new CartPage(page);
    basePage = new BasePage(page);
  });

  customTest(
    '@regression @cartTests Validate user is able to Select a particular category, view product, add to cart and place order',
    async () => {
      await customTest.step('Navigate to the demoBlaze Website', async () => {
        await basePage.navigateToDemoBlaze();
      });

      await customTest.step('Select the Category Monitors and validate user is Navigated there', async () => {
        await basePage.clickOnLinkByName('Monitors');
      });

      await customTest.step('Validate the product Aria Snapshot and click on product', async () => {
        await landingPage.validateProductAriaSnapshot('ASUS Full HD');
        await basePage.clickOnLinkByName('ASUS Full HD');
      });

      await customTest.step('Verify product details and Add to Cart', async () => {
        await productDetailsPage.validateProductName('ASUS Full HD');
        await productDetailsPage.clickAddToCartAndAcceptAlert();
      });

      await customTest.step('Navigate to Cart and verify product', async () => {
        await basePage.clickOnLinkByName('Cart');
        await cartPage.verifyProductInCart('ASUS Full HD');
      });

      await customTest.step('Place Order and fill details', async () => {
        await cartPage.clickPlaceOrder();
        await cartPage.fillPlaceOrderDetails('Test User', 'USA', 'New York', '1234567812345678', '12', '2025');
        await cartPage.clickPurchase();
      });

      await customTest.step('Verify successful purchase', async () => {
        await cartPage.verifyPurchaseSuccess();
      });
    }
  );
});

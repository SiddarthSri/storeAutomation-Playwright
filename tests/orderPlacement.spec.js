import { customTest, expect, request } from "../customFixtures/preTestFixture";

let page;
let landingPage;

customTest(
  "should use authenticated context",
  async ({ authenticatedContext }) => {
    page = await authenticatedContext.page;
    landingPage = new LandingPage(page);
    await page.goto("https://www.demoblaze.com/");
  },
);

import { customTest, expect, request } from '../customFixtures/preTestFixture';

customTest('should use authenticated context', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await page.goto('https://www.demoblaze.com/');
  
});

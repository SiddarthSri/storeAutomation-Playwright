import { test, expect, request } from '../customFixtures/preTestFixture';

test('should use authenticated context', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await page.goto('https://www.demoblaze.com/');
  await page.
});
# Playwright Automation Architecture

This project is built using Playwright with a robust, scalable architecture tailored for e-commerce testing (specifically Demoblaze). The framework is designed to handle flakiness, support parallel execution, and seamlessly integrate API testing with UI testing.

---

## 1. Page Object Model (POM)
The framework heavily utilizes the Page Object Model (POM) design pattern. This decouples the test logic from the UI locators, making the framework highly maintainable. If the UI changes, we only need to update the locators in the Page Object, not the individual tests.

### `BasePage` (`pageObjects/basePage.js`)
- Acts as the parent for all page objects.
- Contains shared methods like `navigateToDemoBlaze()` and `clickOnLinkByName()`.
- Implements a highly robust `clickWithPollingAndWaitForDialog()` utility to gracefully handle flaky dialog events (a known issue with the Demoblaze platform).

### Specific Pages (`cartPage.js`, `landingPage.js`, etc.)
- Contain specific element locators and actions for their respective pages.
- Dependencies on `BasePage` are passed into the constructor (Dependency Injection) to avoid circular dependencies and module import issues.

---

## 2. Custom Fixtures & State Management
We extend Playwright's built-in `test` object with custom fixtures. Fixtures establish an environment for each test, ensuring tests run in isolation and with the correct setup.

### `preTestFixture.js`
- **`unauthenticatedContext`**: Provides a clean, fresh browser context for tests that require a logged-out state (e.g., Signup tests, Invalid Login tests).
- **`authenticatedContext`**: Automatically logs the user in before the test starts.
  - **Storage State**: To optimize test speed, the fixture performs a UI login *once* and saves the session cookies/tokens to `storageState.json`. Subsequent tests using this fixture reuse the `storageState.json` to bypass the login flow entirely, dramatically reducing execution time.

---

## 3. Environment & Configuration Files
We use `dotenv` combined with GitHub Actions to dynamically switch environments without code changes.

### `.env` Files (`environmentFiles/.env.prod`)
- Local development relies on `.env.prod` as the source of truth for credentials and URLs.
- Contains keys like `APP_USERNAME`, `PASSWORD`, `BASE_URL`, and `API_BASE_URL`.
- *Note: We specifically use `APP_USERNAME` to prevent conflicts with the built-in Windows `USERNAME` environment variable.*

### CI/CD (GitHub Actions)
- When running in GitHub Actions, secrets are injected into the workflow directly via the `StoreAutomation.Prod` environment.
- Because we do not use `override: true` in our `dotenv.config`, the GitHub Actions environment variables naturally take precedence over the local `.env` files. This ensures secure, seamless credential injection in CI.

---

## 4. Test Flow & Execution
The test execution flow is designed to be deterministic, fast, and resilient.

1. **Initialization**: Playwright reads `playwright.config.js` and prepares the workers (up to 6 for local parallel execution).
2. **Environment Setup**: The tests load `.env.prod` (or inherit CI secrets) to determine the `BASE_URL` and `APP_USERNAME`.
3. **Fixture Execution**:
   - If a test requests `authenticatedContext`, the fixture checks for a valid `storageState.json`. If missing, it performs a login and saves the state.
   - If a test requests `unauthenticatedContext`, a blank browser context is spawned.
4. **Test Execution**: The test uses Page Objects to interact with the UI or `ApiRegistry` to interact with the backend. Assertions validate the state.
5. **Teardown**: The browser context is closed, and any video/trace artifacts are saved on failure.

---

## 5. API Testing Integration
API testing is fully integrated into the framework, allowing us to hit endpoints directly for setup, teardown, and backend validation alongside UI tests.
- **ApiRegistry (`api/api_Registry.js`)**: Centralizes all API endpoints. It dynamically picks up `API_BASE_URL` from the environment.
- **API Tests (`tests/api_tests/apiTests.spec.js`)**: Utilizes Playwright's `request` context to make API calls to endpoints like `/signup` and `/login` and validate JSON responses directly, ensuring backend stability before the UI is tested.

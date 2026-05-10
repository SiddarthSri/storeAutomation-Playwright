# Playwright Automation Architecture

This project is built using Playwright with a robust, scalable architecture tailored for e-commerce testing (specifically Demoblaze).

## 1. Page Object Model (POM)
The framework heavily utilizes POM to keep tests clean and decouple test logic from UI locators.
- **BasePage (`pageObjects/basePage.js`)**: Contains shared methods like `navigateToDemoBlaze()`, `clickOnLinkByName()`, and a highly robust `clickWithPollingAndWaitForDialog()` utility to gracefully handle flaky dialog events.
- **Specific Pages (`cartPage.js`, `landingPage.js`, etc.)**: Inherit or utilize `BasePage` and contain specific element locators and actions. Dependencies on `BasePage` are injected to avoid circular dependencies and module import issues.

## 2. API Testing & Registry
API testing is fully integrated into the Playwright framework, allowing us to hit endpoints directly for setup, teardown, and backend validation.
- **ApiRegistry (`api/api_Registry.js`)**: Centralizes all API endpoints. It dynamically picks up `API_BASE_URL` from the environment.
- **API Tests (`tests/api_tests/apiTests.spec.js`)**: Utilizes Playwright's `request` context to make API calls to endpoints like `/signup` and `/login` and validate JSON responses.

## 3. Environment & Configuration Management
We use `dotenv` combined with GitHub Actions to seamlessly switch environments without code changes.
- **Local Development**: `.env.prod` acts as the source of truth for local runs (e.g., `APP_USERNAME`, `PASSWORD`, `BASE_URL`, `API_BASE_URL`).
- **CI/CD (GitHub Actions)**: Secrets are injected into the workflow directly (`StoreAutomation.Prod` environment). By omitting `override: true` in `dotenv.config`, GitHub Actions environment variables naturally take precedence over local files.
- **Variable Names**: We specifically use `APP_USERNAME` to prevent conflicts with the built-in Windows `USERNAME` environment variable.

## 4. Custom Fixtures & State Management
- **PreTestFixture (`customFixtures/preTestFixture.js`)**: Sets up authenticated and unauthenticated browser contexts.
- **Storage State**: For authenticated tests, the fixture logs in via the UI once and saves the state to `storageState.json`. Subsequent tests reuse this state to skip the login flow, dramatically speeding up execution time.

## 5. Parallel Execution & Stability
- The suite runs fully parallelized (`fullyParallel: true` in Playwright config).
- Demoblaze's server can occasionally be slow or drop requests. The framework mitigates this by:
  - Using `expect` polling and long timeouts for network-dependent actions.
  - Using a custom polling click method to ensure dialog listeners are attached *before* actions are triggered.

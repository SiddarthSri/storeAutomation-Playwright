# GEMINI / ANTIGRAVITY - Project Guide

This guide serves as the repository-specific instructions and reference manual for Gemini/Antigravity when working on the **Store Automation - Playwright** repository. It outlines the project's tech stack, available commands, architectural structure, and coding guidelines.

---

## 1. Project Overview & Tech Stack
This project is a modern UI & API automation testing suite designed for the [DemoBlaze](https://www.demoblaze.com/) e-commerce platform.

- **Core Framework**: Playwright (v1.54+)
- **Language**: JavaScript (ES Modules, `"type": "module"`)
- **Main Dependencies**: `@playwright/test`, `playwright`, `dotenv`

---

## 2. Key Commands

### Installation & Setup
```bash
# Install Node dependencies
npm install

# Install Playwright browsers and system dependencies
npx playwright install --with-deps
```

### Running Tests
By default, tests load environment variables from `environmentFiles/.env.prod`. You can specify a different environment using the `ENV` variable (e.g., `ENV=qa`).

```bash
# Run all tests (UI + API)
npx playwright test

# Run all tests using a specific environment (e.g., qa)
$env:ENV="qa"; npx playwright test   # PowerShell
ENV=qa npx playwright test            # Bash

# Run tests in interactive UI mode
npx playwright test --ui

# Run a specific test spec file
npx playwright test tests/loginTest.spec.js

# Run tests filtered by tags
npx playwright test --grep @regression
npx playwright test --grep @smoke
npx playwright test --grep @loginTests
```

---

## 3. Architecture & Project Structure

### Folder Layout
- `pageObjects/`: Page Object Model (POM) classes.
- `customFixtures/`: Extended Playwright test fixtures for environment and session state.
- `api/`: API Endpoint registry (`ApiRegistry`).
- `tests/`: UI and API test spec files.
- `environmentFiles/`: Environment configuration templates (`.env.prod`, `.env.qa`).
- `data/`: Test data, including ARIA snapshots.

### Core Architecture Components

#### Page Object Model (POM)
- **BasePage** ([basePage.js](./pageObjects/basePage.js)): Parent class for all page objects. Contains shared helpers (e.g., `navigateToDemoBlaze`, `clickOnLinkByName`, and the polling helper `clickWithPollingAndWaitForDialog`).
- **Dependency Injection**: Dependencies between Page Objects should be passed via constructors rather than import chains to prevent circular dependencies.

#### Custom Fixtures & Session Management
Defined in [preTestFixture.js](./customFixtures/preTestFixture.js):
- **`unauthenticatedContext`**: Spawns a clean, fresh browser context for guest/logged-out actions.
- **`authenticatedContext`**: Performs a UI login *once* to capture cookies/tokens, saving the state to `StorageState.json`, and reuses it for subsequent tests to optimize speed.

#### API Testing Integration
Defined in [api_Registry.js](./api/api_Registry.js):
- Centralizes all endpoints. Reads `process.env.APIHOST` (falls back to `https://api.demoblaze.com`).
- Used to hit endpoints directly for backend assertions and setup/teardown.

---

## 4. Environment Variables
Local development relies on environment files under the `environmentFiles` directory (e.g., `.env.prod`).
- **`APP_USERNAME`**: Used instead of `USERNAME` to prevent collision with Windows system variables.
- **`PASSWORD`**: Password for authentication.
- **`BASEURL`**: Base URL for the frontend UI.
- **`APIHOST`**: Base URL for the backend API endpoints.

*Note: In CI (GitHub Actions), environment variables are injected via secrets and take precedence over local `.env` files.*

---

## 5. Coding Conventions & Best Practices

### Writing Tests
- **Imports**: Always import `customTest` and `expect` from the custom fixtures file (`../customFixtures/preTestFixture`) instead of `@playwright/test`.
- **Nesting**: Wrap test actions in `await customTest.step('Description', async () => { ... })` blocks for readable execution traces.
- **Tagging**: Annotate test names with tags (e.g., `@regression`, `@smoke`, `@aboutUsTests`) to enable targeted test executions.
- **Example Pattern**:
  ```javascript
  import { customTest, expect } from '../customFixtures/preTestFixture';
  import { BasePage } from '../pageObjects/basePage';
  import { CartPage } from '../pageObjects/cartPage';

  customTest.describe('Cart Verification', () => {
    customTest.beforeEach(async ({ unauthenticatedContext }) => {
      // Setup page and Page Objects
    });

    customTest('@regression @cartTests Verify item addition', async ({ page }) => {
      await customTest.step('Navigate to application', async () => {
        // Test step implementation
      });
    });
  });
  ```

### Locators & Interacting with UI
- Avoid inline hardcoded locators in test specs. Add locators as properties or helper methods within the corresponding Page Object class.
- Prefer Playwright's user-facing locators (e.g., `page.getByRole`, `page.getByText`) over CSS/XPath selectors where possible.

### Handling Flakiness & Dialogs
- **Dialogs/Alerts**: The DemoBlaze website generates browser alert/confirm/prompt dialogs. Since Playwright auto-dismisses dialogs, you must register a listener *before* performing the action that triggers the dialog.
- Use `clickWithPollingAndWaitForDialog(locator, timeoutMs)` from `BasePage` to handle flaky clicks that trigger browser dialogs.
- Avoid using arbitrary `page.waitForTimeout(ms)` unless absolutely necessary. Instead, wait for network idle, DOM content loaded, or specific locator states.

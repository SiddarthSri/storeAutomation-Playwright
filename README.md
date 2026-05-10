# Store Automation - Playwright

A modern UI & API automation testing suite built with **Playwright** for testing the [DemoBlaze](https://www.demoblaze.com/) e-commerce platform.

## Overview

This project demonstrates scalable automation best practices by combining robust UI testing with backend API validations.

Key pillars of this framework:
- **Page Object Model (POM)**: Decouples UI locators from test logic.
- **Custom Fixtures**: Automatically manages authenticated and unauthenticated browser states.
- **Environment Management**: Seamlessly transitions from local `.env` files to GitHub Actions secrets.
- **API Integration**: Centralized API registry for hitting backend endpoints directly.

**👉 For a deep dive into the framework's design, read the [Architecture Documentation](./architecture.md).**

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
npm install
npx playwright install --with-deps
```

### Configuration

Populate the empty keys in `environmentFiles/.env.prod` with your credentials and target URLs:
```
APP_USERNAME=your_username
PASSWORD=your_password
BASE_URL=https://www.demoblaze.com/
API_BASE_URL=https://api.demoblaze.com
```
*Note: We use `APP_USERNAME` instead of `USERNAME` to prevent collision with Windows system variables during local execution.*

---

## Running Tests

```bash
# Run all tests (UI + API)
npx playwright test

# Run tests in UI mode (interactive debugging)
npx playwright test --ui

# Run a specific test file
npx playwright test tests/loginTest.spec.js

# Run by tag
npx playwright test --grep @regression
npx playwright test --grep @smoke
```

---

## Project Structure

```
├── api/                  # API endpoints registry (ApiRegistry)
├── pageObjects/          # Page Object classes (BasePage, LandingPage, etc.)
├── tests/                # UI and API test specifications
├── customFixtures/       # Custom Playwright fixtures (Session management)
├── environmentFiles/     # Environment config (.env templates)
├── data/                 # Test data (ARIA snapshots, etc.)
├── architecture.md       # Framework architecture details
└── playwright.config.js  # Playwright configuration
```

---

## CI/CD Pipeline

Tests run automatically on push to `main`/`master` via GitHub Actions (`.github/workflows/playwright.yml`). 

The pipeline uses the `StoreAutomation.Prod` GitHub environment. Secrets (`APP_USERNAME`, `PASSWORD`) and Variables (`BASE_URL`, `API_BASE_URL`) injected by GitHub will automatically override local empty `.env` files, ensuring a secure and seamless CI execution. Test artifacts (reports, traces) are retained for 30 days.

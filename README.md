# Store Automation - Playwright

A modern UI automation testing suite built with **Playwright** for testing the [DemoBlaze](https://www.demoblaze.com/) e-commerce platform.

## Overview

This project demonstrates end-to-end testing best practices including:
- **Page Object Model** for maintainable test code
- **Custom Fixtures** for reusable test setup
- **Environment-based credentials** (.env.prod, .env.qa)
- **Tagged tests** for selective test execution
- **GitHub Actions CI/CD** pipeline

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

Add your credentials to `.env.prod`:
```
USERNAME=your_username
PASSWORD=your_password
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run tests in UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test tests/loginTest.spec.js

# Run by tag
npx playwright test --grep @regression
npx playwright test --grep @smoke
```

## Project Structure

```
├── pageObjects/          # Page Object classes (locators & methods)
├── tests/                # Test specifications
├── customFixtures/       # Custom Playwright fixtures
├── environmentFiles/     # Environment config (.env files)
├── data/                 # Test data
└── playwright.config.js  # Playwright configuration
```

## Test Tags

- `@regression` - Full regression suite
- `@smoke` - Quick smoke tests
- `@loginTests` - Login-specific tests

## CI/CD

Tests run automatically on push to `main`/`master` via GitHub Actions. Reports are archived as artifacts.

## Key Features

✅ Login/logout flows
✅ Invalid credential validation
✅ Dialog/alert handling
✅ Secure credential management
✅ Automatic storage state persistence

---

For detailed setup instructions, see the individual files in `customFixtures/` and `pageObjects/`.

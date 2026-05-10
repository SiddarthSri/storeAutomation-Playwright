# Store Automation - Playwright

A modern UI & API automation testing suite built with **Playwright** for testing the [DemoBlaze](https://www.demoblaze.com/) e-commerce platform.

## Overview

This project demonstrates end-to-end testing best practices including:
- **Page Object Model** for maintainable test code
- **API Testing** integrated seamlessly alongside UI tests
- **Custom Fixtures** for reusable test setup and session management
- **Environment-based configuration** (`.env.prod`) that cleanly hands off to GitHub Actions secrets
- **Tagged tests** for selective test execution
- **GitHub Actions CI/CD** pipeline

See the full architectural breakdown in [architecture.md](./architecture.md).

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

Add your credentials and URLs to `.env.prod`:
```
APP_USERNAME=your_username
PASSWORD=your_password
BASE_URL=https://www.demoblaze.com/
API_BASE_URL=https://api.demoblaze.com
```
*Note: We use `APP_USERNAME` instead of `USERNAME` to prevent collision with Windows system variables.*

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
├── api/                  # API endpoints registry (ApiRegistry)
├── pageObjects/          # Page Object classes (locators & methods)
├── tests/                # UI and API test specifications
├── customFixtures/       # Custom Playwright fixtures (authentication)
├── environmentFiles/     # Environment config (.env templates)
├── data/                 # Test data (ARIA snapshots, etc.)
├── architecture.md       # Framework architecture details
└── playwright.config.js  # Playwright configuration
```

## CI/CD

Tests run automatically on push to `main`/`master` via GitHub Actions (`playwright.yml`). 
The workflow dynamically pulls credentials and base URLs from the `StoreAutomation.Prod` environment secrets in GitHub, overriding any local `.env` values.

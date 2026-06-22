# Store Automation - Playwright

A modern UI & API automation testing suite built with **Playwright** for testing the [DemoBlaze](https://www.demoblaze.com/) e-commerce platform.

## Overview

This project demonstrates scalable automation best practices by combining robust UI testing with backend API validations.

Key pillars of this framework:
- **Page Object Model (POM)**: Decouples UI locators from test logic.
- **Custom Fixtures**: Automatically manages authenticated and unauthenticated browser states.
- **CI/CD & Secret Management**: Integrates with GitHub Actions for automated regression runs while utilizing environment-level secrets to secure sensitive user credentials.
- **API Integration**: Centralized API registry for hitting backend endpoints directly.

** For a deep dive into the framework's design, read the [Architecture Documentation](./architecture.md).**

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

## CI/CD Pipeline & Secret Management

Automated execution is powered by **GitHub Actions** and defined in the workflow file [playwright.yml](./.github/workflows/playwright.yml).

### Execution Rules
- **Triggers**: Runs automatically on any push or pull request to the `main` or `master` branches.
- **Tests Executed**: Runs the regression suite using `npx playwright test --grep @regression`.
- **Reporting**: Generates and uploads the Playwright HTML test report as a build artifact, retained for 30 days.

### Secret & Environment Management
- **Environment Context**: Execution runs in the context of the `StoreAutomation.Prod` GitHub Environment.
- **Secret Injection**: Sensitive credentials such as `APP_USERNAME` and `PASSWORD` are secured as GitHub Actions secrets and injected dynamically as environment variables during runtime.
- **Precedence**: Because variables are injected directly into the shell environment, they take natural precedence over local environment configurations (like `./environmentFiles/.env.prod`) without requiring any manual config edits or risk of leaking credentials in source control.

---

## AI Agent Integration (Gemini / Antigravity)

This repository is optimized for pairing with AI coding agents (specifically Gemini / Antigravity):

### 1. Project Rules & Guidelines (`GEMINI.md`)
The repository includes a [GEMINI.md](./GEMINI.md) project guide that provides the coding style, key commands, Page Object Model (POM) patterns, and conventions. The Gemini agent references this file to ensure that newly written tests and components conform to existing project standards.

### 2. Tailored Browser Agent Skill
A customized workspace-specific skill is configured under **[.agents/skills/browser-agent/](./.agents/skills/browser-agent/)**. This skill enables the AI to act as an autonomous QA and browser automation agent.

#### Workflow & Usage:
1. **Live Validation**: When asked to automate a new feature, the agent starts by running the flow directly on the live DemoBlaze website using `playwright-cli` (or falling back to the configured Playwright MCP server if the CLI fails).
2. **Codebase Inspection**: It inspects the codebase (`pageObjects/` and `tests/`) to check if the scenario is already covered.
3. **Outcome**:
   - **If found**: It terminates the browser and points you to the exact files and methods.
   - **If missing**: It writes the corresponding locator methods in your POM classes and a new spec test file, then executes it to verify it passes.


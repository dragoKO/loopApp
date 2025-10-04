# Paradigm TypeScript Test Automation Framework

This is a TypeScript version of the Paradigm test automation framework, converted from Python/Behave to TypeScript/Cucumber.js with Playwright.

## Project Structure

```
Paradigm-TypeScript/
├── features/
│   ├── demoFeatures/
│   │   └── helpCenterLogInPage.feature    # Feature files
│   ├── steps/
│   │   └── helpCenterLogInSteps.ts        # Step definitions
│   └── support/
│       └── hooks.ts                       # Hooks for setup/teardown
├── pages/
│   └── e360/
│       └── helpCenterLogInPage.ts         # Page Object Models
├── utils/
│   ├── driver.ts                          # WebDriver management
│   ├── configReader.ts                    # Configuration reader
│   └── logger.ts                          # Logging utility
├── resources/
│   └── configuration/
│       └── prod-paradigm.ini              # Configuration file
├── reports/                               # Test reports and artifacts
├── package.json                           # Node.js dependencies
├── tsconfig.json                          # TypeScript configuration
├── cucumber.js                            # Cucumber.js configuration
└── README.md                              # This file
```

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Installation

1. Navigate to the project directory:
   ```bash
   cd Paradigm-TypeScript
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

4. Install Allure commandline tool (optional, for reporting):
   ```bash
   npm install -g allure-commandline
   ```

## Configuration

The framework uses the configuration file at `resources/configuration/prod-paradigm.ini`. You can modify:

- `browserType`: Browser to use (chrome, firefox, safari, chromium, etc.)
- `playwrightVideo`: Enable/disable video recording (ON/OFF)
- `baseUrlPortal`: Base URL for the application under test

## Running Tests

### Basic test execution:
```bash
npm test
```

### Run tests in headed mode (visible browser):
```bash
npm run test:headed
```

### Run tests in debug mode:
```bash
npm run test:debug
```

### Generate and open Allure report:
```bash
npm run report
npm run report:open
```

## Environment Variables

- `CONFIGURATION_PATH`: Override the default configuration file path
- `HEADLESS`: Set to `false` to run tests in headed mode

## Features

- **Page Object Pattern**: Organized page objects for better maintainability
- **Allure Reporting**: Comprehensive test reports with screenshots, videos, and logs
- **Video Recording**: Automatic video recording on test failures
- **Screenshot Capture**: Screenshots captured on test failures
- **Console Log Capture**: Browser console logs captured during test execution
- **Multiple Browser Support**: Chrome, Firefox, Safari, and Chromium
- **TypeScript Support**: Full type safety and IntelliSense support

## Converting from Python/Behave

This TypeScript version maintains the same structure and functionality as the original Python/Behave framework:

- Feature files remain in Gherkin format
- Step definitions converted to TypeScript with Cucumber.js
- Page objects converted to TypeScript classes
- Driver management adapted for Playwright
- Configuration reading adapted for Node.js
- Hooks and reporting adapted for Cucumber.js/Allure

## Differences from Python Version

1. **Language**: TypeScript instead of Python
2. **Test Runner**: Cucumber.js instead of Behave
3. **WebDriver**: Playwright instead of Playwright Python
4. **Configuration**: Custom INI parser instead of configparser
5. **Logging**: Winston instead of Python logging
6. **Reporting**: allure-cucumberjs instead of allure-behave

## Troubleshooting

1. **Browser not found**: Run `npx playwright install` to install browsers
2. **Allure not found**: Install globally with `npm install -g allure-commandline`
3. **Configuration errors**: Check the INI file format and path
4. **TypeScript errors**: Ensure all dependencies are installed and tsconfig.json is correct

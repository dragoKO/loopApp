# App TypeScript Test Automation Framework

A clean, JSON-driven test automation framework built with TypeScript and Playwright for testing web applications.

## Overview

This framework uses JSON test scenarios to drive test execution, eliminating code repetition and providing a maintainable approach to test automation. Tests are executed using Page Object Model (POM) pattern for better organization and reusability.

## Project Structure

```
App-TypeScript/
├── test-data/
│   └── test-scenarios.json          # JSON test scenarios
├── pages/
│   └── app/
│       ├── logInPage.ts             # Consolidated page object with login and task verification
│       └── basePage.ts              # Base page object for navigation
├── utils/
│   ├── driver.ts                    # Playwright driver management
│   ├── configReader.ts              # Configuration reader
│   └── logger.ts                    # Logging utility
├── resources/
│   └── configuration/
│       └── prod-app.ini             # Application configuration
├── test-runner.ts                   # Main test execution engine
├── run-json-tests.ts                # Test entry point
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
```

## Prerequisites

- Node.js (version 16 or higher)
- npm

## Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd App-TypeScript
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Configuration

Edit `resources/configuration/prod-app.ini` to configure your test environment:

```ini
[UI]
browserType=chromiumGUI
playwrightVideo=ON
baseUrlPortal=https://animated-gingersnap-8cf7f2.netlify.app
email=admin
password=password123
```

## Running Tests

Execute all test scenarios:
```bash
npm test
```

## Test Scenarios

Test scenarios are defined in `test-data/test-scenarios.json`. Each test case includes:

- **Login**: Authenticate with the application
- **Navigation**: Navigate to specific sections (Web Application, Mobile Application)
- **Verification**: Verify tasks exist in specified columns (To Do, In Progress, Done)
- **Tag Confirmation**: Validate task tags (Feature, Bug, Design, High Priority)

### Example Test Scenario

```json
{
  "id": "test-case-1",
  "name": "Authentication Feature Test",
  "steps": [
    {
      "action": "logInToDemoApp",
      "appName": "Demo App"
    },
    {
      "action": "navigateToWebApplication",
      "section": "Web Application"
    },
    {
      "action": "verifyItemsInSection",
      "todoText": "Implement user authentication",
      "columnName": "toDo"
    },
    {
      "action": "confirmTags",
      "section": "Web Application",
      "columnName": "toDo",
      "taskName": "Implement user authentication",
      "tags": ["Feature", "High Priority"]
    }
  ]
}
```

## Framework Features

- **JSON-Driven**: Test scenarios defined in JSON for easy maintenance
- **Page Object Model**: Organized page objects for better code reusability
- **Test Isolation**: Fresh browser instance for each test case
- **TypeScript**: Full type safety and IntelliSense support
- **Playwright**: Modern web automation with Chromium support
- **Console Logging**: Clear test execution logs with timestamps
- **Configuration Management**: Centralized configuration via INI files
- **Clean Architecture**: Streamlined codebase with minimal dependencies

## Adding New Test Cases

1. Open `test-data/test-scenarios.json`
2. Add a new test case object with:
   - Unique ID and name
   - Required steps (login, navigation, verification, tag confirmation)
3. Run tests with `npm test`

## Supported Actions

- `logInToDemoApp`: Authenticate with the application
- `navigateToWebApplication`: Navigate to Web Application section
- `navigateToMobileApplication`: Navigate to Mobile Application section
- `verifyItemsInSection`: Verify task exists in specified column
- `confirmTags`: Validate task tags match expected values

## Page Object Model

The framework uses a consolidated Page Object Model approach:

- **LogInPage**: Consolidated page object handling authentication, task verification, and tag confirmation
- **BasePage**: Handles navigation between application sections
- **Driver**: Centralized browser and context management
- **ConfigReader**: Configuration file management
- **Logger**: Structured logging with timestamps

## Troubleshooting

1. **Browser not found**: Run `npx playwright install`
2. **Configuration errors**: Verify `prod-app.ini` format and credentials
3. **TypeScript errors**: Ensure all dependencies are installed
4. **Test failures**: Check application availability and element selectors
5. **Network issues**: Verify internet connection and demo app accessibility

## License

This project is part of the App test automation framework.
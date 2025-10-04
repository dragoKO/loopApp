import * as fs from 'fs';
import { Driver } from './utils/driver';
import { LogInPage } from './pages/app/logInPage';
import { ConfigReader } from './utils/configReader';
import { logger } from './utils/logger';

interface TestStep {
  action: string;
  description: string;
  value?: string;
  expectedMessage?: string;
}

interface TestCase {
  id: string;
  name: string;
  description: string;
  priority: string;
  tags?: string[];
  steps: TestStep[];
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  testCases: TestCase[];
}

export class TestRunner {
  private testSuites: TestSuite[] = [];

  constructor(testDataPath: string) {
    this.loadTestData(testDataPath);
  }

  private loadTestData(testDataPath: string): void {
    try {
      const data = fs.readFileSync(testDataPath, 'utf8');
      const jsonData = JSON.parse(data);
      this.testSuites = jsonData.testSuites;
      logger.info(`Loaded ${this.testSuites.length} test suites`);
    } catch (error) {
      logger.error(`Failed to load test data: ${error}`);
      throw error;
    }
  }

  public async runAllTests(): Promise<void> {
    for (const suite of this.testSuites) {
      logger.info(`Running test suite: ${suite.name}`);
      for (const testCase of suite.testCases) {
        await this.runTestCase(suite, testCase);
      }
    }
    await Driver.close();
  }

  private async runTestCase(suite: TestSuite, testCase: TestCase): Promise<void> {
    logger.info(`Running test case: ${testCase.name}`);

    try {
      for (let i = 0; i < testCase.steps.length; i++) {
        const step = testCase.steps[i];
        logger.info(`Executing step ${i + 1}: ${step.description}`);

        try {
          await this.executeStep(step);
          logger.info(`Step ${i + 1} passed`);
        } catch (stepError: any) {
          logger.error(`Step ${i + 1} failed: ${stepError.message}`);
          throw stepError; // Stop executing further steps for this test case
        }
      }
      logger.info(`Test case ${testCase.name} completed successfully`);
    } catch (error: any) {
      logger.error(`Test case ${testCase.name} failed: ${error.message}`);
      throw error;
    }
  }

  private async executeStep(step: TestStep): Promise<void> {
    const loginPage = new LogInPage();

    switch (step.action) {
      case 'navigateToLoginPage':
        await loginPage.navigateToLoginPage();
        break;
      case 'fillUsername':
        if (step.value) {
          const username = step.value.includes('ConfigReader') ? 
            ConfigReader.getConfigValue('email') : step.value;
          await loginPage.fillUsername(username);
        }
        break;
      case 'fillPassword':
        if (step.value) {
          const password = step.value.includes('ConfigReader') ? 
            ConfigReader.getConfigValue('password') : step.value;
          await loginPage.fillPassword(password);
        }
        break;
      case 'clickLoginButton':
        await loginPage.clickLoginButton();
        break;
      case 'verifySuccessfulLogin':
        // Wait for page to load and check if we're on a different page (successful login)
        const page = await Driver.getPage();
        await page.waitForTimeout(2000); // Wait for redirect
        
        const currentUrl = page.url();
        // Check if URL changed from login page (successful login)
        if (currentUrl.includes('/login') || currentUrl.includes('signin')) {
          throw new Error(`Login failed - still on login page. Current URL: ${currentUrl}`);
        }
        break;
      default:
        throw new Error(`Unknown action: ${step.action}`);
    }
  }

}
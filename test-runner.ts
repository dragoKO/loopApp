import * as fs from 'fs';
import { Driver } from './utils/driver';
import { LogInPage } from './pages/app/logInPage';
import { ConfigReader } from './utils/configReader';
import { logger } from './utils/logger';
import { expect } from '@playwright/test';
import { BasePage } from './pages/app/basePage';

interface TestStep {
  action: string;
  section?: string;
  taskName?: string;
  todoText?: string;
  columnName?: string;
  tags?: string[];
  appName?: string;
}

interface TestCase {
  id: string;
  name: string;
  steps: TestStep[];
}

interface TestSuite {
  id: string;
  name: string;
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
  }

  private async runTestCase(suite: TestSuite, testCase: TestCase): Promise<void> {
    logger.info(`Running: ${testCase.name}`);
    
    // Create new driver instance for this test case
    await Driver.createContext();

    try {
      for (let i = 0; i < testCase.steps.length; i++) {
        const step = testCase.steps[i];
        logger.info(`Step ${i + 1}: ${step.action}`);

        await this.executeStep(step);
        logger.info(`Step ${i + 1} completed`);
      }
      
      logger.info(`${testCase.name} completed`);
    } finally {
      // Always close the driver instance after test case completion
      await Driver.close();
    }
  }

  private async executeStep(step: TestStep): Promise<void> {
    const loginPage = new LogInPage();
    const basePage = new BasePage();

    switch (step.action) {
      case 'logInToDemoApp':
        await loginPage.navigateToLoginPage();
        await loginPage.fillUsername(ConfigReader.getConfigValue('email'));
        await loginPage.fillPassword(ConfigReader.getConfigValue('password'));
        await loginPage.clickLoginButton();
        break;
      case 'navigateToWebApplication':
        await basePage.navigateTo('Web Application');
        break;
      case 'navigateToMobileApplication':
        await basePage.navigateTo('Mobile Application');
        break;
      case 'verifyItemsInSection':
        const tasksList = await loginPage.getAllTasksForSections(step.columnName!);
        expect(tasksList).toContain(step.todoText);
        break;
      case 'confirmTags':
        const tags = await loginPage.getTaskTags(step.columnName!, step.taskName!);
        expect(tags).toEqual(expect.arrayContaining(step.tags!));
        break;
      default:
        throw new Error(`Unknown action: ${step.action}`);
    }
  }

}
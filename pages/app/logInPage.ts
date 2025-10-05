import { Page, Locator } from '@playwright/test';
import { Driver } from '../../utils/driver';
import { ConfigReader } from '../../utils/configReader';

export class LogInPage {
    private page: Page;

    // Page Object Model - All locators defined here
    private readonly locators = {
        usernameInput: '#username',
        passwordInput: '#password',
        signInButton: '//button',
        toDoDiv: "(//div[@class='flex flex-col w-80 bg-gray-50 rounded-lg p-4'])[1]",
        inProgressDiv: "(//div[@class='flex flex-col w-80 bg-gray-50 rounded-lg p-4'])[2]",
        reviewDiv: "(//div[@class='flex flex-col w-80 bg-gray-50 rounded-lg p-4'])[3]",
        doneDiv: "(//div[@class='flex flex-col w-80 bg-gray-50 rounded-lg p-4'])[4]",
    };

    constructor() {
        this.page = null as any; // Will be initialized in async methods
    }

    private async getPage(): Promise<Page> {
        if (!this.page) {
            this.page = await Driver.getPage();
        }
        return this.page;
    }

    // Essential POM Methods
    async navigateToLoginPage(): Promise<void> {
        const page = await this.getPage();
        await page.goto(LogInPage.getEndpoint());
    }

    async fillUsername(username: string): Promise<void> {
        const page = await this.getPage();
        await page.locator(this.locators.usernameInput).fill(username);
    }

    async fillPassword(password: string): Promise<void> {
        const page = await this.getPage();
        await page.locator(this.locators.passwordInput).fill(password);
    }

    async clickLoginButton(): Promise<void> {
        const page = await this.getPage();
        await page.locator(this.locators.signInButton).click();
    }

    static getEndpoint(): string {
        return `${ConfigReader.getConfigValue('baseUrlPortal')}/`;
    }

    // Web Application functionality
    private getDivLocator(sectionName: string): string {
        switch (sectionName.toLowerCase()) {
            case 'todo':
                return this.locators.toDoDiv;
            case 'inprogress':
                return this.locators.inProgressDiv;
            case 'review':
                return this.locators.reviewDiv;
            case 'done':
                return this.locators.doneDiv;
            default:
                throw new Error(`Unknown section: ${sectionName}`);
        }
    }

    async getAllTasksForSections(sectionName: string): Promise<string[]> {
        const page = await this.getPage();
        const divLocator = this.getDivLocator(sectionName);
        const div = page.locator(divLocator);
        const h3Elements = await div.locator('h3').allTextContents();
        return h3Elements;
    }
  
    async getTaskByTitle(sectionName: string, taskTitle: string): Promise<Locator> {
        const page = await this.getPage();
        const divLocator = this.getDivLocator(sectionName);
        const sectionDiv = page.locator(divLocator);
        const taskCard = sectionDiv.locator(`//div[contains(@class, 'bg-white') and .//h3[normalize-space(.)='${taskTitle}']]`);
        return taskCard;
    }

    async getTaskTags(sectionName: string, taskTitle: string): Promise<string[]> {
        const taskCard = await this.getTaskByTitle(sectionName, taskTitle);
        const tagSpans = taskCard.locator(
          `//h3/following-sibling::div[contains(@class,'flex-wrap') and contains(@class,'gap-2')][1]//span`
        );
        const texts = await tagSpans.allTextContents();
        return texts.map(t => t.trim()).filter(Boolean);
    }
}

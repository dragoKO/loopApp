import { Page } from '@playwright/test';
import { Driver } from '../../utils/driver';
import { ConfigReader } from '../../utils/configReader';

export class LogInPage {
    private page: Page;

    // Page Object Model - All locators defined here
    private readonly locators = {
        usernameInput: '#username',
        passwordInput: '#password',
        signInButton: '//button'
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
        await page.waitForLoadState('networkidle');
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
}

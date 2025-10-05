import { Page } from '@playwright/test';
import { Driver } from '../../utils/driver';

export class BasePage{
    private page: Page;

    constructor() {
        this.page = null as any;
    }

    private async getPage(): Promise<Page> {
        if (!this.page) {
            this.page = await Driver.getPage();
        }
        return this.page;
    }
    async navigateTo(sectionName: string): Promise<void> {
        const page = await this.getPage();
        const webAppButton = page.locator(`xpath=//button[.//h2[normalize-space(text())='${sectionName}']]`);
        await webAppButton.click();
    }
}
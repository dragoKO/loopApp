import { chromium, Browser, BrowserContext, Page, BrowserType } from '@playwright/test';
import { ConfigReader } from './configReader';

export class Driver {
    private static playwrightInstance: any = null;
    private static browserInstance: Browser | null = null;
    private static contextInstance: BrowserContext | null = null;
    private static pageInstance: Page | null = null;

    static async startPlaywright(): Promise<void> {
        if (Driver.playwrightInstance === null) {
            const { chromium: chromiumPlaywright } = await import('playwright');
            Driver.playwrightInstance = chromiumPlaywright;
        }
    }

    static async launchBrowser(): Promise<void> {
        if (Driver.browserInstance === null) {
            await Driver.startPlaywright();

            const browserType = ConfigReader.getConfigValue('browserType').toLowerCase();
            let browserLauncher: BrowserType<{}>;

            const driverArgs = [
                '--no-sandbox',
                '--start-fullscreen',
                '--kiosk',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--force-device-scale-factor=1.5',
                '--high-dpi-support=1',
                '--force-color-profile=srgb',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--app=about:blank',
            ];

            switch (browserType) {
                case 'chromium':
                case 'chromiumgui':
                    browserLauncher = chromium;
                    Driver.browserInstance = await browserLauncher.launch({
                        headless: browserType === 'chromium',
                        args: driverArgs
                    });
                    break;
                default:
                    throw new Error(`Unsupported browser type: ${browserType}`);
            }
        }
    }

    static async createContext(): Promise<void> {
        if (Driver.contextInstance === null) {
            await Driver.launchBrowser();

            const contextArgs: any = {
                ignoreHTTPSErrors: true,
                viewport: null,
            };

            Driver.contextInstance = await Driver.browserInstance!.newContext(contextArgs);
            await Driver.contextInstance.grantPermissions(['clipboard-read', 'clipboard-write']);
        }
    }

    static getContext(): BrowserContext | null {
        return Driver.contextInstance;
    }

    static async getPage(): Promise<Page> {
        try {
            if (Driver.pageInstance) {
                await Driver.pageInstance.title();
                return Driver.pageInstance;
            }
        } catch {
            Driver.pageInstance = null;
        }

        await Driver.createContext();
        Driver.pageInstance = await Driver.contextInstance!.newPage();

        // Set page to full screen and zoom content
        try {
            // Force full screen with multiple methods
            await Driver.pageInstance.evaluate(`
                () => {
                    // Method 1: Request fullscreen
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    }
                    // Method 2: Webkit fullscreen
                    else if (document.documentElement.webkitRequestFullscreen) {
                        document.documentElement.webkitRequestFullscreen();
                    }
                    // Method 3: Mozilla fullscreen
                    else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    }
                    // Method 4: MS fullscreen
                    else if (document.documentElement.msRequestFullscreen) {
                        document.documentElement.msRequestFullscreen();
                    }
                }
            `);
            // Add CSS zoom to make content larger
            await Driver.pageInstance.addStyleTag({ content: 'body { zoom: 1.25; }' });
        } catch {
            // Ignore if fullscreen is not supported or fails
        }

        return Driver.pageInstance;
    }

    static async goTo(endpoint: string): Promise<void> {
        const page = await Driver.getPage();
        await page.goto(endpoint);
    }

    static async close(): Promise<void> {
        const attributes = ['pageInstance', 'contextInstance', 'browserInstance', 'playwrightInstance'];
        
        for (const attr of attributes) {
            const obj = (Driver as any)[attr];
            if (obj) {
                try {
                    if (typeof obj.close === 'function') {
                        await obj.close();
                    } else if (typeof obj.stop === 'function') {
                        await obj.stop();
                    }
                } catch {
                    // Ignore errors during cleanup
                }
                (Driver as any)[attr] = null;
            }
        }
    }
}

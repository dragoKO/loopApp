import * as fs from 'fs';
import * as path from 'path';

export class ConfigReader {
    private static config: any = null;

    static getConfigValue(key: string, section: string = 'UI', configPath?: string): string {
        if (ConfigReader.config === null) {
            ConfigReader.loadConfig(configPath);
        }
        
        return ConfigReader.config[section][key];
    }

    private static loadConfig(configPath?: string): void {
        let configFile = process.env.CONFIGURATION_PATH;
        
        if (!configFile) {
            if (configPath) {
                configFile = configPath;
            } else {
                // Fallback to default
                configFile = path.join(
                    __dirname,
                    '..', 'resources', 'configuration', 'prod-app.ini'
                );
            }
        }

        if (!fs.existsSync(configFile)) {
            throw new Error(`Configuration file not found: ${configFile}`);
        }

        // Parse INI file manually since we don't have configparser in Node.js
        const configContent = fs.readFileSync(configFile, 'utf-8');
        ConfigReader.config = ConfigReader.parseIniFile(configContent);
    }

    private static parseIniFile(content: string): any {
        const lines = content.split('\n');
        const config: any = {};
        let currentSection = '';

        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Skip empty lines and comments
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                continue;
            }

            // Section header
            if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
                currentSection = trimmedLine.slice(1, -1);
                config[currentSection] = {};
                continue;
            }

            // Key-value pair
            const equalIndex = trimmedLine.indexOf('=');
            if (equalIndex > 0 && currentSection) {
                const key = trimmedLine.substring(0, equalIndex).trim();
                const value = trimmedLine.substring(equalIndex + 1).trim();
                config[currentSection][key] = value;
            }
        }

        return config;
    }
}

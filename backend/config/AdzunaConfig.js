import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });

/**
 * Dedicated Configuration Class for Adzuna Jobs API.
 * Follows Dependency Injection principle.
 */
export class AdzunaConfig {
  constructor() {
    this.appId = process.env.ADZUNA_APP_ID || '';
    this.appKey = process.env.ADZUNA_APP_KEY || '';
    this.country = process.env.ADZUNA_COUNTRY || 'in';
  }

  getAppId() {
    return this.appId ? this.appId.trim() : '';
  }

  getAppKey() {
    return this.appKey ? this.appKey.trim() : '';
  }

  getCountry() {
    return this.country ? this.country.trim().toLowerCase() : 'in';
  }

  isConfigured() {
    return Boolean(this.getAppId() && this.getAppKey());
  }

  getSearchUrl() {
    const country = this.getCountry();
    return `https://api.adzuna.com/v1/api/jobs/${country}/search/1`;
  }
}

export const adzunaConfig = new AdzunaConfig();
export default adzunaConfig;

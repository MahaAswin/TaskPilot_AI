import axios from 'axios';

/**
 * Client executing STRICT LIVE Adzuna API Requests.
 * MOCK DATA AND PLACEHOLDER JOBS ARE STRICTLY PROHIBITED.
 */
export class AdzunaClient {
  /**
   * Searches live jobs via Adzuna API.
   * @param {Object} config - Instance of AdzunaConfig
   * @param {{ role: string, skills: string[], location: string }} searchParams
   * @returns {Promise<{ jobs: Array, available: boolean, reason?: string }>}
   */
  static async searchJobs(config, { role = 'Software Engineer', skills = [], location = 'Remote' }) {
    if (!config || !config.isConfigured()) {
      console.warn('[AdzunaClient] ADZUNA_APP_ID or ADZUNA_APP_KEY unconfigured. Strict Live API Policy: Returning 0 jobs.');
      return {
        jobs: [],
        available: false,
        reason: 'Adzuna API credentials (ADZUNA_APP_ID / ADZUNA_APP_KEY) are unconfigured in .env. Please configure credentials to fetch live job listings.'
      };
    }

    const queryTerm = [role, ...skills.slice(0, 2)].filter(Boolean).join(' ');
    const url = config.getSearchUrl();

    let attempts = 0;
    const maxAttempts = 2; // 1 initial + 1 retry

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await axios.get(url, {
          params: {
            app_id: config.getAppId(),
            app_key: config.getAppKey(),
            results_per_page: 15,
            what: queryTerm,
            where: location !== 'Remote' ? location : ''
          },
          timeout: 5000 // 5s timeout
        });

        if (response.data && Array.isArray(response.data.results)) {
          const results = response.data.results;
          if (results.length === 0) {
            return {
              jobs: [],
              available: fontAvailableCheck(results),
              reason: 'No active jobs found matching your search parameters on Adzuna.'
            };
          }

          // Normalize ONLY live fields returned directly by Adzuna API
          const jobs = results.map(j => {
            const hasMin = typeof j.salary_min === 'number';
            const hasMax = typeof j.salary_max === 'number';

            let salaryDisplay = 'Salary Not Specified';
            if (hasMin && hasMax) {
              const minL = (j.salary_min / 100000).toFixed(1);
              const maxL = (j.salary_max / 100000).toFixed(1);
              salaryDisplay = `₹${minL}L - ₹${maxL}L / yr`;
            } else if (hasMin) {
              salaryDisplay = `₹${(j.salary_min / 100000).toFixed(1)}L+ / yr`;
            }

            return {
              id: String(j.id || Math.random()),
              title: j.title || 'Role Title Not Specified',
              company: j.company?.display_name || 'Company Not Specified',
              location: j.location?.display_name || location || 'Location Not Specified',
              salaryMin: hasMin ? j.salary_min : null,
              salaryMax: hasMax ? j.salary_max : null,
              salaryDisplay,
              description: j.description || 'No description provided.',
              employmentType: j.contract_type ? (j.contract_type === 'permanent' ? 'Full Time' : j.contract_type) : 'Full Time',
              redirectUrl: j.redirect_url || '#',
              companyLogo: '',
              createdDate: j.created ? new Date(j.created).toLocaleDateString() : 'Recently'
            };
          });

          return { jobs, available: true };
        }
      } catch (err) {
        console.warn(`[AdzunaClient] Attempt ${attempts}/${maxAttempts} failed: ${err.message}`);
      }
    }

    return {
      jobs: [],
      available: false,
      reason: 'Unable to retrieve live jobs from Adzuna API. Server or network error.'
    };
  }
}

function fontAvailableCheck(arr) {
  return true;
}

export default AdzunaClient;


import { PlaidApi, Configuration } from 'plaid';

// IMPORTANT: Never commit your Plaid secrets to version control.
// Use environment variables. The variables below are placeholders and will not work.
// You need to get your own from your Plaid dashboard: https://dashboard.plaid.com/team/keys

const plaidConfig = new Configuration({
  basePath: process.env.PLAID_BASE_PATH || '',
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
      'PLAID-SECRET': process.env.PLAID_SECRET || '',
    },
  },
});

export const plaidClient = new PlaidApi(plaidConfig);

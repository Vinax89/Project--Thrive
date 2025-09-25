import "server-only";
import { PlaidApi, Configuration } from 'plaid';

// IMPORTANT: Never commit your Plaid secrets to version control.
// Use environment variables. You need to get your own from your Plaid dashboard: https://dashboard.plaid.com/team/keys

const plaidConfig = new Configuration({
  basePath: process.env.PLAID_BASE_PATH,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});


declare global {
  var plaid: PlaidApi | undefined;
}

export const plaidClient = global.plaid || new PlaidApi(plaidConfig);

if (process.env.NODE_ENV !== 'production') global.plaid = plaidClient;

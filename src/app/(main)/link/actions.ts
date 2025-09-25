
"use server";

import { plaidClient } from "@/lib/plaid";
import { Products, CountryCode } from "plaid";

// This is a server action that simulates creating a link token.
// In a real application, you would have a user context here.
export async function createLinkToken(): Promise<string | null> {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        // This is a unique identifier for the user.
        client_user_id: 'user-id-placeholder',
      },
      client_name: 'Project: Thrive',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    });
    return response.data.link_token;
  } catch (error) {
    console.error("Error creating Plaid link token:", error);
    return null;
  }
}

// This is a server action that simulates exchanging a public token for an access token.
// In a real application, you would store the access_token and item_id securely.
export async function exchangePublicToken(publicToken: string) {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        // In a real app, you would securely store these!
        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        console.log("Access Token (do not log in prod!):", accessToken);
        console.log("Item ID:", itemId);

        return { success: true, message: "Public token exchanged."};

    } catch (error) {
        console.error("Error exchanging public token:", error);
        return { success: false, message: "Could not exchange public token."};
    }
}

"use server";

import { getFirebaseAdmin } from "@/firebase/admin";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  type DocumentData,
} from "firebase-admin/firestore";

export type FormState = {
  message: string;
  jsonData?: string;
  error?: boolean;
};

// This server action will fetch all data for the user and return it as a JSON string.
export async function exportDataAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = formData.get("userId");

  if (typeof userId !== "string") {
    return {
      message: "User ID is missing or invalid.",
      error: true,
    };
  }

  try {
    const { firestore } = getFirebaseAdmin();

    const collectionsToExport = [
      "transactions",
      "debts",
      "budgetCategories",
      "investments",
      "alerts",
    ];
    
    const allData: Record<string, any> = {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
    };

    // Fetch user profile
    const userDocRef = doc(firestore, `users/${userId}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        allData.profile = userDoc.data();
    }

    // Fetch sub-collections
    for (const collectionName of collectionsToExport) {
      const collRef = collection(firestore, `users/${userId}/${collectionName}`);
      const snapshot = await getDocs(collRef);
      allData[collectionName] = snapshot.docs.map((d) => d.data());
    }

    return {
      message: "Data successfully generated.",
      jsonData: JSON.stringify(allData, null, 2),
    };
  } catch (error) {
    console.error("Error exporting data:", error);
    return {
      message: "An unexpected error occurred while exporting your data.",
      error: true,
    };
  }
}

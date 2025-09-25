
"use server";

import { z } from "zod";
import {
  processReceipt,
  type ReceiptOcrInput,
} from "@/ai/flows/receipt-ocr-flow";
import { revalidatePath } from "next/cache";

const FormSchema = z.object({
  receiptImage: z.string().min(1, "Please upload an image."),
});

export type FormState = {
  message: string;
  vendor?: string;
  date?: string;
  total?: number;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function processReceiptAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    receiptImage: formData.get("receiptImage"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please upload an image.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const input: ReceiptOcrInput = validatedFields.data;
    const result = await processReceipt(input);

    if (result) {
      revalidatePath('/transactions');
      return {
        message: "Success! Receipt processed.",
        vendor: result.vendor,
        date: result.date,
        total: result.total,
      };
    } else {
        return { message: "The AI could not process the receipt. Please try again." };
    }
  } catch (error) {
    console.error("Error processing receipt:", error);
    return { message: "An unexpected error occurred. Please try again later." };
  }
}

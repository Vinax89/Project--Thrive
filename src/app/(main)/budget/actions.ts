"use server";

import { z } from "zod";
import {
  envelopeBudgeting,
  type EnvelopeBudgetingInput,
} from "@/ai/flows/envelope-budgeting";

const FormSchema = z.object({
  income: z.coerce.number(),
  expenses: z.string(),
  priorDebts: z.string(),
});

export type FormState = {
  message: string;
  suggestedAllocations?: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function getEnvelopeBudgetAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    income: formData.get("income"),
    expenses: formData.get("expenses"),
    priorDebts: formData.get("priorDebts"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const input: EnvelopeBudgetingInput = validatedFields.data;
    const result = await envelopeBudgeting(input);

    if (result && result.suggestedAllocations) {
      return {
        message: "Success! Your budget suggestions are ready.",
        suggestedAllocations: result.suggestedAllocations,
      };
    } else {
      return { message: "The AI could not generate suggestions. Please try again." };
    }
  } catch (error) {
    console.error("Error generating budget:", error);
    return { message: "An unexpected error occurred. Please try again later." };
  }
}

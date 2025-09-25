
"use server";

import { z } from "zod";
import {
  getFinancialEducationContent,
  type FinancialEducationInput,
} from "@/ai/flows/ai-powered-financial-education";

const FormSchema = z.object({
  income: z.coerce.number(),
  debts: z.string(),
  expenses: z.string(),
  savings: z.coerce.number(),
  financialGoals: z.string().min(10, "Please describe your financial goals in a bit more detail."),
});

export type FormState = {
  message: string;
  suggestedContent?: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function getFinancialEducationContentAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    income: formData.get("income"),
    debts: formData.get("debts"),
    expenses: formData.get("expenses"),
    savings: formData.get("savings"),
    financialGoals: formData.get("financialGoals"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const input: FinancialEducationInput = validatedFields.data;
    const result = await getFinancialEducationContent(input);

    if (result && result.suggestedContent) {
      return {
        message: "Success! Your content is ready.",
        suggestedContent: result.suggestedContent,
      };
    } else {
        return { message: "The AI could not generate content. Please try again." };
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return { message: "An unexpected error occurred. Please try again later." };
  }
}

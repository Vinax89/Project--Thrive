
"use server";

import { z } from "zod";
import {
  aiCashFlowAdvisor,
  type AICashFlowAdvisorInput,
} from "@/ai/flows/ai-cash-flow-advisor";

const FormSchema = z.object({
  income: z.coerce.number(),
  expenses: z.coerce.number(),
  debts: z.coerce.number(),
  savings: z.coerce.number(),
  spendingHabits: z.string(),
});

export type FormState = {
  message: string;
  insights?: string;
  suggestions?: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function getCashFlowAdviceAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    income: formData.get("income"),
    expenses: formData.get("expenses"),
    debts: formData.get("debts"),
    savings: formData.get("savings"),
    spendingHabits: formData.get("spendingHabits"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Not enough data to provide advice.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const input: AICashFlowAdvisorInput = validatedFields.data;
    const result = await aiCashFlowAdvisor(input);

    if (result && result.insights && result.suggestions) {
      return {
        message: "Success! Your advice is ready.",
        insights: result.insights,
        suggestions: result.suggestions,
      };
    } else {
      return { message: "The AI could not generate advice. Please try again." };
    }
  } catch (error) {
    console.error("Error generating advice:", error);
    return { message: "An unexpected error occurred. Please try again later." };
  }
}

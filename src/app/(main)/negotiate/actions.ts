"use server";

import { z } from "zod";
import {
  generateNegotiationScript,
  type BillNegotiationInput,
} from "@/ai/flows/bill-negotiation-tool";

const BillNegotiationFormSchema = z.object({
  billType: z.string().min(1, "Bill type is required."),
  currentProvider: z.string().min(1, "Provider is required."),
  monthlyCost: z.coerce.number().min(0, "Monthly cost must be a positive number."),
  servicesProvided: z.string().min(1, "Services description is required."),
  reasonForNegotiation: z.string().min(1, "Reason for negotiation is required."),
  desiredOutcome: z.string().min(1, "Desired outcome is required."),
});

export type FormState = {
  message: string;
  script?: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function generateScriptAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = BillNegotiationFormSchema.safeParse({
    billType: formData.get("billType"),
    currentProvider: formData.get("currentProvider"),
    monthlyCost: formData.get("monthlyCost"),
    servicesProvided: formData.get("servicesProvided"),
    reasonForNegotiation: formData.get("reasonForNegotiation"),
    desiredOutcome: formData.get("desiredOutcome"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const input: BillNegotiationInput = validatedFields.data;
    const result = await generateNegotiationScript(input);

    if (result && result.negotiationScript) {
      return {
        message: "Success! Your script is ready.",
        script: result.negotiationScript,
      };
    } else {
        return { message: "The AI could not generate a script. Please try again." };
    }
  } catch (error) {
    console.error("Error generating script:", error);
    return { message: "An unexpected error occurred. Please try again later." };
  }
}

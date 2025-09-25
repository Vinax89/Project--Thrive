
"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { processReceiptAction, type FormState } from "@/app/(main)/scan/actions";
import { useUser } from "@/firebase/auth/use-user";
import { useCollection } from "@/firebase/firestore/hooks";
import type { Transaction } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles, UploadCloud, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Scanning..." : "Scan Receipt"}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function ReceiptScanner() {
  const initialState: FormState = { message: "" };
  const [state, formAction] = useActionState(processReceiptAction, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [category, setCategory] = useState("");
  useEffect(() => {
    if (state.category) {
      setCategory(state.category);
    }
  }, [state.category]);

  const { user } = useUser();
  const { add: addTransaction } = useCollection<Transaction>(user ? `users/${user.uid}/transactions` : null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setImageData(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAsTransaction = () => {
    if (state.vendor && state.date && state.total && category) {
        addTransaction({
            name: state.vendor,
            amount: state.total,
            date: new Date(state.date).toISOString(),
            category: category,
        });
        toast({
            title: "Transaction Added",
            description: `${state.vendor} for $${state.total.toFixed(2)} has been added.`,
        });
    }
  };


  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <form action={formAction}>
         <input type="hidden" name="receiptImage" value={imageData || ""} />
          <CardHeader>
            <CardTitle>Upload Receipt</CardTitle>
            <CardDescription>
              Select an image of your receipt to be scanned.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="receipt-upload" className="sr-only">Upload Receipt</Label>
              <Input
                id="receipt-upload"
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                Select Image
              </Button>
            </div>
            {imagePreview && (
                <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Image Preview:</p>
                    <Image src={imagePreview} alt="Receipt Preview" width={400} height={400} className="rounded-md border"/>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Extracted Information</CardTitle>
          <CardDescription>
            Details from your receipt will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.vendor || state.date || state.total ? (
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Scan Results</AlertTitle>
              <AlertDescription className="mt-4 space-y-4">
                <div className="space-y-2">
                  <p><strong>Vendor:</strong> {state.vendor}</p>
                  <p><strong>Date:</strong> {state.date}</p>
                  <p><strong>Total:</strong> ${state.total?.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed text-center">
              <p className="text-sm text-muted-foreground">
                {state.message || "Awaiting receipt scan..."}
              </p>
            </div>
          )}
        </CardContent>
        {state.vendor && (
            <CardFooter>
                 <Button onClick={handleAddAsTransaction} className="w-full" disabled={!category}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add as Transaction
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}

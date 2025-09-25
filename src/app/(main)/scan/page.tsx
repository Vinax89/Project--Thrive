import { ReceiptScanner } from "@/components/receipt-scanner";

export default function ScanPage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Receipt Scanner</h1>
        <p className="text-muted-foreground">
          Upload a receipt to automatically extract transaction details.
        </p>
      </div>
      <ReceiptScanner />
    </div>
  );
}

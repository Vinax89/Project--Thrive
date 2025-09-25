import { BillNegotiationForm } from "@/components/bill-negotiation-form";

export default function NegotiatePage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Bill Negotiator</h1>
        <p className="text-muted-foreground">
          Let AI help you craft the perfect script to lower your bills.
        </p>
      </div>
      <BillNegotiationForm />
    </div>
  );
}

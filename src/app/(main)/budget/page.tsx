import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { sampleBudgetCategories } from "@/lib/data";

export default function BudgetPage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Envelopes</h1>
        <p className="text-muted-foreground">
          Allocate and track your spending by category.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleBudgetCategories.map((category) => {
          const progress = (category.spent / category.allocated) * 100;
          return (
            <Card key={category.name}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>
                  ${category.spent.toFixed(2)} spent of ${category.allocated.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{progress.toFixed(0)}% Used</span>
                  <span>${(category.allocated - category.spent).toFixed(2)} Left</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

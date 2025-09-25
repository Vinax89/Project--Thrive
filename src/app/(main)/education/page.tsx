import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function EducationPage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Education</h1>
        <p className="text-muted-foreground">
          Personalized financial content to help you grow.
        </p>
      </div>
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            We're preparing your personalized AI-powered financial education center.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

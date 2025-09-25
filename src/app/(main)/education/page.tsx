
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function EducationPage() {
  
  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Financial Education</h1>
        <p className="text-muted-foreground">
          Get personalized financial content to help you grow.
        </p>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Personalized financial education will be available here.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed text-center">
                <p className="text-sm text-muted-foreground">AI-driven content suggestions will appear here soon.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

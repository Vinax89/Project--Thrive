'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Upload, ServerCrash, FileJson } from 'lucide-react';
import { exportDataAction, type FormState } from './actions';
import { useUser } from '@/firebase/auth/use-user';


function ExportSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Generating...' : 'Generate & Download Snapshot'}
      <Download className="ml-2 h-4 w-4" />
    </Button>
  );
}

function triggerDownload(jsonData: string) {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_snapshot_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function DataManagementPage() {
  const { user } = useUser();
  const initialState: FormState = { message: '' };

  // Wrapper action to handle the download trigger
  const exportAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    const state = await exportDataAction(prevState, formData);
    if (state.jsonData) {
      triggerDownload(state.jsonData);
      return { message: 'Export successful! Your download has started.' };
    }
    return state;
  };

  const [state, formAction] = useActionState(exportAction, initialState);

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
        <p className="text-muted-foreground">
          Export or import your complete financial snapshot.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <form action={formAction}>
             {user?.uid && <input type="hidden" name="userId" value={user.uid} />}
            <CardHeader>
              <CardTitle>Export Financial Data</CardTitle>
              <CardDescription>
                Generate a JSON snapshot of all your data, including profile,
                transactions, debts, budgets, and investments. This is useful for backups or migrating your data.
              </CardDescription>
            </CardHeader>
            <CardContent>
                {state.message && (
                     <Alert variant={state.error ? 'destructive' : 'default'}>
                        {state.error ? <ServerCrash className="h-4 w-4" /> : <FileJson className="h-4 w-4" />}
                        <AlertTitle>{state.error ? 'Export Failed' : 'Export Status'}</AlertTitle>
                        <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter>
              <ExportSubmitButton />
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Financial Data</CardTitle>
            <CardDescription>
              Import a previously exported JSON snapshot.
              <span className="font-semibold text-destructive"> This will overwrite your existing data.</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex h-[150px] w-full flex-col items-center justify-center rounded-md border border-dashed text-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Import functionality is coming soon.</p>
            </div>
          </CardContent>
           <CardFooter>
                <Button disabled className="w-full">
                    Select File & Import
                    <Upload className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}

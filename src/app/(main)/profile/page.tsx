
'use client';

import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/hooks';
import type { UserProfile } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: 'Display name must be at least 2 characters.',
  }),
  email: z.string().email(),
  income: z.coerce.number().min(0).optional(),
  savings: z.coerce.number().min(0).optional(),
  savingsGoal: z.coerce.number().min(0).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user } = useUser();
  const { data: profile, update, loading } = useDoc<UserProfile>(
    user ? `users/${user.uid}` : null
  );
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: '',
      email: '',
      income: 0,
      savings: 0,
      savingsGoal: 0,
    },
  });

  const { isSubmitting, isDirty } = useFormState({ control: form.control });

  useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.displayName || '',
        email: profile.email || '',
        income: profile.income || 0,
        savings: profile.savings || 0,
        savingsGoal: profile.savingsGoal || 0,
      });
    }
  }, [profile, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!profile) return;
    try {
      await update(data);
      toast({
        title: 'Profile updated!',
        description: 'Your changes have been saved successfully.',
      });
      form.reset(data); // Resets the dirty state
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem updating your profile.',
      });
    }
  }

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and financial details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Update your personal and financial information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" readOnly {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                 <FormField
                    control={form.control}
                    name="income"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Monthly Income ($)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="5000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                  control={form.control}
                  name="savings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Savings ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10000" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="savingsGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Savings Goal ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="25000" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
               </div>

              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

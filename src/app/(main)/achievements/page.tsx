'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/hooks';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { allBadges, type Badge } from '@/lib/badges';
import { cn } from '@/lib/utils';
import * as Lucide from 'lucide-react';

function BadgeIcon({ name, ...props }: { name: string } & Lucide.LucideProps) {
  const Icon = (Lucide as any)[name];
  if (!Icon) return <Lucide.Award {...props} />;
  return <Icon {...props} />;
}

export default function AchievementsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}`) : null),
    [user, firestore]
  );
  const { data: profile, loading } = useDoc<UserProfile>(userDocRef);

  const earnedBadges = (profile as any)?.earnedBadges || [];

  if (loading) {
    return <p>Loading achievements...</p>;
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and unlock badges as you reach your financial goals.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Badge Collection</CardTitle>
          <CardDescription>
            You have earned {earnedBadges.length} of {allBadges.length} badges. Keep it up!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {allBadges.map((badge: Badge) => {
              const hasEarned = earnedBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={cn(
                    'flex flex-col items-center text-center p-4 rounded-lg border transition-all',
                    hasEarned
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-dashed bg-muted/50 text-muted-foreground'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-16 h-16 rounded-full mb-4',
                      hasEarned ? 'bg-amber-500 text-white' : 'bg-background'
                    )}
                  >
                    <BadgeIcon
                      name={badge.icon}
                      className={cn(
                        'w-8 h-8',
                        hasEarned ? 'text-white' : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <h3
                    className={cn(
                      'font-semibold text-sm',
                      hasEarned ? 'text-foreground' : ''
                    )}
                  >
                    {badge.title}
                  </h3>
                  <p className="text-xs mt-1">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

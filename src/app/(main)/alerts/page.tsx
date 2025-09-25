'use client';
import { useState } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/hooks';
import type { Alert } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Bell, Trash2 } from 'lucide-react';

export default function AlertsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const alertsColRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/alerts`) : null),
    [user, firestore]
  );
  const { data: alerts = [], add, update, remove } = useCollection<Alert>(alertsColRef);

  const [newAlertType, setNewAlertType] = useState<Alert['type'] | ''>('');
  const [newAlertThreshold, setNewAlertThreshold] = useState('');

  const handleAddAlert = () => {
    if (newAlertType && newAlertThreshold) {
      add({
        type: newAlertType as Alert['type'],
        threshold: parseFloat(newAlertThreshold),
        isEnabled: true,
      });
      setNewAlertType('');
      setNewAlertThreshold('');
    }
  };

  const getAlertDescription = (alert: Alert) => {
    switch (alert.type) {
      case 'low-balance':
        return `Notify when savings balance falls below $${alert.threshold.toLocaleString()}.`;
      case 'upcoming-bill':
        return `Notify ${alert.threshold} day(s) before a bill is due.`;
      case 'net-worth-change':
        return `Notify when net worth changes by ${alert.threshold}%.`;
      default:
        return 'Custom alert';
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customizable Alerts</h1>
        <p className="text-muted-foreground">
          Set up notifications for important financial events.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
            <CardDescription>
              Set up a new notification to stay on top of your finances.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alert-type">Alert Type</Label>
              <Select
                value={newAlertType}
                onValueChange={(value) => setNewAlertType(value as Alert['type'])}
              >
                <SelectTrigger id="alert-type">
                  <SelectValue placeholder="Select an alert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low-balance">Low Balance</SelectItem>
                  <SelectItem value="upcoming-bill">Upcoming Bill</SelectItem>
                  <SelectItem value="net-worth-change">Net Worth Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-threshold">Threshold</Label>
              <Input
                id="alert-threshold"
                type="number"
                placeholder={
                  newAlertType === 'low-balance'
                    ? 'e.g., 100'
                    : newAlertType === 'upcoming-bill'
                    ? 'e.g., 3 (days)'
                    : 'e.g., 5 (%)'
                }
                value={newAlertThreshold}
                onChange={(e) => setNewAlertThreshold(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddAlert} className="w-full">
              Add Alert
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Active Alerts</CardTitle>
            <CardDescription>
              Manage your existing notifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <ul className="space-y-4">
                {alerts.map((alert) => (
                  <li
                    key={alert.id}
                    className="flex items-center justify-between rounded-md border p-4"
                  >
                    <div className="flex items-center gap-4">
                        <Bell className="h-6 w-6 text-muted-foreground" />
                        <div>
                            <p className="font-medium">{getAlertDescription(alert)}</p>
                            <p className="text-sm text-muted-foreground">
                                Status: {alert.isEnabled ? 'Active' : 'Disabled'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.isEnabled}
                        onCheckedChange={(checked) =>
                          alert.id && update(alert.id, { isEnabled: checked })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => alert.id && remove(alert.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed text-center">
                <p className="text-sm text-muted-foreground">
                  You haven't set up any alerts yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

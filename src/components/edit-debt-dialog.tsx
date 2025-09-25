'use client';

import { useState, useEffect } from 'react';
import type { Debt } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface EditDebtDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: Partial<Debt>) => void;
  debt?: Debt | null;
  trigger?: React.ReactNode;
}

export function EditDebtDialog({
  isOpen,
  onOpenChange,
  onSave,
  debt,
  trigger,
}: EditDebtDialogProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<Debt['type'] | ''>('');
  
  const isEditing = !!debt;

  useEffect(() => {
    if (isOpen && debt) {
      setName(debt.name);
      setAmount(debt.amount.toString());
      setType(debt.type);
    } else if (!isOpen) {
      // Reset form when dialog closes
      setName('');
      setAmount('');
      setType('');
    }
  }, [isOpen, debt]);

  const handleSave = () => {
    if (name && amount && type) {
      const data: Partial<Debt> = {
        name,
        amount: parseFloat(amount),
        type: type as Debt['type'],
      };
      onSave(data);
    }
  };

  const dialogContent = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Debt' : 'Add New Debt'}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
            <Label htmlFor="debt-name">Debt Name</Label>
            <Input
                id="debt-name"
                placeholder="e.g., Visa Card"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </div>
         <div className="space-y-2">
            <Label htmlFor="debt-amount">Amount</Label>
            <Input
                id="debt-amount"
                type="number"
                placeholder="e.g., 1500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
        </div>
         <div className="space-y-2">
            <Label htmlFor="debt-type">Debt Type</Label>
            <Select onValueChange={(value) => setType(value as Debt['type'])} value={type}>
            <SelectTrigger id="debt-type">
                <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Loan">Loan</SelectItem>
                <SelectItem value="BNPL">BNPL</SelectItem>
            </SelectContent>
            </Select>
        </div>
        <Button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Add Debt'}</Button>
      </div>
    </DialogContent>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {dialogContent}
    </Dialog>
  );
}

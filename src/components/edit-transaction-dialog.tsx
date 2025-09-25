
'use client';

import { useState, useEffect } from 'react';
import type { Transaction } from '@/lib/types';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';


interface EditTransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: Omit<Transaction, 'id'> | Partial<Transaction>) => void;
  transaction?: Transaction | null;
  trigger?: React.ReactNode;
}

export function EditTransactionDialog({
  isOpen,
  onOpenChange,
  onSave,
  transaction,
  trigger,
}: EditTransactionDialogProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState('');

  const isEditing = !!transaction;

  useEffect(() => {
    if (isOpen && transaction) {
      setName(transaction.name);
      setAmount(transaction.amount.toString());
      setDate(new Date(transaction.date));
      setCategory(transaction.category);
    } else if (!isOpen) {
      // Reset form when dialog closes
      setName('');
      setAmount('');
      setDate(new Date());
      setCategory('');
    }
  }, [isOpen, transaction]);

  const handleSave = () => {
    if (name && amount && date && category) {
      const data = {
        name,
        amount: parseFloat(amount),
        date: date.toISOString(),
        category,
      };
      onSave(data);
    }
  };
  
  const dialogContent = (
     <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className='space-y-2'>
                <Label htmlFor="name">Transaction Name</Label>
                <Input
                    id="name"
                    placeholder="e.g., Groceries"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
             <div className='space-y-2'>
                <Label htmlFor="amount">Amount</Label>
                <Input
                    id="amount"
                    type="number"
                    placeholder="e.g., 75.50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <div className='space-y-2'>
                <Label htmlFor="category">Category</Label>
                <Input
                    id="category"
                    placeholder="e.g., Food"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
            </div>
            <div className='space-y-2'>
                <Label>Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </div>
            <Button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Add Transaction'}</Button>
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


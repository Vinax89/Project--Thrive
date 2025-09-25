'use client';

import { useState, useEffect } from 'react';
import type { BudgetCategory } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditBudgetCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: Partial<BudgetCategory>) => void;
  category?: BudgetCategory | null;
  trigger?: React.ReactNode;
}

export function EditBudgetCategoryDialog({
  isOpen,
  onOpenChange,
  onSave,
  category,
  trigger,
}: EditBudgetCategoryDialogProps) {
  const [name, setName] = useState('');
  const [allocated, setAllocated] = useState('');
  
  const isEditing = !!category;

  useEffect(() => {
    if (isOpen && category) {
      setName(category.name);
      setAllocated(category.allocated.toString());
    } else if (!isOpen) {
      // Reset form when dialog closes
      setName('');
      setAllocated('');
    }
  }, [isOpen, category]);

  const handleSave = () => {
    if (name && allocated) {
      const data: Partial<BudgetCategory> = {
        name,
        allocated: parseFloat(allocated),
      };
      onSave(data);
    }
  };

  const dialogContent = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Budget Category' : 'Add New Category'}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
            <Label htmlFor="cat-name">Category Name</Label>
            <Input
                id="cat-name"
                placeholder="e.g., Groceries"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </div>
         <div className="space-y-2">
            <Label htmlFor="cat-allocated">Allocated Amount</Label>
            <Input
                id="cat-allocated"
                type="number"
                placeholder="e.g., 500"
                value={allocated}
                onChange={(e) => setAllocated(e.target.value)}
            />
        </div>
        <Button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Add Category'}</Button>
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

'use client';

import { useState, useEffect } from 'react';
import type { Investment } from '@/lib/types';
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

interface EditInvestmentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: Partial<Investment>) => void;
  investment?: Investment | null;
  trigger?: React.ReactNode;
}

export function EditInvestmentDialog({
  isOpen,
  onOpenChange,
  onSave,
  investment,
  trigger,
}: EditInvestmentDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  
  const isEditing = !!investment;

  useEffect(() => {
    if (isOpen && investment) {
      setName(investment.name);
      setType(investment.type);
      setQuantity(investment.quantity.toString());
      setPurchasePrice(investment.purchasePrice.toString());
      setCurrentPrice(investment.currentPrice.toString());
    } else if (!isOpen) {
      // Reset form when dialog closes
      setName('');
      setType('');
      setQuantity('');
      setPurchasePrice('');
      setCurrentPrice('');
    }
  }, [isOpen, investment]);

  const handleSave = () => {
    if (name && type && quantity && purchasePrice && currentPrice) {
      const data: Partial<Investment> = {
        name,
        type,
        quantity: parseFloat(quantity),
        purchasePrice: parseFloat(purchasePrice),
        currentPrice: parseFloat(currentPrice),
      };
      onSave(data);
    }
  };

  const dialogContent = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Investment' : 'Add New Investment'}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
            <Label htmlFor="inv-name">Investment Name</Label>
            <Input id="inv-name" placeholder="e.g., Apple Inc." value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="inv-type">Type</Label>
            <Input id="inv-type" placeholder="e.g., Stock, ETF" value={type} onChange={(e) => setType(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="inv-quantity">Quantity</Label>
            <Input id="inv-quantity" type="number" placeholder="e.g., 10" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="inv-purchase-price">Purchase Price</Label>
            <Input id="inv-purchase-price" type="number" placeholder="e.g., 150" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="inv-current-price">Current Price</Label>
            <Input id="inv-current-price" type="number" placeholder="e.g., 175" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} />
        </div>
        <Button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Add Investment'}</Button>
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

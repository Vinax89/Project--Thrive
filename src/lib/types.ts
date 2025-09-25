

export type Debt = {
  id?: string;
  name: string;
  amount: number;
  type: 'Credit Card' | 'Loan' | 'BNPL';
  interestRate?: number;
  minimumPayment?: number;
};

export type Transaction = {
  id?: string;
  name: string;
  amount: number;
  date: string;
  category: string;
};

export type BudgetCategory = {
  id?: string;
  name: string;
  allocated: number;
  spent?: number;
};

export type Investment = {
    id?: string;
    name: string;
    type: string;
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
};

export type UserProfile = {
    id?: string;
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    income?: number;
    savings?: number;
    savingsGoal?: number;
    createdAt?: any;
    lastLogin?: any;
}

    
    
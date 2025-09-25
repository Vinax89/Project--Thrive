export type Debt = {
  name: string;
  amount: number;
  type: 'Credit Card' | 'Loan' | 'BNPL';
};

export type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
};

export type BudgetCategory = {
  name: string;
  allocated: number;
  spent: number;
};

import type { Debt, Transaction, BudgetCategory } from './types';

export const sampleDebts: Debt[] = [
  { name: 'Visa Card', amount: 4500, type: 'Credit Card' },
  { name: 'Student Loan', amount: 22000, type: 'Loan' },
  { name: 'Car Loan', amount: 8500, type: 'Loan' },
  { name: 'Affirm Purchase', amount: 750, type: 'BNPL' },
  { name: 'Mastercard', amount: 1500, type: 'Credit Card' },
];

export const sampleTransactions: Transaction[] = [
  { id: '1', name: 'Grocery Store', amount: 125.67, date: '2024-07-20', category: 'Food' },
  { id: '2', name: 'Gas Station', amount: 45.22, date: '2024-07-20', category: 'Transport' },
  { id: '3', name: 'Netflix Subscription', amount: 15.99, date: '2024-07-19', category: 'Entertainment' },
  { id: '4', name: 'Restaurant Dinner', amount: 88.00, date: '2024-07-18', category: 'Food' },
  { id: '5', name: 'Electric Bill', amount: 150.40, date: '2024-07-15', category: 'Utilities' },
];

export const sampleBudgetCategories: BudgetCategory[] = [
    { name: 'Housing', allocated: 1500, spent: 1500 },
    { name: 'Food', allocated: 600, spent: 450.75 },
    { name: 'Transport', allocated: 300, spent: 150.25 },
    { name: 'Utilities', allocated: 250, spent: 225.90 },
    { name: 'Entertainment', allocated: 150, spent: 95.50 },
    { name: 'Savings', allocated: 500, spent: 0 },
];

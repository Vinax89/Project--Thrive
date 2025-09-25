import type { Debt, Transaction, BudgetCategory, Investment } from './types';

export const sampleDebts: Omit<Debt, 'id'>[] = [
  { name: 'Visa Card', amount: 4500, type: 'Credit Card' },
  { name: 'Student Loan', amount: 22000, type: 'Loan' },
  { name: 'Car Loan', amount: 8500, type: 'Loan' },
  { name: 'Affirm Purchase', amount: 750, type: 'BNPL' },
  { name: 'Mastercard', amount: 1500, type: 'Credit Card' },
];

export const sampleTransactions: Omit<Transaction, 'id'>[] = [
  { name: 'Grocery Store', amount: 125.67, date: new Date().toISOString(), category: 'Food' },
  { name: 'Gas Station', amount: 45.22, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), category: 'Transport' },
  { name: 'Netflix Subscription', amount: 15.99, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), category: 'Entertainment' },
  { name: 'Restaurant Dinner', amount: 88.00, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), category: 'Food' },
  { name: 'Electric Bill', amount: 150.40, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), category: 'Utilities' },
];

export const sampleBudgetCategories: Omit<BudgetCategory, 'id'>[] = [
    { name: 'Housing', allocated: 1500 },
    { name: 'Food', allocated: 600 },
    { name: 'Transport', allocated: 300 },
    { name: 'Utilities', allocated: 250 },
    { name: 'Entertainment', allocated: 150 },
    { name: 'Savings', allocated: 500 },
];


export const sampleInvestments: Omit<Investment, 'id'>[] = [
    { name: 'Tech Giant (TCG)', type: 'Stock', quantity: 10, purchasePrice: 150, currentPrice: 175 },
    { name: 'Global Index ETF (GIX)', type: 'ETF', quantity: 25, purchasePrice: 200, currentPrice: 215 },
];

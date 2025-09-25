export interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string;
  }
  
  export const allBadges: Badge[] = [
    {
      id: 'first-budget',
      title: 'Budget Boss',
      description: 'Create your first budget category.',
      icon: 'Wallet',
    },
    {
      id: 'debt-demolisher',
      title: 'Debt Demolisher',
      description: 'Pay off one of your debts.',
      icon: 'Hammer',
    },
    {
      id: 'investment-initiate',
      title: 'Investment Initiate',
      description: 'Make your first investment entry.',
      icon: 'TrendingUp',
    },
    {
      id: 'transaction-tracker',
      title: 'Transaction Tracker',
      description: 'Add your first 10 transactions.',
      icon: 'Receipt',
    },
    {
      id: 'savings-starter',
      title: 'Savings Starter',
      description: 'Set your first savings goal.',
      icon: 'PiggyBank',
    },
     {
      id: 'net-worth-novice',
      title: 'Net Worth Novice',
      description: 'Calculate your net worth for the first time.',
      icon: 'Scale',
    },
  ];
  
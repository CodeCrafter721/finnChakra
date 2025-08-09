export interface Transaction {
  id?: number;
  title?: string;
  amount: number;
  currency: string;
  date: string; 
  category: string;
  type?: 'INCOME' | 'EXPENSE';
  recurring?: boolean;
  recurrence?: string;
}

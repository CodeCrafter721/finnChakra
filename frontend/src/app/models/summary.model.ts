export interface SummaryResponse {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  currency: string;
  categoryTotals: {
    [category: string]: number;
  };
}

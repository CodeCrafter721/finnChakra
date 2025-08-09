export interface BudgetThreshold {
  id: number;
  category: string;
  thresholdAmount: number;
  currency: string;
  userEmail?: string;
}

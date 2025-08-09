import { Routes } from '@angular/router';
import { TransactionAnalyticsComponent } from './transaction-analytics.component';

export const routes: Routes = [
  {
    path: '',
    component: TransactionAnalyticsComponent // ✅ This ensures the main route loads properly
  }
];

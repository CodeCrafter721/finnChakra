import { Routes } from '@angular/router';
import { RecurringTriggerComponent } from './recurring-trigger/recurring-trigger';
import { AdminBudgetComponent } from '../budgets/admin-budget/admin-budget';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'thresholds', component: AdminBudgetComponent },
      { path: 'recurring-trigger', component: RecurringTriggerComponent },
      { path: '', redirectTo: 'thresholds', pathMatch: 'full' }
    ]
  }
];

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AdminBudgetComponent } from "../budgets/admin-budget/admin-budget";
import { UserBudgetComponent } from "../budgets/user-budget/user-budget";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget-dashboard',
  standalone: true,
  imports: [AdminBudgetComponent, UserBudgetComponent,CommonModule,],
  templateUrl: './budget-dashboard.component.html',
  styleUrls: ['./budget-dashboard.component.scss']
})
export class BudgetDashboardComponent implements OnInit {
  role: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.role = this.authService.getUserRole(); 
    console.log('Detected role:', this.role);
  
  }
}

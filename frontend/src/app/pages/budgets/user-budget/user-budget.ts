import { Component, OnInit } from '@angular/core';
import { BudgetThreshold } from '../../../models/budget.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ThresholdFormComponent } from '../../../components/threshold-form/threshold-form';
import { BudgetService } from '../../../services/budget.service';

@Component({
  selector: 'app-user-budget',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    ThresholdFormComponent
  ],
  templateUrl: './user-budget.html',
  styleUrls: ['./user-budget.scss']
})
export class UserBudgetComponent implements OnInit {
  thresholds: BudgetThreshold[] = [];
  displayedColumns = ['category', 'thresholdAmount', 'currency', 'actions'];
  isLoading = false;

  constructor(
    private budgetService: BudgetService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadThresholds();
  }

  loadThresholds() {
    this.isLoading = true;
    this.budgetService.getThresholds().subscribe({
      next: (data) => {
        this.thresholds = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load thresholds:', err);
        this.snackBar.open('Failed to load thresholds', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  openForm(threshold?: BudgetThreshold) {
    const dialogRef = this.dialog.open(ThresholdFormComponent, {
      data: threshold
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
          this.budgetService.updateThreshold(result.id, result).subscribe(() => this.loadThresholds());
        } else {
          this.budgetService.createThreshold(result).subscribe(() => this.loadThresholds());
        }
      }
    });
  }

  deleteThreshold(id: number) {
    if (!confirm('Are you sure you want to delete this threshold?')) return;
    this.budgetService.deleteThreshold(id).subscribe({
      next: () => {
        this.snackBar.open('Threshold deleted', 'Close', { duration: 3000 });
        this.loadThresholds();
      },
      error: () => {
        this.snackBar.open('Failed to delete threshold', 'Close', { duration: 3000 });
      }
    });
  }
}

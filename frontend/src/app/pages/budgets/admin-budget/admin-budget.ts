import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { saveAs } from 'file-saver';
import { ThresholdFormComponent } from '../../../components/threshold-form/threshold-form';
import { BudgetService, BudgetThresholdResponseDTO } from '../../../services/budget.service';

@Component({
  selector: 'app-admin-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    ThresholdFormComponent
  ],
  templateUrl: './admin-budget.html',
  styleUrls: ['./admin-budget.scss']
})
export class AdminBudgetComponent implements OnInit {
  displayedColumns: string[] = ['email', 'category', 'amount', 'currency', 'actions'];
  dataSource = new MatTableDataSource<BudgetThresholdResponseDTO>();
  filterValue = '';
  totalAmount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private budgetService: BudgetService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchAdminThresholds();
  }

  fetchAdminThresholds(): void {
    this.budgetService.getAllThresholds(0, 1000).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.calculateTotal();
      },
      error: (err) => {
        console.error('Admin threshold fetch failed:', err);
        this.snackBar.open('Failed to load thresholds', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) =>
      data.userEmail.toLowerCase().includes(filter) || data.category.toLowerCase().includes(filter);

    this.calculateTotal();
    if (this.paginator) this.paginator.firstPage();
  }

  calculateTotal(): void {
    this.totalAmount = this.dataSource.filteredData.reduce(
      (sum, t) => sum + (t.thresholdAmount || 0),
      0
    );
  }

  exportCSV(): void {
    const header = ['Email', 'Category', 'Amount', 'Currency'];
    const rows = this.dataSource.filteredData.map(t =>
      [t.userEmail, t.category, t.thresholdAmount, t.currency]
    );
    const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'admin-thresholds.csv');
  }

  editThreshold(element: BudgetThresholdResponseDTO): void {
    const dialogRef = this.dialog.open(ThresholdFormComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchAdminThresholds();
    });
  }

  deleteThreshold(id: number): void {
    if (confirm('Are you sure you want to delete this threshold?')) {
      this.budgetService.deleteThreshold(id).subscribe({
        next: () => {
          this.snackBar.open('Threshold deleted', 'Close', { duration: 2000 });
          this.fetchAdminThresholds();
        },
        error: () => {
          this.snackBar.open('Delete failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
}

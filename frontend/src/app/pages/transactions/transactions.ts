import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.scss'],
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule
  ]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  category = '';
  start?: Date;
  end?: Date;
  page = 0;
  size = 5;
  totalItems = 0;
  totalIncome = 0;
  totalExpense = 0;

  constructor(
    private transactionService: TransactionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions() {
    const formattedStart = this.start ? this.formatDate(this.start) : undefined;
    const formattedEnd = this.end ? this.formatDate(this.end) : undefined;

    this.transactionService.getTransactions(
      this.page, this.size, this.category, formattedStart, formattedEnd
    ).subscribe({
      next: (res: any) => {
        this.transactions = res.content;
        this.totalItems = res.totalElements;
        this.calculateSummary();
      },
      error: () => alert('Failed to load transactions')
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.fetchTransactions();
  }

  resetFilters() {
    this.category = '';
    this.start = undefined;
    this.end = undefined;
    this.fetchTransactions();
  }

  exportCsv() {
    this.transactionService.exportCsv();
  }

  addTransaction() {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionService.addTransaction(result).subscribe({
          next: () => this.fetchTransactions(),
          error: () => alert('Failed to add transaction')
        });
      }
    });
  }

  editTransaction(tx: Transaction) {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '400px',
      data: { transaction: tx }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionService.updateTransaction(tx.id!, result).subscribe({
          next: () => this.fetchTransactions(),
          error: () => alert('Failed to update transaction')
        });
      }
    });
  }

  deleteTransaction(tx: Transaction) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(tx.id!).subscribe({
        next: () => this.fetchTransactions(),
        error: () => alert('Failed to delete transaction')
      });
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private calculateSummary(): void {
    this.totalIncome = this.transactions
      .filter(tx => tx.type === 'INCOME')
      .reduce((sum, tx) => sum + tx.amount, 0);

    this.totalExpense = this.transactions
      .filter(tx => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }
}

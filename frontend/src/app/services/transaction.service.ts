import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../models/transaction.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private baseUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(page: number, size: number, category?: string, start?: string, end?: string): Observable<any> {
    const params: any = { page, size };
    if (category) params.category = category;
    if (start) params.start = start;
    if (end) params.end = end;
    return this.http.get(this.baseUrl, { params });
  }

  addTransaction(tx: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, tx);
  }

  updateTransaction(id: number, tx: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/${id}`, tx);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  exportCsv() {
    const url = 'http://localhost:8080/api/export/csv';
    window.open(url, '_blank');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BudgetThreshold } from '../models/budget.model';

// DTOs
export interface BudgetThresholdResponseDTO {
  id: number;
  userEmail: string;
  category: string;
  thresholdAmount: number;
  currency: string;
}

export interface BudgetThresholdAdminPageResponse {
  content: BudgetThresholdResponseDTO[];
  totalPages: number;
  totalElements: number;
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private baseUrl = 'http://localhost:8080/api/budget';

  constructor(private http: HttpClient) {}

  // ✅ Helper: Get role from JWT
  private getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.role?.replace('ROLE_', '') || null;
    } catch (e) {
      console.error('Invalid JWT token', e);
      return null;
    }
  }

  // ✅ Auto-switch based on role
  getThresholds(): Observable<BudgetThreshold[] | BudgetThresholdResponseDTO[]> {
    const role = this.getUserRole();

    if (role === 'ADMIN') {
      return this.http.get<BudgetThresholdResponseDTO[]>(`${this.baseUrl}/admin/all`);
    } else {
      return this.http.get<BudgetThreshold[]>(this.baseUrl);
    }
  }

  // Used by USER
  createThreshold(dto: BudgetThreshold): Observable<BudgetThreshold> {
    return this.http.post<BudgetThreshold>(this.baseUrl, dto);
  }

  updateThreshold(id: number, dto: BudgetThreshold): Observable<BudgetThreshold> {
    return this.http.put<BudgetThreshold>(`${this.baseUrl}/${id}`, dto);
  }

  deleteThreshold(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Admin: paginated thresholds
  getAllThresholds(
    page: number,
    size: number,
    category?: string,
    email?: string
  ): Observable<BudgetThresholdAdminPageResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (category) params = params.set('category', category);
    if (email) params = params.set('email', email);

    return this.http.get<BudgetThresholdAdminPageResponse>(`${this.baseUrl}/admin`, { params });
  }

  // Admin: filtered thresholds without pagination
  getAdminThresholds(
    category?: string,
    email?: string
  ): Observable<BudgetThresholdAdminPageResponse> {
    const params = new HttpParams()
      .set('category', category || '')
      .set('email', email || '');

    return this.http.get<BudgetThresholdAdminPageResponse>(`${this.baseUrl}/admin`, { params });
  }

  exportThresholdsCsv() {
    window.open(`${this.baseUrl}/admin/export`, '_blank');
  }
}

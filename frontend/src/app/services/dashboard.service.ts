import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SummaryResponse } from '../models/summary.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/summary';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<SummaryResponse> {
    return this.http.get<SummaryResponse>(this.apiUrl);
  }
}

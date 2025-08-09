// analytics-dashboard.ts
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexMarkers,
  ApexYAxis
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgApexchartsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatNativeDateModule,
    MatProgressBarModule
  ],
  templateUrl: './analytics-dashboard.html',
  styleUrls: ['./analytics-dashboard.scss']
})
export class AnalyticsDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  role: string = '';
  chartType: 'line' | 'bar' | 'area' = 'line';

  monthlyChartOptions: any = null;
  categoryChartOptions: any = null;
  thresholdChartOptions: any = null;

  userThresholds: any[] = [];
  categoryExpenses: { [key: string]: number } = {};

  private resizeObserver!: ResizeObserver;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.role = this.authService.getUserRole() ?? 'USER';
    this.loadMonthlySummary();
    this.loadCategorySummary();
    if (this.role === 'ADMIN') {
      this.loadBudgetThresholds();
    } else {
      this.loadUserThresholds();
    }
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.loadMonthlySummary();
      this.loadCategorySummary();
    });

    const layout = document.querySelector('.dashboard-layout-content');
    if (layout) {
      this.resizeObserver.observe(layout);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  onChartTypeChange(type: 'line' | 'bar' | 'area'): void {
    this.chartType = type;
    this.loadMonthlySummary();
  }

  loadMonthlySummary(): void {
    this.http.get<any[]>('http://localhost:8080/api/summary/monthly').subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          this.monthlyChartOptions = null;
          return;
        }

        const months = data.map(d => d.month ?? 'Unknown');
        const income = data.map(d => d.totalIncome ?? 0);
        const expense = data.map(d => d.totalExpense ?? 0);

        if (months.length === 1) {
          months.push(months[0] + ' (copy)');
          income.push(income[0]);
          expense.push(expense[0]);
        }

        this.monthlyChartOptions = {
          series: [
            { name: 'Income', data: income },
            { name: 'Expense', data: expense }
          ],
          chart: {
            type: this.chartType,
            height: 350,
            toolbar: { show: false }
          },
          title: { text: 'Monthly Income vs Expense', align: 'center' },
          xaxis: { categories: months },
          yaxis: { title: { text: 'Amount (₹)' } },
          dataLabels: { enabled: false },
          stroke: { curve: this.chartType === 'bar' ? 'straight' : 'smooth' },
          markers: { size: this.chartType === 'bar' ? 0 : 4 }
        };
      },
      error: err => console.error('Error loading monthly summary:', err)
    });
  }

  loadCategorySummary(): void {
    this.http.get<any>('http://localhost:8080/api/summary').subscribe({
      next: (data) => {
        const categories = data.expensesByCategory ?? data.expenseByCategory ?? {};
        this.categoryExpenses = categories;

        const series = Object.values(categories);
        const labels = Object.keys(categories);

        this.categoryChartOptions = labels.length
          ? {
              series,
              labels,
              chart: {
                type: 'pie',
                height: 350,
              },
              title: {
                text: 'Expense Distribution by Category',
                align: 'center',
                style: { fontSize: '18px' }
              },
              legend: {
                position: 'bottom',
                fontSize: '14px'
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: { width: 300 },
                    legend: { position: 'bottom' }
                  }
                }
              ]
            }
          : null;
      },
      error: err => console.error('Error loading category summary:', err)
    });
  }

  loadUserThresholds(): void {
    this.http.get<any[]>('http://localhost:8080/api/budget').subscribe({
      next: (data) => {
        this.userThresholds = data || [];
      },
      error: err => console.error('Error loading user thresholds:', err)
    });
  }

  loadBudgetThresholds(): void {
    this.http.get<any[]>('http://localhost:8080/api/budget/admin/all').subscribe({
      next: (thresholds) => {
        if (!thresholds || thresholds.length === 0) {
          this.thresholdChartOptions = null;
          return;
        }

        const categories = thresholds.map(t => t.category);
        const amounts = thresholds.map(t => t.thresholdAmount);

        this.thresholdChartOptions = {
          series: [{ name: 'Threshold Amount', data: amounts }],
          chart: { type: 'bar', height: 350 },
          title: { text: 'Budget Thresholds by Category' },
          xaxis: { categories },
          yaxis: { title: { text: 'Threshold Amount' } },
          dataLabels: { enabled: true }
        };
      },
      error: err => console.error('Error loading threshold data:', err)
    });
  }

  exportChartAsPDF(chartId: string, fileName: string): void {
    const chartEl = document.getElementById(chartId) as HTMLElement;
    if (!chartEl) return;
    html2canvas(chartEl).then((canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
      pdf.save(fileName);
    });
  }

  getCategoryExpense(category: string): number {
    return this.categoryExpenses[category] || 0;
  }

  isExceeded(threshold: any): boolean {
    return this.getCategoryExpense(threshold.category) > threshold.thresholdAmount;
  }

  getProgress(threshold: any): number {
    const val = (this.getCategoryExpense(threshold.category) / threshold.thresholdAmount) * 100;
    return Math.min(100, Math.round(val));
  }
}

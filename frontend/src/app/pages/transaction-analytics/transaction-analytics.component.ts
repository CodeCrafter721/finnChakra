import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexChart, ApexAxisChartSeries, ApexXAxis } from 'ng-apexcharts';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-transaction-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatButtonModule,
    NgApexchartsModule
  ],
  templateUrl: './transaction-analytics.html',
  styleUrls: ['./transaction-analytics.scss']
})
export class TransactionAnalyticsComponent implements OnInit {
  startDate: Date | null = null;
  endDate: Date | null = null;
  category: string = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;

  transactions: any[] = [];
  displayedColumns: string[] = ['category', 'amount', 'date'];
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;

  chartVisible = false;
  chartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
  } = {
    series: [],
    chart: { type: 'bar', height: 350 },
    xaxis: { categories: [] }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    this.endDate = today;
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());

    if (this.startDate) params = params.set('start', this.startDate.toISOString().split('T')[0]);
    if (this.endDate) params = params.set('end', this.endDate.toISOString().split('T')[0]);
    if (this.category) params = params.set('category', this.category);
    if (this.minAmount !== null) params = params.set('minAmount', this.minAmount.toString());
    if (this.maxAmount !== null) params = params.set('maxAmount', this.maxAmount.toString());

    console.log('[Analytics] Fetching with params:', params.toString());
    this.http.get<any>('http://localhost:8080/api/transactions', { params }).subscribe({
      next: (res) => {
        this.transactions = res.content || res;
        this.totalPages = res.totalPages || 1;
        if (this.chartVisible) this.generateChart();
      },
      error: () => console.error('Failed to fetch transactions')
    });
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.fetchTransactions();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.fetchTransactions();
    }
  }

  exportCSV(): void {
    const rows = [['Category', 'Amount', 'Date']];
    this.transactions.forEach((t) =>
      rows.push([t.category, t.amount.toString(), t.date])
    );
    const csvContent = rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'transactions.csv');
  }

  toggleChart(): void {
    this.chartVisible = !this.chartVisible;
    if (this.chartVisible) this.generateChart();
  }

  generateChart(): void {
    const grouped: { [key: string]: number } = {};
    this.transactions.forEach((t) => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

    const categories = Object.keys(grouped);
    const values = Object.values(grouped);

    this.chartOptions = {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories },
      series: [{ name: 'Total Amount', data: values }]
    };
  }

  exportChartAsPDF(): void {
    const chartEl = document.querySelector('#chartContainer') as HTMLElement;
    html2canvas(chartEl).then((canvas) => {
      const pdf = new jsPDF();
      const img = canvas.toDataURL('image/png');
      pdf.addImage(img, 'PNG', 10, 10, 190, 100);
      pdf.save('transactions-chart.pdf');
    });
  }

  exportChartAsImage(): void {
    const chartEl = document.querySelector('#chartContainer') as HTMLElement;
    html2canvas(chartEl).then((canvas) => {
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, 'transactions-chart.png');
      });
    });
  }
}

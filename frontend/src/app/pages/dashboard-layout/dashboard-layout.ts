import {
  Component,
  OnInit,
  AfterViewInit,
  NgZone,
  ChangeDetectorRef,
  Renderer2,
  Inject
} from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../auth/auth.service';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexXAxis,
  ApexTooltip,
  ApexDataLabels,
  ApexTitleSubtitle
} from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatBadgeModule,
    NgApexchartsModule
  ],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.scss']
})
export class DashboardLayoutComponent implements OnInit, AfterViewInit {
  isDark = false;
  collapsed = false;
  isHovered = false;
  isLoading = true;

  userEmail: string | null = null;
  userName: string | null = null;
  userInitial = '';

  // Monthly Income chart
  monthlyIncomeSeries: ApexAxisChartSeries = [
    { name: 'Income', data: [4000, 4500, 4800, 5000, 5200, 6000, 6500] }
  ];
  monthlyIncomeChart: ApexChart = {
    type: 'line',
    height: 300,
    toolbar: { show: false }
  };
  monthlyIncomeXAxis: ApexXAxis = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  };
  monthlyIncomeStroke: ApexStroke = { curve: 'smooth', width: 2 };
  monthlyIncomeTooltip: ApexTooltip = { theme: 'light' };
  monthlyIncomeTitle: ApexTitleSubtitle = {
    text: 'Monthly Income',
    align: 'left'
  };

  // Transactions chart
  transactionsSeries: ApexAxisChartSeries = [
    { name: 'Transactions', data: [120, 140, 100, 180, 200, 160, 220] }
  ];
  transactionsChart: ApexChart = {
    type: 'bar',
    height: 300,
    toolbar: { show: false }
  };
  transactionsXAxis: ApexXAxis = {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };
  transactionsTooltip: ApexTooltip = { theme: 'light' };
  transactionsTitle: ApexTitleSubtitle = {
    text: 'Transactions',
    align: 'left'
  };

  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.userName = this.userEmail?.split('@')[0] ?? 'User';
    this.userInitial =
      this.userName && this.userName.length > 0
        ? this.userName.charAt(0).toUpperCase()
        : '';

    setTimeout(() => {
      this.isLoading = false;
      this.cdRef.markForCheck();
      this.dispatchResize();
    }, 900);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dispatchResize();
    }, 0);
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.isHovered = false;
    this.dispatchResize();
    setTimeout(() => this.dispatchResize(), 320);
  }

  hoverSidenav(state: boolean): void {
    if (this.collapsed) {
      this.isHovered = state;
    }
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;

    const container = this.document.querySelector('.dashboard-container');
    if (container) {
      if (this.isDark) {
        this.renderer.addClass(container, 'dark-theme');
        this.monthlyIncomeTooltip.theme = 'dark';
        this.transactionsTooltip.theme = 'dark';
      } else {
        this.renderer.removeClass(container, 'dark-theme');
        this.monthlyIncomeTooltip.theme = 'light';
        this.transactionsTooltip.theme = 'light';
      }
    }
    setTimeout(() => this.dispatchResize(), 0);
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }

  private dispatchResize(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
    });
  }
}

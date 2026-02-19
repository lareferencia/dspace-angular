import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ReportSummary, SummaryWithTrendData, UserAction, UserActivityReport, UserActivityReportService, UserActivityStats } from './user-activity-report.service';

@Component({
  selector: 'ds-user-activity-report',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbModule],
  templateUrl: './user-activity-report.component.html',
  styleUrls: ['./user-activity-report.component.scss']
})
export class UserActivityReportComponent implements OnInit, OnDestroy {
  @ViewChild('trendChartContainer') chartContainer?: ElementRef<HTMLDivElement>;

  report: UserActivityReport | null = null;
  summary: ReportSummary | null = null;
  summaryWithTrends: SummaryWithTrendData | null = null;
  users: UserActivityStats[] | null = null;
  actions: UserAction[] | null = null;
  loading = false;
  error: string | null = null;

  activeTab: 'summary' | 'users' | 'actions' = 'summary';
  searchEmail = '';
  sortField: 'name' | 'submissions' | 'reviews' | 'approvals' | 'rejections' | 'withdrawals' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Date filter for trend data
  startDate: string = '';
  endDate: string = '';
  filteredTrendData: { [month: string]: { [actionType: string]: number } } = {};

  // ApexCharts instance
  private chartInstance: ApexCharts | null = null;

  private destroy$ = new Subject<void>();

  constructor(private reportService: UserActivityReportService) {}

  ngOnInit(): void {
    this.loadDataForTab();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDataForTab(): void {
    switch (this.activeTab) {
      case 'summary':
        this.loadSummary();
        break;
      case 'users':
        this.loadUsers();
        break;
      case 'actions':
        this.loadActions();
        break;
    }
  }

  loadSummary(): void {
    if (this.summaryWithTrends) {
      this.filteredTrendData = this.getFilteredTrendData();
      this.updateChartData();
      return; // Already loaded
    }

    this.loading = true;
    this.error = null;

    this.reportService.getSummaryWithTrends()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.summaryWithTrends = data;
          this.summary = data;
          this.filteredTrendData = this.getFilteredTrendData();
          this.updateChartData();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading summary:', err);
          this.error = 'Error loading summary data. Please try again later.';
          this.loading = false;
        }
      });
  }

  loadUsers(): void {
    if (this.users) {
      return; // Already loaded
    }

    this.loading = true;
    this.error = null;

    this.reportService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.error = 'Error loading user statistics. Please try again later.';
          this.loading = false;
        }
      });
  }

  loadActions(): void {
    if (this.actions) {
      return; // Already loaded
    }

    this.loading = true;
    this.error = null;

    this.reportService.getAllActions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.actions = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading actions:', err);
          this.error = 'Error loading actions data. Please try again later.';
          this.loading = false;
        }
      });
  }

  getFilteredUsers() {
    if (!this.users) {
      return [];
    }

    let filtered = this.users;

    // Filter by email if search text provided
    if (this.searchEmail.trim()) {
      const search = this.searchEmail.toLowerCase();
      filtered = filtered.filter(u =>
        u.email.toLowerCase().includes(search) ||
        u.userName.toLowerCase().includes(search)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (this.sortField) {
        case 'name':
          aVal = a.userName.toLowerCase();
          bVal = b.userName.toLowerCase();
          break;
        case 'submissions':
          aVal = a.totalSubmissions;
          bVal = b.totalSubmissions;
          break;
        case 'reviews':
          aVal = a.totalApprovals + a.totalRejections + a.totalWithdrawals;
          bVal = b.totalApprovals + b.totalRejections + b.totalWithdrawals;
          break;
        case 'approvals':
          aVal = a.totalApprovals;
          bVal = b.totalApprovals;
          break;
        case 'rejections':
          aVal = a.totalRejections;
          bVal = b.totalRejections;
          break;
        case 'withdrawals':
          aVal = a.totalWithdrawals;
          bVal = b.totalWithdrawals;
          break;
      }

      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }

  toggleSort(field: 'name' | 'submissions' | 'reviews' | 'approvals' | 'rejections' | 'withdrawals'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  setTab(tab: 'summary' | 'users' | 'actions'): void {
    this.activeTab = tab;
    this.loadDataForTab();
  }

  /**
   * Filter trend data by date range (YYYY-MM format)
   */
  getFilteredTrendData(): { [month: string]: { [actionType: string]: number } } {
    if (!this.summaryWithTrends?.trendData) {
      return {};
    }

    const filtered: { [month: string]: { [actionType: string]: number } } = {};

    for (const [month, data] of Object.entries(this.summaryWithTrends.trendData)) {
      // If no date filter, include all data
      if (!this.startDate && !this.endDate) {
        filtered[month] = data;
        continue;
      }

      // Check if month is within the range
      const includeMonth = (
        (!this.startDate || month >= this.startDate) &&
        (!this.endDate || month <= this.endDate)
      );

      if (includeMonth) {
        filtered[month] = data;
      }
    }

    return filtered;
  }

  /**
   * Update filtered trend data when date filter changes
   */
  onDateFilterChange(): void {
    this.filteredTrendData = this.getFilteredTrendData();
    this.updateChartData();
  }

  /**
   * Reset date filters
   */
  resetDateFilter(): void {
    this.startDate = '';
    this.endDate = '';
    this.filteredTrendData = this.getFilteredTrendData();
    this.updateChartData();
  }

  /**
   * Prepare and update chart data from filtered trend data
   */
  updateChartData(): void {
    if (!this.filteredTrendData || Object.keys(this.filteredTrendData).length === 0) {
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }
      return;
    }

    // Get sorted months
    const months = Object.keys(this.filteredTrendData).sort();

    // Define colors for each action type
    const colors: { [key: string]: string } = {
      SUBMITTED: '#0066cc',
      APPROVED: '#28a745',
      REJECTED: '#dc3545',
      WITHDRAWN: '#ffc107'
    };

    // Prepare series data for each action type
    const series: any[] = [];
    const actionTypes = ['SUBMITTED', 'APPROVED', 'REJECTED', 'WITHDRAWN'];

    for (const actionType of actionTypes) {
      const data = months.map(month => {
        const monthData = this.filteredTrendData[month] || {};
        return monthData[actionType] || 0;
      });

      series.push({
        name: actionType.charAt(0).toUpperCase() + actionType.slice(1).toLowerCase(),
        data: data,
        color: colors[actionType]
      });
    }

    // Render chart after a small delay to ensure DOM is ready
    setTimeout(() => {
      this.renderChart(months, series);
    }, 100);
  }

  /**
   * Render ApexCharts chart
   */
  private renderChart(months: string[], series: any[]): void {
    if (!this.chartContainer) {
      return;
    }

    // Destroy previous chart if it exists
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const options: ApexOptions = {
      chart: {
        type: 'line',
        height: 400,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      series: series,
      xaxis: {
        categories: months,
        type: 'category'
      },
      yaxis: {
        title: {
          text: 'Count'
        },
        min: 0
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      grid: {
        show: true,
        borderColor: '#f1f1f1'
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (value: number) => Math.round(value).toString()
        }
      }
    };

    this.chartInstance = new ApexCharts(this.chartContainer.nativeElement, options);
    this.chartInstance.render();
  }

  downloadCSV(): void {
    if (!this.users) {
      return;
    }

    const headers = ['Email', 'Name', 'Submissions', 'Reviews', 'Approvals', 'Rejections', 'Withdrawals'];
    const rows = this.users.map(user => [
      user.email,
      user.userName,
      user.totalSubmissions,
      user.totalApprovals + user.totalRejections + user.totalWithdrawals,
      user.totalApprovals,
      user.totalRejections,
      user.totalWithdrawals
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `user-activity-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

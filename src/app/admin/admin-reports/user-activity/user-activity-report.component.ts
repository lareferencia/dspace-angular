import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ReportSummary, UserActivityReport, UserActivityReportService } from './user-activity-report.service';

@Component({
  selector: 'ds-user-activity-report',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbModule],
  templateUrl: './user-activity-report.component.html',
  styleUrls: ['./user-activity-report.component.scss']
})
export class UserActivityReportComponent implements OnInit, OnDestroy {
  report: UserActivityReport | null = null;
  summary: ReportSummary | null = null;
  loading = false;
  error: string | null = null;

  activeTab: 'summary' | 'users' | 'actions' = 'summary';
  searchEmail = '';
  sortField: 'name' | 'submissions' | 'reviews' | 'approvals' | 'rejections' | 'withdrawals' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  private destroy$ = new Subject<void>();

  constructor(private reportService: UserActivityReportService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReport(): void {
    this.loading = true;
    this.error = null;

    this.reportService.getFullReport()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.report = data;
          // Calculate reviews as sum of approvals + rejections + withdrawals
          const totalReviews = data.totalApprovals + data.totalRejections + data.totalWithdrawals;
          this.summary = {
            submissions: data.totalSubmissions,
            reviews: totalReviews,
            approvals: data.totalApprovals,
            rejections: data.totalRejections,
            withdrawals: data.totalWithdrawals,
            totalUsers: data.totalUsers
          };
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading report:', err);
          this.error = 'Error loading user activity report. Please try again later.';
          this.loading = false;
        }
      });
  }

  getFilteredUsers() {
    if (!this.report?.userStats) {
      return [];
    }

    let filtered = this.report.userStats;

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
  }

  downloadCSV(): void {
    if (!this.report?.userStats) {
      return;
    }

    const headers = ['Email', 'Name', 'Submissions', 'Reviews', 'Approvals', 'Rejections', 'Withdrawals'];
    const rows = this.report.userStats.map(user => [
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

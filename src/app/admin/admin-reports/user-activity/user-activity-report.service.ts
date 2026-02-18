import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RESTURLCombiner } from '../../../core/url-combiner/rest-url-combiner';

export interface UserAction {
  actionType: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN' | 'REVIEWED';
  userName: string;
  email: string;
  actionDate: string;
  itemUUID: string;
  details?: string;
}

export interface UserActivityStats {
  userName: string;
  email: string;
  totalSubmissions: number;
  totalReviews: number;
  totalApprovals: number;
  totalRejections: number;
  totalWithdrawals: number;
  actions: UserAction[];
}

export interface UserActivityReport {
  totalUsers: number;
  totalSubmissions: number;
  totalReviews: number;
  totalApprovals: number;
  totalRejections: number;
  totalWithdrawals: number;
  userStats: UserActivityStats[];
}

export interface ReportSummary {
  submissions: number;
  reviews: number;
  approvals: number;
  rejections: number;
  withdrawals: number;
  totalUsers: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserActivityReportService {
  constructor(private http: HttpClient) {}

  /**
   * Get the full user activity report
   */
  getFullReport(): Observable<UserActivityReport> {
    const url = new RESTURLCombiner('/reporting/user-activity/report').toString();
    return this.http.get<UserActivityReport>(url);
  }

  /**
   * Get statistics for a specific user by email
   */
  getUserReport(email: string): Observable<UserActivityStats> {
    const url = new RESTURLCombiner('/reporting/user-activity/user', encodeURIComponent(email)).toString();
    return this.http.get<UserActivityStats>(url);
  }

  /**
   * Get summary statistics only
   */
  getSummary(): Observable<ReportSummary> {
    const url = new RESTURLCombiner('/reporting/user-activity/summary').toString();
    return this.http.get<ReportSummary>(url);
  }

  /**
   * Get all actions without aggregation
   */
  getAllActions(): Observable<UserAction[]> {
    const url = new RESTURLCombiner('/reporting/user-activity/actions').toString();
    return this.http.get<UserAction[]>(url);
  }
}

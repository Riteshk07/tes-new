import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { UserDto } from '../../models/user.dto';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Dashboard</h1>
          <p *ngIf="currentUser$ | async as user">
            Welcome back, {{user.firstName}} {{user.lastName}}!
          </p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" routerLink="/enquiries/create">
            <mat-icon>add</mat-icon>
            New Enquiry
          </button>
        </div>
      </div>

      <!-- Key Metrics Cards -->
      <div class="metrics-section">
        <div class="metrics-grid">
          <mat-card class="metric-card total">
            <mat-card-content>
              <div class="metric-content">
                <div class="metric-icon">
                  <mat-icon>assessment</mat-icon>
                </div>
                <div class="metric-info">
                  <div class="metric-number">{{dashboardData.totalRevenue | currency:'INR':'symbol':'1.0-0'}}</div>
                  <div class="metric-label">Total Revenue</div>
                  <div class="metric-change positive">
                    <mat-icon>trending_up</mat-icon>
                    +12.5% from last month
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card enquiries">
            <mat-card-content>
              <div class="metric-content">
                <div class="metric-icon">
                  <mat-icon>help_outline</mat-icon>
                </div>
                <div class="metric-info">
                  <div class="metric-number">{{dashboardData.totalEnquiries}}</div>
                  <div class="metric-label">Total Enquiries</div>
                  <div class="metric-detail">{{dashboardData.pendingEnquiries}} pending</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card quotations">
            <mat-card-content>
              <div class="metric-content">
                <div class="metric-icon">
                  <mat-icon>description</mat-icon>
                </div>
                <div class="metric-info">
                  <div class="metric-number">{{dashboardData.totalQuotations}}</div>
                  <div class="metric-label">Total Quotations</div>
                  <div class="metric-detail">{{dashboardData.acceptedQuotations}} accepted</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card conversion">
            <mat-card-content>
              <div class="metric-content">
                <div class="metric-icon">
                  <mat-icon>trending_up</mat-icon>
                </div>
                <div class="metric-info">
                  <div class="metric-number">{{dashboardData.conversionRate}}%</div>
                  <div class="metric-label">Conversion Rate</div>
                  <div class="metric-change positive">
                    <mat-icon>arrow_upward</mat-icon>
                    +2.3% improvement
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <mat-tab-group class="dashboard-tabs">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="tab-content">
            <div class="overview-grid">
              <!-- Quick Stats -->
              <mat-card class="stats-card">
                <mat-card-header>
                  <mat-card-title>Quick Statistics</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stats-list">
                    <div class="stat-item">
                      <span class="stat-label">Active Customers</span>
                      <span class="stat-value">{{dashboardData.activeCustomers}}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Products in Catalog</span>
                      <span class="stat-value">{{dashboardData.totalProducts}}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Staff Members</span>
                      <span class="stat-value">{{dashboardData.totalStaff}}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Brands</span>
                      <span class="stat-value">{{dashboardData.totalBrands}}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Enquiry Status Breakdown -->
              <mat-card class="status-card">
                <mat-card-header>
                  <mat-card-title>Enquiry Status</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="status-breakdown">
                    <div class="status-item">
                      <div class="status-info">
                        <span class="status-label">Pending</span>
                        <span class="status-count">{{dashboardData.enquiryStatus.pending}}</span>
                      </div>
                      <mat-progress-bar mode="determinate" [value]="getStatusPercentage('pending')" color="warn"></mat-progress-bar>
                    </div>
                    <div class="status-item">
                      <div class="status-info">
                        <span class="status-label">In Progress</span>
                        <span class="status-count">{{dashboardData.enquiryStatus.inProgress}}</span>
                      </div>
                      <mat-progress-bar mode="determinate" [value]="getStatusPercentage('inProgress')" color="primary"></mat-progress-bar>
                    </div>
                    <div class="status-item">
                      <div class="status-info">
                        <span class="status-label">Quoted</span>
                        <span class="status-count">{{dashboardData.enquiryStatus.quoted}}</span>
                      </div>
                      <mat-progress-bar mode="determinate" [value]="getStatusPercentage('quoted')" color="accent"></mat-progress-bar>
                    </div>
                    <div class="status-item">
                      <div class="status-info">
                        <span class="status-label">Completed</span>
                        <span class="status-count">{{dashboardData.enquiryStatus.completed}}</span>
                      </div>
                      <mat-progress-bar mode="determinate" [value]="getStatusPercentage('completed')" color="primary"></mat-progress-bar>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>

            <!-- Recent Activity -->
            <mat-card class="activity-card">
              <mat-card-header>
                <mat-card-title>Recent Activity</mat-card-title>
                <mat-card-subtitle>Latest system activities</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="activity-timeline">
                  <div *ngFor="let activity of recentActivities" class="activity-item">
                    <div class="activity-icon" [class]="activity.type">
                      <mat-icon>{{getActivityIcon(activity.type)}}</mat-icon>
                    </div>
                    <div class="activity-content">
                      <div class="activity-description">{{activity.description}}</div>
                      <div class="activity-meta">
                        <span class="activity-user">{{activity.user}}</span>
                        <span class="activity-time">{{activity.time}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- My Tasks Tab -->
        <mat-tab label="My Tasks">
          <div class="tab-content">
            <div class="tasks-section">
              <!-- Assigned Enquiries -->
              <mat-card class="tasks-card">
                <mat-card-header>
                  <mat-card-title>Assigned Enquiries</mat-card-title>
                  <mat-card-subtitle>Enquiries assigned to you</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div *ngIf="assignedEnquiries.length === 0" class="no-tasks">
                    <mat-icon>assignment_turned_in</mat-icon>
                    <p>No enquiries assigned to you</p>
                  </div>
                  <div *ngFor="let enquiry of assignedEnquiries" class="task-item">
                    <div class="task-info">
                      <div class="task-title">{{enquiry.subject}}</div>
                      <div class="task-meta">
                        <mat-chip [class]="'priority-' + enquiry.priority.toLowerCase()">
                          {{enquiry.priority}}
                        </mat-chip>
                        <span class="task-customer">{{enquiry.customerName}}</span>
                      </div>
                    </div>
                    <div class="task-actions">
                      <button mat-button [routerLink]="['/enquiries/view', enquiry.id]" color="primary">
                        View
                      </button>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Pending Quotations -->
              <mat-card class="tasks-card">
                <mat-card-header>
                  <mat-card-title>Pending Quotations</mat-card-title>
                  <mat-card-subtitle>Quotations requiring attention</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div *ngIf="pendingQuotations.length === 0" class="no-tasks">
                    <mat-icon>description</mat-icon>
                    <p>No pending quotations</p>
                  </div>
                  <div *ngFor="let quotation of pendingQuotations" class="task-item">
                    <div class="task-info">
                      <div class="task-title">{{quotation.quotationNumber}}</div>
                      <div class="task-meta">
                        <span class="task-customer">{{quotation.customerName}}</span>
                        <span class="task-amount">₹{{quotation.grandTotal | number:'1.0-0'}}</span>
                      </div>
                    </div>
                    <div class="task-actions">
                      <button mat-button [routerLink]="['/quotations/view', quotation.id]" color="primary">
                        View
                      </button>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Analytics Tab -->
        <mat-tab label="Analytics">
          <div class="tab-content">
            <div class="analytics-grid">
              <!-- Performance Metrics -->
              <mat-card class="analytics-card">
                <mat-card-header>
                  <mat-card-title>Performance Metrics</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="metrics-list">
                    <div class="metric-row">
                      <span class="metric-name">Average Response Time</span>
                      <span class="metric-value">{{dashboardData.avgResponseTime}} hours</span>
                    </div>
                    <div class="metric-row">
                      <span class="metric-name">Enquiry to Quotation Time</span>
                      <span class="metric-value">{{dashboardData.avgQuotationTime}} hours</span>
                    </div>
                    <div class="metric-row">
                      <span class="metric-name">Customer Satisfaction</span>
                      <span class="metric-value">{{dashboardData.customerSatisfaction}}/5</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Top Products -->
              <mat-card class="analytics-card">
                <mat-card-header>
                  <mat-card-title>Top Enquired Products</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="top-products">
                    <div *ngFor="let product of topProducts; let i = index" class="product-rank">
                      <span class="rank">{{i + 1}}</span>
                      <span class="product-name">{{product.name}}</span>
                      <span class="enquiry-count">{{product.enquiryCount}} enquiries</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .header-content h1 {
      margin: 0;
      background: linear-gradient(135deg, #2653a6 0%, #ea3b26 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 2.2rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header-content p {
      margin: 8px 0 0 0;
      color: #4b494c;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      gap: 16px;
    }

    /* Metrics Section */
    .metrics-section {
      margin-bottom: 32px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .metric-card {
      transition: all 0.3s ease;
      border: 1px solid rgba(75, 73, 76, 0.1);
      border-radius: 16px !important;
      overflow: hidden;
      position: relative;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%);
      backdrop-filter: blur(10px);
    }

    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #2653a6 0%, #4285f4 50%, #ea3b26 100%);
    }

    .metric-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(38, 83, 166, 0.15);
      border-color: rgba(38, 83, 166, 0.2);
    }

    .metric-card.total::before {
      background: linear-gradient(90deg, #ea3b26 0%, #ff6b54 100%);
    }

    .metric-card.enquiries::before {
      background: linear-gradient(90deg, #2653a6 0%, #4285f4 100%);
    }

    .metric-card.quotations::before {
      background: linear-gradient(90deg, #4b494c 0%, #6d6b6c 100%);
    }

    .metric-card.conversion::before {
      background: linear-gradient(90deg, #ea3b26 0%, #2653a6 50%, #4b494c 100%);
    }

    .metric-content {
      display: flex;
      align-items: center;
      gap: 20px;
      position: relative;
      z-index: 1;
    }

    .metric-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ea3b26 0%, #ff6b54 100%);
      box-shadow: 0 8px 20px rgba(234, 59, 38, 0.3);
      transition: all 0.3s ease;
    }

    .metric-card.enquiries .metric-icon {
      background: linear-gradient(135deg, #2653a6 0%, #4285f4 100%);
      box-shadow: 0 8px 20px rgba(38, 83, 166, 0.3);
    }

    .metric-card.quotations .metric-icon {
      background: linear-gradient(135deg, #4b494c 0%, #6d6b6c 100%);
      box-shadow: 0 8px 20px rgba(75, 73, 76, 0.3);
    }

    .metric-card.conversion .metric-icon {
      background: linear-gradient(135deg, #2653a6 0%, #ea3b26 100%);
      box-shadow: 0 8px 20px rgba(38, 83, 166, 0.2);
    }

    .metric-card:hover .metric-icon {
      transform: scale(1.05);
      box-shadow: 0 12px 24px rgba(234, 59, 38, 0.4);
    }

    .metric-card.enquiries:hover .metric-icon {
      box-shadow: 0 12px 24px rgba(38, 83, 166, 0.4);
    }

    .metric-card.quotations:hover .metric-icon {
      box-shadow: 0 12px 24px rgba(75, 73, 76, 0.4);
    }

    .metric-card.conversion:hover .metric-icon {
      box-shadow: 0 12px 24px rgba(38, 83, 166, 0.3);
    }

    .metric-icon mat-icon {
      color: white;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .metric-info {
      flex: 1;
    }

    .metric-number {
      font-size: 2.4rem;
      font-weight: 700;
      color: #4b494c;
      margin-bottom: 4px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .metric-card.total .metric-number {
      background: linear-gradient(135deg, #ea3b26 0%, #ff6b54 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .metric-card.enquiries .metric-number {
      background: linear-gradient(135deg, #2653a6 0%, #4285f4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .metric-card.quotations .metric-number {
      background: linear-gradient(135deg, #4b494c 0%, #6d6b6c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .metric-card.conversion .metric-number {
      background: linear-gradient(135deg, #2653a6 0%, #ea3b26 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .metric-label {
      color: #4b494c;
      font-size: 0.95rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metric-detail {
      color: rgba(75, 73, 76, 0.7);
      font-size: 0.85rem;
      margin-top: 4px;
      font-weight: 500;
    }

    .metric-change {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      margin-top: 10px;
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: 500;
      width: fit-content;
    }

    .metric-change.positive {
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
      color: #2e7d32;
      border: 1px solid rgba(76, 175, 80, 0.2);
    }

    .metric-change.negative {
      background: linear-gradient(135deg, rgba(234, 59, 38, 0.1) 0%, rgba(234, 59, 38, 0.05) 100%);
      color: #ea3b26;
      border: 1px solid rgba(234, 59, 38, 0.2);
    }

    .metric-change mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Tabs */
    .dashboard-tabs {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%);
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(38, 83, 166, 0.08);
      border: 1px solid rgba(75, 73, 76, 0.1);
      backdrop-filter: blur(10px);
    }

    .dashboard-tabs ::ng-deep .mat-mdc-tab-group {
      background: transparent;
    }

    .dashboard-tabs ::ng-deep .mat-mdc-tab-header {
      background: linear-gradient(135deg, #2653a6 0%, #4285f4 100%);
      border-radius: 16px 16px 0 0;
      border-bottom: 3px solid #ea3b26;
    }

    .dashboard-tabs ::ng-deep .mat-mdc-tab-label {
      color: rgba(255, 255, 255, 0.8) !important;
      font-weight: 500 !important;
    }

    .dashboard-tabs ::ng-deep .mat-mdc-tab-label.mdc-tab--active {
      color: white !important;
      font-weight: 600 !important;
    }

    .dashboard-tabs ::ng-deep .mdc-tab-indicator__content--underline {
      background-color: #ea3b26 !important;
      height: 3px !important;
      border-radius: 2px !important;
    }

    .tab-content {
      padding: 24px;
    }

    /* Overview Tab */
    .overview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    .stats-card, .status-card {
      height: fit-content;
    }

    .stats-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .stat-item:last-child {
      border-bottom: none;
    }

    .stat-label {
      color: #666;
      font-weight: 500;
    }

    .stat-value {
      font-weight: 700;
      color: #333;
      font-size: 1.1rem;
    }

    .status-breakdown {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .status-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .status-label {
      font-weight: 500;
      color: #666;
    }

    .status-count {
      font-weight: 700;
      color: #333;
    }

    /* Activity */
    .activity-card {
      grid-column: 1 / -1;
    }

    .activity-timeline {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .activity-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-icon.enquiry {
      background: linear-gradient(135deg, rgba(38, 83, 166, 0.1) 0%, rgba(66, 133, 244, 0.1) 100%);
      color: #2653a6;
      border: 1px solid rgba(38, 83, 166, 0.2);
    }

    .activity-icon.quotation {
      background: linear-gradient(135deg, rgba(75, 73, 76, 0.1) 0%, rgba(109, 107, 108, 0.1) 100%);
      color: #4b494c;
      border: 1px solid rgba(75, 73, 76, 0.2);
    }

    .activity-icon.customer {
      background: linear-gradient(135deg, rgba(234, 59, 38, 0.1) 0%, rgba(255, 107, 84, 0.1) 100%);
      color: #ea3b26;
      border: 1px solid rgba(234, 59, 38, 0.2);
    }

    .activity-icon.product {
      background: linear-gradient(135deg, rgba(38, 83, 166, 0.08) 0%, rgba(234, 59, 38, 0.08) 100%);
      color: #2653a6;
      border: 1px solid rgba(38, 83, 166, 0.15);
    }

    .activity-content {
      flex: 1;
    }

    .activity-description {
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .activity-meta {
      display: flex;
      gap: 16px;
      font-size: 0.85rem;
      color: #666;
    }

    /* Tasks Tab */
    .tasks-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .tasks-card {
      height: fit-content;
    }

    .no-tasks {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #999;
      text-align: center;
    }

    .no-tasks mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .task-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .task-item:last-child {
      border-bottom: none;
    }

    .task-info {
      flex: 1;
    }

    .task-title {
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .task-customer {
      color: #666;
      font-size: 0.9rem;
    }

    .task-amount {
      font-weight: 500;
      color: #1976d2;
    }

    .priority-high {
      background-color: #ffebee !important;
      color: #c62828 !important;
    }

    .priority-medium {
      background-color: #fff3e0 !important;
      color: #ef6c00 !important;
    }

    .priority-low {
      background-color: #f5f5f5 !important;
      color: #666 !important;
    }

    /* Analytics Tab */
    .analytics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .analytics-card {
      height: fit-content;
    }

    .metrics-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .metric-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .metric-row:last-child {
      border-bottom: none;
    }

    .metric-name {
      color: #666;
      font-weight: 500;
    }

    .metric-value {
      font-weight: 700;
      color: #333;
    }

    .top-products {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .product-rank {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .product-rank:last-child {
      border-bottom: none;
    }

    .rank {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ea3b26 0%, #2653a6 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 700;
      flex-shrink: 0;
      box-shadow: 0 4px 8px rgba(234, 59, 38, 0.3);
    }

    .product-name {
      flex: 1;
      font-weight: 500;
      color: #333;
    }

    .enquiry-count {
      color: #666;
      font-size: 0.9rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .overview-grid,
      .tasks-section,
      .analytics-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .task-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<UserDto | null>;
  
  dashboardData = {
    totalRevenue: 2850000,
    totalEnquiries: 187,
    pendingEnquiries: 23,
    totalQuotations: 145,
    acceptedQuotations: 89,
    conversionRate: 74.2,
    activeCustomers: 156,
    totalProducts: 334,
    totalStaff: 12,
    totalBrands: 28,
    enquiryStatus: {
      pending: 23,
      inProgress: 45,
      quoted: 67,
      completed: 89
    },
    avgResponseTime: 4.2,
    avgQuotationTime: 18.5,
    customerSatisfaction: 4.7
  };

  recentActivities = [
    {
      type: 'enquiry',
      description: 'New enquiry submitted for Industrial Motors',
      user: 'Alice Johnson (ABC Corporation)',
      time: '2 hours ago'
    },
    {
      type: 'quotation',
      description: 'Quotation QUO-2024-045 sent to customer',
      user: 'John Doe',
      time: '3 hours ago'
    },
    {
      type: 'customer',
      description: 'New customer registered: XYZ Manufacturing',
      user: 'System',
      time: '5 hours ago'
    },
    {
      type: 'quotation',
      description: 'Quotation QUO-2024-044 accepted by customer',
      user: 'Jane Smith',
      time: '6 hours ago'
    },
    {
      type: 'product',
      description: 'New product added: Advanced Control Panel',
      user: 'Bob Johnson',
      time: '8 hours ago'
    }
  ];

  assignedEnquiries = [
    {
      id: 1,
      subject: 'Industrial Motor Requirements',
      priority: 'High',
      customerName: 'ABC Corporation'
    },
    {
      id: 2,
      subject: 'Control Panel Installation',
      priority: 'Medium',
      customerName: 'XYZ Industries'
    },
    {
      id: 3,
      subject: 'Precision Tools Enquiry',
      priority: 'Low',
      customerName: 'Tech Solutions Ltd'
    }
  ];

  pendingQuotations = [
    {
      id: 1,
      quotationNumber: 'QUO-2024-045',
      customerName: 'ABC Corporation',
      grandTotal: 125000
    },
    {
      id: 2,
      quotationNumber: 'QUO-2024-046',
      customerName: 'Manufacturing Co',
      grandTotal: 85000
    }
  ];

  topProducts = [
    { name: 'Industrial Motor IM-001', enquiryCount: 45 },
    { name: 'Control Panel CP-200', enquiryCount: 32 },
    { name: 'Precision Tool PT-150', enquiryCount: 28 },
    { name: 'Electronic Controller EC-300', enquiryCount: 24 },
    { name: 'Hydraulic Pump HP-400', enquiryCount: 19 }
  ];

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // In a real application, this would load data from various services
    // For now, we're using mock data above
    console.log('Dashboard data loaded');
  }

  getStatusPercentage(status: string): number {
    const total = Object.values(this.dashboardData.enquiryStatus).reduce((sum, count) => sum + count, 0);
    const statusCount = this.dashboardData.enquiryStatus[status as keyof typeof this.dashboardData.enquiryStatus];
    return (statusCount / total) * 100;
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'enquiry': 'help_outline',
      'quotation': 'description',
      'customer': 'person_add',
      'product': 'inventory_2',
      'user': 'people'
    };
    return icons[type] || 'info';
  }
}
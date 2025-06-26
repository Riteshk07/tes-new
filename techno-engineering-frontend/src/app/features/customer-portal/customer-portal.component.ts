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
import { ResponsiveService } from '../../services/responsive.service';
import { UserDto } from '../../models/user.dto';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer-portal',
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
    <div class="customer-portal-container">
      <div class="portal-header">
        <div class="header-content">
          <h1>Customer Portal</h1>
          <p *ngIf="currentUser$ | async as user">
            Welcome, {{user.firstName}} {{user.lastName}}!
          </p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" routerLink="/enquiries/create">
            <mat-icon>add</mat-icon>
            New Enquiry
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h2>Quick Actions</h2>
        <div class="actions-grid" [class]="'responsive-grid cols-' + getGridColumns()">
          <mat-card class="action-card" routerLink="/enquiries/create">
            <mat-card-content>
              <div class="action-content">
                <mat-icon class="action-icon">help_outline</mat-icon>
                <div class="action-info">
                  <h3>Submit Enquiry</h3>
                  <p>Request quotations for products</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card" routerLink="/products">
            <mat-card-content>
              <div class="action-content">
                <mat-icon class="action-icon">inventory</mat-icon>
                <div class="action-info">
                  <h3>Browse Products</h3>
                  <p>Explore our product catalog</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card" routerLink="/enquiries">
            <mat-card-content>
              <div class="action-content">
                <mat-icon class="action-icon">history</mat-icon>
                <div class="action-info">
                  <h3>Enquiry History</h3>
                  <p>View your past enquiries</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card" routerLink="/quotations">
            <mat-card-content>
              <div class="action-content">
                <mat-icon class="action-icon">description</mat-icon>
                <div class="action-info">
                  <h3>Quotations</h3>
                  <p>Review received quotations</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <mat-tab-group class="portal-tabs">
        <!-- Recent Enquiries Tab -->
        <mat-tab label="Recent Enquiries">
          <div class="tab-content">
            <mat-card class="enquiries-card">
              <mat-card-header>
                <mat-card-title>Your Recent Enquiries</mat-card-title>
                <mat-card-subtitle>Track your enquiry status</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div *ngIf="recentEnquiries.length === 0" class="no-data">
                  <mat-icon>assignment</mat-icon>
                  <p>No enquiries submitted yet</p>
                  <button mat-raised-button color="primary" routerLink="/enquiries/create">
                    Submit Your First Enquiry
                  </button>
                </div>
                <div *ngFor="let enquiry of recentEnquiries" class="enquiry-item">
                  <div class="enquiry-info">
                    <div class="enquiry-title">{{enquiry.subject}}</div>
                    <div class="enquiry-meta">
                      <mat-chip [class]="'status-' + enquiry.status.toLowerCase()">
                        {{enquiry.status}}
                      </mat-chip>
                      <span class="enquiry-date">{{enquiry.createdDate | date:'medium'}}</span>
                    </div>
                    <div class="enquiry-description">{{enquiry.description}}</div>
                  </div>
                  <div class="enquiry-actions">
                    <button mat-button [routerLink]="['/enquiries/view', enquiry.id]" color="primary">
                      View Details
                    </button>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Quotations Tab -->
        <mat-tab label="Quotations">
          <div class="tab-content">
            <mat-card class="quotations-card">
              <mat-card-header>
                <mat-card-title>Received Quotations</mat-card-title>
                <mat-card-subtitle>Review and respond to quotations</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div *ngIf="recentQuotations.length === 0" class="no-data">
                  <mat-icon>description</mat-icon>
                  <p>No quotations received yet</p>
                  <button mat-raised-button color="primary" routerLink="/enquiries/create">
                    Submit an Enquiry
                  </button>
                </div>
                <div *ngFor="let quotation of recentQuotations" class="quotation-item">
                  <div class="quotation-info">
                    <div class="quotation-title">{{quotation.quotationNumber}}</div>
                    <div class="quotation-meta">
                      <mat-chip [class]="'status-' + quotation.status.toLowerCase()">
                        {{quotation.status}}
                      </mat-chip>
                      <span class="quotation-amount">₹{{quotation.grandTotal | number:'1.0-0'}}</span>
                    </div>
                    <div class="quotation-description">{{quotation.description}}</div>
                  </div>
                  <div class="quotation-actions">
                    <button mat-button [routerLink]="['/quotations/view', quotation.id]" color="primary">
                      View Quotation
                    </button>
                    <button mat-button color="accent" *ngIf="quotation.status === 'Sent'">
                      Accept
                    </button>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Account Tab -->
        <mat-tab label="Account">
          <div class="tab-content">
            <div class="account-grid">
              <!-- Profile Information -->
              <mat-card class="profile-card">
                <mat-card-header>
                  <mat-card-title>Profile Information</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="profile-info" *ngIf="currentUser$ | async as user">
                    <div class="info-row">
                      <span class="info-label">Name:</span>
                      <span class="info-value">{{user.firstName}} {{user.lastName}}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Email:</span>
                      <span class="info-value">{{user.email}}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Phone:</span>
                      <span class="info-value">{{user.phoneNumber || 'Not provided'}}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Role:</span>
                      <span class="info-value">{{user.role}}</span>
                    </div>
                  </div>
                  <div class="profile-actions">
                    <button mat-button color="primary">Edit Profile</button>
                    <button mat-button color="accent">Change Password</button>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Account Statistics -->
              <mat-card class="stats-card">
                <mat-card-header>
                  <mat-card-title>Account Summary</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stats-grid">
                    <div class="stat-item">
                      <div class="stat-number">{{accountStats.totalEnquiries}}</div>
                      <div class="stat-label">Total Enquiries</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number">{{accountStats.totalQuotations}}</div>
                      <div class="stat-label">Quotations Received</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number">{{accountStats.acceptedQuotations}}</div>
                      <div class="stat-label">Orders Placed</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number">₹{{accountStats.totalValue | number:'1.0-0'}}</div>
                      <div class="stat-label">Total Business</div>
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
    .customer-portal-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .portal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .header-content h1 {
      margin: 0;
      color: #333;
      font-size: 2rem;
    }

    .header-content p {
      margin: 8px 0 0 0;
      color: #666;
      font-size: 1.1rem;
    }

    .header-actions {
      display: flex;
      gap: 16px;
    }

    /* Quick Actions */
    .quick-actions-section {
      margin-bottom: 32px;
    }

    .quick-actions-section h2 {
      margin-bottom: 16px;
      color: #333;
    }

    .actions-grid {
      display: grid;
      gap: 24px;
    }

    .action-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .action-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .action-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #1976d2;
    }

    .action-info h3 {
      margin: 0 0 4px 0;
      color: #333;
      font-size: 1.1rem;
    }

    .action-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    /* Tabs */
    .portal-tabs {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .tab-content {
      padding: 24px;
    }

    /* Enquiries */
    .enquiries-card,
    .quotations-card {
      height: fit-content;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: #999;
      text-align: center;
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    .no-data p {
      margin: 0 0 24px 0;
      font-size: 1.1rem;
    }

    .enquiry-item,
    .quotation-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .enquiry-item:last-child,
    .quotation-item:last-child {
      border-bottom: none;
    }

    .enquiry-info,
    .quotation-info {
      flex: 1;
    }

    .enquiry-title,
    .quotation-title {
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
      font-size: 1.1rem;
    }

    .enquiry-meta,
    .quotation-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .enquiry-date {
      color: #666;
      font-size: 0.9rem;
    }

    .enquiry-amount,
    .quotation-amount {
      font-weight: 500;
      color: #1976d2;
    }

    .enquiry-description,
    .quotation-description {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .enquiry-actions,
    .quotation-actions {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }

    /* Status chips */
    .status-pending {
      background-color: #fff3e0 !important;
      color: #ef6c00 !important;
    }

    .status-inprogress {
      background-color: #e3f2fd !important;
      color: #1976d2 !important;
    }

    .status-completed {
      background-color: #e8f5e8 !important;
      color: #2e7d32 !important;
    }

    .status-sent {
      background-color: #f3e5f5 !important;
      color: #7b1fa2 !important;
    }

    .status-accepted {
      background-color: #e8f5e8 !important;
      color: #2e7d32 !important;
    }

    /* Account Tab */
    .account-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .profile-card,
    .stats-card {
      height: fit-content;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      color: #666;
      font-weight: 500;
    }

    .info-value {
      color: #333;
      font-weight: 400;
    }

    .profile-actions {
      display: flex;
      gap: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .stat-item {
      text-align: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1976d2;
      margin-bottom: 4px;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .account-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .portal-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .enquiry-item,
      .quotation-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CustomerPortalComponent implements OnInit {
  currentUser$: Observable<UserDto | null>;
  
  recentEnquiries = [
    {
      id: 1,
      subject: 'Industrial Motor Requirements',
      description: 'Need quotation for 5HP industrial motors for manufacturing unit',
      status: 'In Progress',
      createdDate: new Date('2024-01-15T10:30:00')
    },
    {
      id: 2,
      subject: 'Control Panel Installation',
      description: 'Require control panels for automated assembly line',
      status: 'Completed',
      createdDate: new Date('2024-01-10T14:20:00')
    }
  ];

  recentQuotations = [
    {
      id: 1,
      quotationNumber: 'QUO-2024-001',
      description: 'Industrial Motor Package',
      status: 'Sent',
      grandTotal: 125000,
      createdDate: new Date('2024-01-16T09:15:00')
    },
    {
      id: 2,
      quotationNumber: 'QUO-2024-002',
      description: 'Control Panel Solution',
      status: 'Accepted',
      grandTotal: 85000,
      createdDate: new Date('2024-01-12T11:45:00')
    }
  ];

  accountStats = {
    totalEnquiries: 12,
    totalQuotations: 8,
    acceptedQuotations: 5,
    totalValue: 450000
  };

  constructor(
    private authService: AuthService,
    private responsiveService: ResponsiveService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.loadPortalData();
  }

  private loadPortalData() {
    // In a real application, this would load data from various services
    console.log('Customer portal data loaded');
  }

  getGridColumns(): number {
    return this.responsiveService.getColumnsForBreakpoint();
  }
}
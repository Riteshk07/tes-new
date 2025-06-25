import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatListModule
  ],
  template: `
    <div class="customer-detail-container">
      <div class="header">
        <h1>Customer Details</h1>
        <button mat-button routerLink="/customers">
          <mat-icon>arrow_back</mat-icon>
          Back to Customers
        </button>
      </div>

      <div class="customer-info" *ngIf="customer">
        <mat-card class="profile-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>person</mat-icon>
            <mat-card-title>{{customer.firstName}} {{customer.lastName}}</mat-card-title>
            <mat-card-subtitle>{{customer.organizationName || 'Individual Customer'}}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <strong>Email:</strong>
                <span>{{customer.email}}</span>
              </div>
              <div class="info-item">
                <strong>Contact:</strong>
                <span>{{customer.contactNumber}}</span>
              </div>
              <div class="info-item" *ngIf="customer.gstin">
                <strong>GSTIN:</strong>
                <span>{{customer.gstin}}</span>
              </div>
              <div class="info-item">
                <strong>Status:</strong>
                <span class="status-badge" [class.active]="customer.isActive" [class.inactive]="!customer.isActive">
                  {{customer.isActive ? 'Active' : 'Inactive'}}
                </span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-tab-group class="details-tabs">
          <mat-tab label="Addresses">
            <div class="tab-content">
              <div class="addresses-section" *ngIf="customer.addresses && customer.addresses.length > 0; else noAddresses">
                <mat-card *ngFor="let address of customer.addresses" class="address-card">
                  <mat-card-content>
                    <div class="address-details">
                      <p><strong>Address:</strong> {{address.addressDetail}}</p>
                      <p><strong>City:</strong> {{address.city}}</p>
                      <p><strong>State:</strong> {{address.state}}</p>
                      <p><strong>Pincode:</strong> {{address.pincode}}</p>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
              <ng-template #noAddresses>
                <div class="no-data">
                  <mat-icon>location_off</mat-icon>
                  <p>No addresses found</p>
                </div>
              </ng-template>
            </div>
          </mat-tab>

          <mat-tab label="Enquiries">
            <div class="tab-content">
              <div class="enquiries-section" *ngIf="enquiries.length > 0; else noEnquiries">
                <mat-list>
                  <mat-list-item *ngFor="let enquiry of enquiries">
                    <mat-icon matListItemIcon>help</mat-icon>
                    <div matListItemTitle>Enquiry #{{enquiry.id}}</div>
                    <div matListItemLine>{{enquiry.date}} - {{enquiry.status}}</div>
                    <button mat-icon-button matListItemMeta>
                      <mat-icon>arrow_forward</mat-icon>
                    </button>
                  </mat-list-item>
                </mat-list>
              </div>
              <ng-template #noEnquiries>
                <div class="no-data">
                  <mat-icon>help_outline</mat-icon>
                  <p>No enquiries found</p>
                </div>
              </ng-template>
            </div>
          </mat-tab>

          <mat-tab label="Quotations">
            <div class="tab-content">
              <div class="quotations-section" *ngIf="quotations.length > 0; else noQuotations">
                <mat-list>
                  <mat-list-item *ngFor="let quotation of quotations">
                    <mat-icon matListItemIcon>description</mat-icon>
                    <div matListItemTitle>Quotation #{{quotation.id}}</div>
                    <div matListItemLine>{{quotation.date}} - ₹{{quotation.amount}}</div>
                    <button mat-icon-button matListItemMeta>
                      <mat-icon>download</mat-icon>
                    </button>
                  </mat-list-item>
                </mat-list>
              </div>
              <ng-template #noQuotations>
                <div class="no-data">
                  <mat-icon>description</mat-icon>
                  <p>No quotations found</p>
                </div>
              </ng-template>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .customer-detail-container {
      padding: 24px;
      max-width: 1200px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .profile-card {
      margin-bottom: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item strong {
      color: #666;
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      display: inline-block;
      width: fit-content;
    }

    .status-badge.active {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.inactive {
      background-color: #ffebee;
      color: #c62828;
    }

    .details-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tab-content {
      padding: 24px;
      min-height: 300px;
    }

    .address-card {
      margin-bottom: 16px;
    }

    .address-details p {
      margin: 8px 0;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #999;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .no-data p {
      margin: 0;
      font-size: 1.1rem;
    }
  `]
})
export class CustomerDetailComponent implements OnInit {
  customerId: number | null = null;
  customer: any = null;
  enquiries: any[] = [];
  quotations: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.customerId = +params['id'];
      this.loadCustomerDetails();
    });
  }

  private loadCustomerDetails() {
    // Mock customer data - replace with actual service call
    this.customer = {
      id: this.customerId,
      firstName: 'Alice',
      lastName: 'Johnson',
      organizationName: 'ABC Corporation',
      email: 'alice@abccorp.com',
      contactNumber: '+1234567890',
      gstin: '29ABCDE1234F1Z5',
      isActive: true,
      addresses: [
        {
          id: 1,
          addressDetail: '123 Business Street, Tech Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        {
          id: 2,
          addressDetail: '456 Corporate Avenue',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        }
      ]
    };

    // Mock enquiries
    this.enquiries = [
      { id: 1001, date: '2024-01-15', status: 'Pending' },
      { id: 1002, date: '2024-01-10', status: 'Processed' },
      { id: 1003, date: '2024-01-05', status: 'Completed' }
    ];

    // Mock quotations
    this.quotations = [
      { id: 2001, date: '2024-01-12', amount: 50000 },
      { id: 2002, date: '2024-01-08', amount: 75000 }
    ];
  }
}
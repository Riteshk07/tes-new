import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuotationDto, QuotationStatus } from '../../../models/quotation.dto';

// Import shared components
import { 
  SearchInputComponent,
  ButtonComponent,
  CardComponent,
  SelectComponent,
  ChipComponent,
  TableComponent
} from '../../../shared/components';

interface PageEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

@Component({
  selector: 'app-quotation-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SearchInputComponent,
    ButtonComponent,
    CardComponent,
    SelectComponent,
    ChipComponent,
    TableComponent
  ],
  template: `
    <div class="quotation-list-container">
      <div class="header">
        <h1>Quotation Management</h1>
        <div class="header-actions">
          <app-button variant="primary" routerLink="/quotations/create">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            New Quotation
          </app-button>
          <app-button variant="outline" (click)="exportQuotations()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            Export
          </app-button>
          <app-button variant="outline" (click)="refreshData()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
            </svg>
            Refresh
          </app-button>
        </div>
      </div>

      <!-- Filters -->
      <app-card title="Filter Quotations" class="filters-card">
        <div class="filters-row">
          <app-search-input
            placeholder="Search by quotation number, customer name, or reference"
            (search)="onSearch($event)"
            width="400px"
          ></app-search-input>

          <app-select
            placeholder="Status"
            [options]="statusOptions"
            [multiple]="true"
            [formControl]="statusControl"
            width="200px"
          ></app-select>

          <app-select
            placeholder="Date Range"
            [options]="dateRangeOptions"
            [formControl]="dateRangeControl"
            width="200px"
          ></app-select>

          <app-select
            placeholder="Value Range"
            [options]="valueRangeOptions"
            [formControl]="valueRangeControl"
            width="200px"
          ></app-select>

          <app-button variant="outline" (click)="clearFilters()" class="clear-filters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z"/>
            </svg>
            Clear
          </app-button>
        </div>

        <div class="active-filters" *ngIf="hasActiveFilters()">
          <span class="filter-label">Active filters:</span>
          <div class="chip-list">
            <app-chip 
              *ngFor="let status of getSelectedStatuses()" 
              (remove)="removeStatusFilter(status)"
              [removable]="true"
            >
              {{getStatusLabel(status)}}
            </app-chip>
          </div>
        </div>
      </app-card>

      <!-- Statistics Cards -->
      <div class="stats-section">
        <div class="stats-grid">
          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{totalQuotations}}</div>
                <div class="stat-label">Total Quotations</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon draft" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getQuotationsByStatus('Draft')}}</div>
                <div class="stat-label">Draft</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon sent" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getQuotationsByStatus('Sent')}}</div>
                <div class="stat-label">Sent</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon accepted" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getQuotationsByStatus('Accepted')}}</div>
                <div class="stat-label">Accepted</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card value-card">
            <div class="stat-content">
              <svg class="stat-icon currency" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">₹{{getTotalValue() | number:'1.0-0'}}</div>
                <div class="stat-label">Total Value</div>
              </div>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Quotations Table -->
      <app-card>
        <app-table
          [data]="quotations"
          [columns]="tableColumns"
          [searchable]="false"
          [sortable]="true"
        >
          <ng-template #quotationNumberTemplate let-quotation>
            <div class="quotation-number">
              <a [routerLink]="['/quotations/view', quotation.id]" class="quotation-link">
                {{quotation.quotationNumber}}
              </a>
              <div class="quotation-date">{{quotation.quotationDate | date:'short'}}</div>
            </div>
          </ng-template>

          <ng-template #customerTemplate let-quotation>
            <div class="customer-info">
              <div class="customer-name">{{quotation.customerName}}</div>
              <div class="customer-org" *ngIf="quotation.customerOrganization">{{quotation.customerOrganization}}</div>
            </div>
          </ng-template>

          <ng-template #referenceTemplate let-quotation>
            <div class="reference-info">
              <div class="reference-title">{{quotation.reference || 'No Reference'}}</div>
              <div class="item-count">{{quotation.quotationItems?.length || 0}} items</div>
            </div>
          </ng-template>

          <ng-template #statusTemplate let-quotation>
            <span class="status-badge" [class]="'status-' + getStatusClass(quotation.status)">
              {{getStatusLabel(quotation.status)}}
            </span>
          </ng-template>

          <ng-template #totalAmountTemplate let-quotation>
            <div class="amount-info">
              <div class="total-amount">₹{{quotation.grandTotal | number:'1.0-0'}}</div>
              <div class="tax-amount">Incl. GST</div>
            </div>
          </ng-template>

          <ng-template #validUntilTemplate let-quotation>
            <div class="validity-info">
              <div class="validity-date">{{quotation.validUntil | date:'shortDate'}}</div>
              <div class="validity-status" [class]="getValidityClass(quotation.validUntil)">
                {{getValidityStatus(quotation.validUntil)}}
              </div>
            </div>
          </ng-template>

          <ng-template #actionsTemplate let-quotation>
            <div class="action-buttons">
              <app-button 
                variant="outline" 
                size="small" 
                [routerLink]="['/quotations/view', quotation.id]"
                title="View Details"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </app-button>
              <app-button 
                variant="outline" 
                size="small" 
                [routerLink]="['/quotations/edit', quotation.id]"
                title="Edit Quotation"
                [disabled]="quotation.status === QuotationStatus.Accepted"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </app-button>
              <app-button 
                variant="outline" 
                size="small" 
                (click)="downloadPDF(quotation.id)"
                title="Download PDF"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </app-button>
              <app-button 
                variant="outline" 
                size="small" 
                (click)="deleteQuotation(quotation.id)"
                title="Delete Quotation"
                class="delete-button"
                [disabled]="quotation.status === QuotationStatus.Accepted"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </app-button>
            </div>
          </ng-template>
        </app-table>

        <!-- Pagination -->
        <div *ngIf="totalQuotations > pageSize" class="pagination">
          <app-button 
            variant="outline" 
            size="small"
            [disabled]="currentPage === 0"
            (click)="goToPage(currentPage - 1)"
          >
            Previous
          </app-button>
          
          <span class="page-info">
            Page {{currentPage + 1}} of {{totalPages}} ({{totalQuotations}} quotations)
          </span>
          
          <app-button 
            variant="outline" 
            size="small"
            [disabled]="currentPage === totalPages - 1"
            (click)="goToPage(currentPage + 1)"
          >
            Next
          </app-button>
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .quotation-list-container {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      background: linear-gradient(135deg, #2653a6 0%, #ea3b26 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
      font-size: 2rem;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .filters-card {
      margin-bottom: 24px;
    }

    .filters-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }


    .clear-filters {
      white-space: nowrap;
    }

    .active-filters {
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .filter-label {
      font-weight: 600;
      color: #2653a6;
      margin-right: 8px;
    }

    .chip-list {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .status-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }


    .stats-section {
      margin-bottom: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .stat-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      color: #666;
      flex-shrink: 0;
    }

    .stat-icon.draft { color: #9e9e9e; }
    .stat-icon.sent { color: #2196f3; }
    .stat-icon.accepted { color: #4caf50; }
    .stat-icon.currency { color: #ff9800; }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
    }

    .value-card .stat-number {
      color: #ff9800;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .delete-button {
      color: #ea3b26 !important;
    }

    .quotation-number {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .quotation-link {
      font-weight: 500;
      color: #1976d2;
      text-decoration: none;
    }

    .quotation-link:hover {
      text-decoration: underline;
    }

    .quotation-date {
      font-size: 0.85rem;
      color: #666;
    }

    .customer-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .customer-name {
      font-weight: 500;
    }

    .customer-org {
      font-size: 0.85rem;
      color: #666;
    }

    .reference-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .reference-title {
      font-weight: 500;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-count {
      font-size: 0.85rem;
      color: #666;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.status-draft {
      background-color: #f5f5f5;
      color: #666;
    }

    .status-badge.status-sent {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .status-badge.status-accepted {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.status-rejected {
      background-color: #ffebee;
      color: #c62828;
    }

    .status-badge.status-expired {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .amount-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .total-amount {
      font-weight: 500;
      color: #1976d2;
    }

    .tax-amount {
      font-size: 0.75rem;
      color: #666;
    }

    .validity-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .validity-date {
      font-weight: 500;
    }

    .validity-status {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .validity-status.valid {
      color: #4caf50;
    }

    .validity-status.expiring-soon {
      color: #ff9800;
    }

    .validity-status.expired {
      color: #f44336;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      margin-top: 24px;
    }

    .page-info {
      font-size: 14px;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }


      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .stat-content {
        flex-direction: column;
        text-align: center;
        gap: 8px;
      }

      .stat-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
      }

      .stat-number {
        font-size: 1.5rem;
      }
    }
  `]
})
export class QuotationListComponent implements OnInit, AfterViewInit {
  @ViewChild('quotationNumberTemplate', { static: true }) quotationNumberTemplate!: TemplateRef<any>;
  @ViewChild('customerTemplate', { static: true }) customerTemplate!: TemplateRef<any>;
  @ViewChild('referenceTemplate', { static: true }) referenceTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('totalAmountTemplate', { static: true }) totalAmountTemplate!: TemplateRef<any>;
  @ViewChild('validUntilTemplate', { static: true }) validUntilTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  tableColumns: any[] = [];
  
  searchControl = new FormControl('');
  statusControl = new FormControl<QuotationStatus[]>([]);
  dateRangeControl = new FormControl('');
  valueRangeControl = new FormControl('');

  quotations: QuotationDto[] = [];
  totalQuotations = 0;
  pageSize = 10;
  currentPage = 0;

  statusOptions = [
    { value: QuotationStatus.Draft, label: 'Draft' },
    { value: QuotationStatus.Sent, label: 'Sent' },
    { value: QuotationStatus.Accepted, label: 'Accepted' },
    { value: QuotationStatus.Rejected, label: 'Rejected' },
    { value: QuotationStatus.Expired, label: 'Expired' }
  ];

  dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  valueRangeOptions = [
    { value: '0-10000', label: '₹0 - ₹10,000' },
    { value: '10000-50000', label: '₹10,000 - ₹50,000' },
    { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
    { value: '100000-500000', label: '₹1,00,000 - ₹5,00,000' },
    { value: '500000+', label: '₹5,00,000+' }
  ];

  QuotationStatus = QuotationStatus;

  get totalPages(): number {
    return Math.ceil(this.totalQuotations / this.pageSize);
  }

  constructor() {}

  ngOnInit() {
    this.loadMockData();
    this.setupFilters();
  }

  ngAfterViewInit() {
    this.tableColumns = [
      { key: 'quotationNumber', title: 'Quotation #', label: 'Quotation #', template: this.quotationNumberTemplate },
      { key: 'customer', title: 'Customer', label: 'Customer', template: this.customerTemplate },
      { key: 'reference', title: 'Reference', label: 'Reference', template: this.referenceTemplate },
      { key: 'status', title: 'Status', label: 'Status', template: this.statusTemplate },
      { key: 'totalAmount', title: 'Total Amount', label: 'Total Amount', template: this.totalAmountTemplate },
      { key: 'validUntil', title: 'Valid Until', label: 'Valid Until', template: this.validUntilTemplate },
      { key: 'actions', title: 'Actions', label: 'Actions', template: this.actionsTemplate }
    ];
  }

  onSearch(searchTerm: string): void {
    this.applyFilters();
  }

  private setupFilters() {
    this.statusControl.valueChanges.subscribe(() => this.applyFilters());
    this.dateRangeControl.valueChanges.subscribe(() => this.applyFilters());
    this.valueRangeControl.valueChanges.subscribe(() => this.applyFilters());
  }

  private loadMockData() {
    this.quotations = [
      {
        id: 1,
        quotationNumber: 'QUO-2024-001',
        enquiryId: 1,
        userId: 1,
        billToAddressId: 1,
        shipToAddressId: 1,
        estimateDate: '2024-01-21',
        placeOfSupply: 'Delhi',
        customerId: 1,
        customerName: 'Alice Johnson',
        customerOrganization: 'ABC Corporation',
        customerEmail: 'alice@abccorp.com',
        customerPhone: '+1234567890',
        quotationDate: '2024-01-21',
        validUntil: '2024-02-21',
        reference: 'Industrial Motor Requirements',
        notes: 'Urgent requirement for factory expansion',
        quotationItems: [
          {
            id: 1,
            quotationId: 1,
            productId: 1,
            productName: 'Industrial Motor',
            productDescription: 'High-performance industrial motor',
            quantity: 10,
            unitPrice: 7500,
            discount: 0,
            taxRate: 18,
            lineTotal: 75000,
            hsN_SAC: '8501',
            cgstAmount: 6750,
            sgstAmount: 6750,
            cgstPercentage: 9,
            sgstPercentage: 9,
            amount: 75000,
            rate: 7500
          }
        ],
        subtotal: 75000,
        totalDiscount: 0,
        taxAmount: 13500,
        grandTotal: 88500,
        status: QuotationStatus.Sent,
        createdBy: 1,
        createdAt: '2024-01-21T00:00:00Z',
        updatedAt: '2024-01-21T00:00:00Z',
        isActive: true
      },
      {
        id: 2,
        quotationNumber: 'QUO-2024-002',
        enquiryId: 2,
        customerId: 2,
        userId: 2,
        billToAddressId: 2,
        shipToAddressId: 2,
        estimateDate: '2024-01-23',
        placeOfSupply: 'Mumbai',
        customerName: 'Bob Smith',
        customerOrganization: 'XYZ Industries',
        customerEmail: 'bob@xyzind.com',
        customerPhone: '+1234567891',
        quotationDate: '2024-01-23',
        validUntil: '2024-02-23',
        reference: 'Electronic Components Bulk Order',
        notes: 'Bulk procurement pricing applied',
        quotationItems: [
          {
            id: 2,
            quotationId: 2,
            productId: 2,
            productName: 'Electronic Controller',
            productDescription: 'Advanced electronic controller system',
            quantity: 25,
            unitPrice: 6000,
            discount: 5,
            taxRate: 18,
            lineTotal: 142500,
            hsN_SAC: '8537',
            cgstAmount: 12825,
            sgstAmount: 12825,
            cgstPercentage: 9,
            sgstPercentage: 9,
            amount: 142500,
            rate: 6000
          }
        ],
        subtotal: 150000,
        totalDiscount: 7500,
        taxAmount: 25650,
        grandTotal: 168150,
        status: QuotationStatus.Accepted,
        createdBy: 2,
        createdAt: '2024-01-23T00:00:00Z',
        updatedAt: '2024-01-25T00:00:00Z',
        isActive: true
      },
      {
        id: 3,
        quotationNumber: 'QUO-2024-003',
        customerId: 3,
        userId: 1,
        enquiryId: 3,
        billToAddressId: 3,
        shipToAddressId: 3,
        estimateDate: '2024-01-19',
        placeOfSupply: 'Bangalore',
        customerOrganization: 'Precision Tools Ltd.',
        customerName: 'Carol Davis',
        customerEmail: 'carol.davis@email.com',
        customerPhone: '+1234567892',
        quotationDate: '2024-01-19',
        validUntil: '2024-02-19',
        reference: 'Precision Tools',
        notes: 'Special precision requirements',
        quotationItems: [
          {
            id: 3,
            quotationId: 3,
            productId: 3,
            productName: 'Precision Tool',
            productDescription: 'High-precision manufacturing tool',
            quantity: 5,
            unitPrice: 5000,
            discount: 0,
            taxRate: 18,
            lineTotal: 25000,
            hsN_SAC: '8466',
            cgstAmount: 2250,
            sgstAmount: 2250,
            cgstPercentage: 9,
            sgstPercentage: 9,
            amount: 25000,
            rate: 5000
          }
        ],
        subtotal: 25000,
        totalDiscount: 0,
        taxAmount: 4500,
        grandTotal: 29500,
        status: QuotationStatus.Draft,
        createdBy: 1,
        createdAt: '2024-01-19T00:00:00Z',
        updatedAt: '2024-01-19T00:00:00Z',
        isActive: true
      }
    ];

    this.totalQuotations = this.quotations.length;
  }

  private applyFilters() {
    // Implementation would filter the quotations based on form controls
    // For now, showing all mock data
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.statusControl.setValue([]);
    this.dateRangeControl.setValue('');
    this.valueRangeControl.setValue('');
  }

  hasActiveFilters(): boolean {
    return !!(this.statusControl.value?.length || this.dateRangeControl.value || this.valueRangeControl.value);
  }

  getSelectedStatuses(): QuotationStatus[] {
    return this.statusControl.value || [];
  }

  removeStatusFilter(status: QuotationStatus) {
    const current = this.statusControl.value || [];
    this.statusControl.setValue(current.filter(s => s !== status));
  }

  getStatusLabel(status: QuotationStatus): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status.toString();
  }

  getStatusClass(status: QuotationStatus): string {
    return QuotationStatus[status].toLowerCase();
  }

  getQuotationsByStatus(status: string): number {
    return this.quotations.filter(q => QuotationStatus[q.status??1] === status).length;
  }

  getTotalValue(): number {
    return this.quotations.reduce((total, q) => total + (q.grandTotal ?? 0), 0);
  }

  getValidityClass(validUntil: string): string {
    const today = new Date();
    const validDate = new Date(validUntil);
    const daysUntilExpiry = Math.ceil((validDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'expiring-soon';
    return 'valid';
  }

  getValidityStatus(validUntil: string): string {
    const today = new Date();
    const validDate = new Date(validUntil);
    const daysUntilExpiry = Math.ceil((validDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry <= 7) return `${daysUntilExpiry} days left`;
    return 'Valid';
  }

  downloadPDF(quotationId: number) {
    console.log('Downloading PDF for quotation:', quotationId);
  }

  sendEmail(quotationId: number) {
    console.log('Sending quotation via email:', quotationId);
  }

  duplicateQuotation(quotationId: number) {
    console.log('Duplicating quotation:', quotationId);
  }

  createRevision(quotationId: number) {
    console.log('Creating revision for quotation:', quotationId);
  }

  deleteQuotation(quotationId: number) {
    if (confirm('Are you sure you want to delete this quotation?')) {
      console.log('Quotation deleted:', quotationId);
    }
  }

  exportQuotations() {
    console.log('Exporting all quotations');
  }

  refreshData() {
    this.loadMockData();
    console.log('Data refreshed');
  }
}
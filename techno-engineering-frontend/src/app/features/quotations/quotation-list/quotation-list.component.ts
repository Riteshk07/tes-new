import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuotationDto, QuotationStatus } from '../../../models/quotation.dto';

@Component({
  selector: 'app-quotation-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <div class="quotation-list-container">
      <div class="header">
        <h1>Quotation Management</h1>
        <div class="header-actions">
          <button mat-raised-button color="primary" routerLink="/quotations/create">
            <mat-icon>add</mat-icon>
            New Quotation
          </button>
          <button mat-icon-button [matMenuTriggerFor]="viewMenu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #viewMenu="matMenu">
            <button mat-menu-item (click)="exportQuotations()">
              <mat-icon>download</mat-icon>
              Export Quotations
            </button>
            <button mat-menu-item (click)="refreshData()">
              <mat-icon>refresh</mat-icon>
              Refresh
            </button>
          </mat-menu>
        </div>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search quotations</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Enter quotation number, customer name, or reference">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select [formControl]="statusControl" multiple>
                <mat-option *ngFor="let status of statusOptions" [value]="status.value">
                  <span class="status-option">
                    <span class="status-dot" [class]="'status-' + status.value.toString().toLowerCase()"></span>
                    {{status.label}}
                  </span>
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date Range</mat-label>
              <mat-select [formControl]="dateRangeControl">
                <mat-option value="today">Today</mat-option>
                <mat-option value="week">This Week</mat-option>
                <mat-option value="month">This Month</mat-option>
                <mat-option value="quarter">This Quarter</mat-option>
                <mat-option value="year">This Year</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Value Range</mat-label>
              <mat-select [formControl]="valueRangeControl">
                <mat-option value="0-10000">₹0 - ₹10,000</mat-option>
                <mat-option value="10000-50000">₹10,000 - ₹50,000</mat-option>
                <mat-option value="50000-100000">₹50,000 - ₹1,00,000</mat-option>
                <mat-option value="100000-500000">₹1,00,000 - ₹5,00,000</mat-option>
                <mat-option value="500000+">₹5,00,000+</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-button (click)="clearFilters()" class="clear-filters">
              <mat-icon>clear</mat-icon>
              Clear
            </button>
          </div>

          <div class="active-filters" *ngIf="hasActiveFilters()">
            <span class="filter-label">Active filters:</span>
            <mat-chip-set>
              <mat-chip *ngFor="let status of getSelectedStatuses()" (removed)="removeStatusFilter(status)">
                {{getStatusLabel(status)}}
                <mat-icon matChipRemove>cancel</mat-icon>
              </mat-chip>
            </mat-chip-set>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Statistics Cards -->
      <div class="stats-section">
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">description</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{totalQuotations}}</div>
                  <div class="stat-label">Total Quotations</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon draft">schedule</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{getQuotationsByStatus('Draft')}}</div>
                  <div class="stat-label">Draft</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon sent">send</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{getQuotationsByStatus('Sent')}}</div>
                  <div class="stat-label">Sent</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon accepted">check_circle</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{getQuotationsByStatus('Accepted')}}</div>
                  <div class="stat-label">Accepted</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card value-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon currency">trending_up</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">₹{{getTotalValue() | number:'1.0-0'}}</div>
                  <div class="stat-label">Total Value</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Quotations Table -->
      <mat-card>
        <div class="table-container">
          <table mat-table [dataSource]="quotations" class="quotations-table">
            <ng-container matColumnDef="quotationNumber">
              <th mat-header-cell *matHeaderCellDef>Quotation #</th>
              <td mat-cell *matCellDef="let quotation">
                <div class="quotation-number">
                  <a [routerLink]="['/quotations/view', quotation.id]" class="quotation-link">
                    {{quotation.quotationNumber}}
                  </a>
                  <div class="quotation-date">{{quotation.quotationDate | date:'short'}}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef>Customer</th>
              <td mat-cell *matCellDef="let quotation">
                <div class="customer-info">
                  <div class="customer-name">{{quotation.customerName}}</div>
                  <div class="customer-org" *ngIf="quotation.customerOrganization">{{quotation.customerOrganization}}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="reference">
              <th mat-header-cell *matHeaderCellDef>Reference</th>
              <td mat-cell *matCellDef="let quotation">
                <div class="reference-info">
                  <div class="reference-title">{{quotation.reference || 'No Reference'}}</div>
                  <div class="item-count">{{quotation.lineItems?.length || 0}} items</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let quotation">
                <span class="status-badge" [class]="'status-' + getStatusClass(quotation.status)">
                  {{getStatusLabel(quotation.status)}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="totalAmount">
              <th mat-header-cell *matHeaderCellDef>Total Amount</th>
              <td mat-cell *matCellDef="let quotation">
                <div class="amount-info">
                  <div class="total-amount">₹{{quotation.grandTotal | number:'1.0-0'}}</div>
                  <div class="tax-amount">Incl. GST</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="validUntil">
              <th mat-header-cell *matHeaderCellDef>Valid Until</th>
              <td mat-cell *matCellDef="let quotation">
                <div class="validity-info">
                  <div class="validity-date">{{quotation.validUntil | date:'shortDate'}}</div>
                  <div class="validity-status" [class]="getValidityClass(quotation.validUntil)">
                    {{getValidityStatus(quotation.validUntil)}}
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let quotation">
                <button mat-icon-button [routerLink]="['/quotations/view', quotation.id]" 
                        matTooltip="View Details" color="primary">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button [routerLink]="['/quotations/edit', quotation.id]" 
                        matTooltip="Edit Quotation" color="accent"
                        [disabled]="quotation.status === QuotationStatus.Accepted">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                        matTooltip="More Actions">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #actionMenu="matMenu">
                  <button mat-menu-item (click)="downloadPDF(quotation.id)">
                    <mat-icon>download</mat-icon>
                    Download PDF
                  </button>
                  <button mat-menu-item (click)="sendEmail(quotation.id)" 
                          [disabled]="quotation.status === QuotationStatus.Draft">
                    <mat-icon>email</mat-icon>
                    Send Email
                  </button>
                  <button mat-menu-item (click)="duplicateQuotation(quotation.id)">
                    <mat-icon>content_copy</mat-icon>
                    Duplicate
                  </button>
                  <button mat-menu-item (click)="createRevision(quotation.id)"
                          [disabled]="quotation.status !== QuotationStatus.Sent">
                    <mat-icon>edit_note</mat-icon>
                    Create Revision
                  </button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item (click)="deleteQuotation(quotation.id)" color="warn"
                          [disabled]="quotation.status === QuotationStatus.Accepted">
                    <mat-icon>delete</mat-icon>
                    Delete
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <mat-paginator 
          [length]="totalQuotations"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </mat-card>
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
      color: #333;
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

    .search-field {
      flex: 1;
      min-width: 300px;
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
      font-weight: 500;
      color: #666;
    }

    .status-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-dot.status-draft { background-color: #9e9e9e; }
    .status-dot.status-sent { background-color: #2196f3; }
    .status-dot.status-accepted { background-color: #4caf50; }
    .status-dot.status-rejected { background-color: #f44336; }
    .status-dot.status-expired { background-color: #ff9800; }

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
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #666;
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

    .table-container {
      overflow-x: auto;
    }

    .quotations-table {
      width: 100%;
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

    .mat-mdc-row:hover {
      background-color: #f5f5f5;
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

      .search-field {
        min-width: auto;
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
export class QuotationListComponent implements OnInit {
  displayedColumns: string[] = ['quotationNumber', 'customer', 'reference', 'status', 'totalAmount', 'validUntil', 'actions'];
  
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

  QuotationStatus = QuotationStatus;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadMockData();
    this.setupFilters();
  }

  private setupFilters() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());

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
    this.snackBar.open('Downloading PDF...', 'Close', { duration: 2000 });
  }

  sendEmail(quotationId: number) {
    this.snackBar.open('Sending quotation via email...', 'Close', { duration: 2000 });
  }

  duplicateQuotation(quotationId: number) {
    this.snackBar.open('Duplicating quotation...', 'Close', { duration: 2000 });
  }

  createRevision(quotationId: number) {
    this.snackBar.open('Creating revision...', 'Close', { duration: 2000 });
  }

  deleteQuotation(quotationId: number) {
    if (confirm('Are you sure you want to delete this quotation?')) {
      this.snackBar.open('Quotation deleted successfully', 'Close', { duration: 3000 });
    }
  }

  exportQuotations() {
    this.snackBar.open('Exporting all quotations...', 'Close', { duration: 2000 });
  }

  refreshData() {
    this.loadMockData();
    this.snackBar.open('Data refreshed', 'Close', { duration: 2000 });
  }
}
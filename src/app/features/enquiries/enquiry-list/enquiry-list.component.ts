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
import { EnquiryDto, EnquiryStatus } from '../../../models/enquiry.dto';

@Component({
  selector: 'app-enquiry-list',
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
    <div class="enquiry-list-container">
      <div class="header">
        <h1>Enquiry Management</h1>
        <div class="header-actions">
          <button mat-raised-button color="primary" routerLink="/enquiries/create">
            <mat-icon>add</mat-icon>
            New Enquiry
          </button>
          <button mat-icon-button [matMenuTriggerFor]="viewMenu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #viewMenu="matMenu">
            <button mat-menu-item (click)="exportEnquiries()">
              <mat-icon>download</mat-icon>
              Export Enquiries
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
              <mat-label>Search enquiries</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Enter enquiry number, customer name, or subject">
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
              <mat-label>Priority</mat-label>
              <mat-select [formControl]="priorityControl" multiple>
                <mat-option value="Low">Low</mat-option>
                <mat-option value="Medium">Medium</mat-option>
                <mat-option value="High">High</mat-option>
                <mat-option value="Urgent">Urgent</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Assigned Staff</mat-label>
              <mat-select [formControl]="staffControl" multiple>
                <mat-option *ngFor="let staff of staffList" [value]="staff.id">
                  {{staff.name}}
                </mat-option>
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
              <mat-chip *ngFor="let priority of getSelectedPriorities()" (removed)="removePriorityFilter(priority)">
                {{priority}}
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
                <mat-icon class="stat-icon">help_outline</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{totalEnquiries}}</div>
                  <div class="stat-label">Total Enquiries</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon pending">schedule</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{getEnquiriesByStatus('Pending')}}</div>
                  <div class="stat-label">Pending</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon inprogress">build</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{getEnquiriesByStatus('InProgress')}}</div>
                  <div class="stat-label">In Progress</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon quoted">description</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{getEnquiriesByStatus('Quoted')}}</div>
                  <div class="stat-label">Quoted</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Enquiries Table -->
      <mat-card>
        <div class="table-container">
          <table mat-table [dataSource]="enquiries" class="enquiries-table">
            <ng-container matColumnDef="enquiryNumber">
              <th mat-header-cell *matHeaderCellDef>Enquiry #</th>
              <td mat-cell *matCellDef="let enquiry">
                <div class="enquiry-number">
                  <a [routerLink]="['/enquiries/view', enquiry.id]" class="enquiry-link">
                    {{enquiry.enquiryNumber}}
                  </a>
                  <div class="enquiry-date">{{enquiry.createdAt | date:'short'}}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef>Customer</th>
              <td mat-cell *matCellDef="let enquiry">
                <div class="customer-info">
                  <div class="customer-name">{{enquiry.customerName}}</div>
                  <div class="customer-org" *ngIf="enquiry.organizationName">{{enquiry.organizationName}}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="subject">
              <th mat-header-cell *matHeaderCellDef>Subject</th>
              <td mat-cell *matCellDef="let enquiry">
                <div class="subject-info">
                  <div class="subject-title">{{enquiry.subject}}</div>
                  <div class="item-count">{{enquiry.items?.length || 0}} items</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let enquiry">
                <span class="status-badge" [class]="'status-' + getStatusClass(enquiry.status)">
                  {{getStatusLabel(enquiry.status)}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="priority">
              <th mat-header-cell *matHeaderCellDef>Priority</th>
              <td mat-cell *matCellDef="let enquiry">
                <span class="priority-badge" [class]="'priority-' + enquiry.priority.toLowerCase()">
                  <mat-icon>{{getPriorityIcon(enquiry.priority)}}</mat-icon>
                  {{enquiry.priority}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="assignedStaff">
              <th mat-header-cell *matHeaderCellDef>Assigned To</th>
              <td mat-cell *matCellDef="let enquiry">
                <div class="assigned-staff" *ngIf="enquiry.assignedStaffName; else unassigned">
                  <mat-icon class="staff-icon">person</mat-icon>
                  {{enquiry.assignedStaffName}}
                </div>
                <ng-template #unassigned>
                  <span class="unassigned-text">Unassigned</span>
                </ng-template>
              </td>
            </ng-container>

            <ng-container matColumnDef="estimatedValue">
              <th mat-header-cell *matHeaderCellDef>Est. Value</th>
              <td mat-cell *matCellDef="let enquiry">
                <div class="estimated-value" *ngIf="enquiry.totalEstimatedValue; else noEstimate">
                  ₹{{enquiry.totalEstimatedValue | number:'1.0-0'}}
                </div>
                <ng-template #noEstimate>
                  <span class="no-estimate">TBD</span>
                </ng-template>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let enquiry">
                <button mat-icon-button [routerLink]="['/enquiries/view', enquiry.id]" 
                        matTooltip="View Details" color="primary">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button [routerLink]="['/enquiries/edit', enquiry.id]" 
                        matTooltip="Edit Enquiry" color="accent">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                        matTooltip="More Actions">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #actionMenu="matMenu">
                  <button mat-menu-item (click)="createQuotation(enquiry.id)" 
                          [disabled]="enquiry.status === EnquiryStatus.Quoted">
                    <mat-icon>description</mat-icon>
                    Create Quotation
                  </button>
                  <button mat-menu-item (click)="assignEnquiry(enquiry.id)">
                    <mat-icon>assignment_ind</mat-icon>
                    Assign to Staff
                  </button>
                  <button mat-menu-item (click)="exportEnquiry(enquiry.id)">
                    <mat-icon>download</mat-icon>
                    Export
                  </button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item (click)="deleteEnquiry(enquiry.id)" color="warn">
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
          [length]="totalEnquiries"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .enquiry-list-container {
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

    .status-dot.status-pending { background-color: #ff9800; }
    .status-dot.status-inprogress { background-color: #2196f3; }
    .status-dot.status-quoted { background-color: #4caf50; }
    .status-dot.status-completed { background-color: #8bc34a; }
    .status-dot.status-cancelled { background-color: #f44336; }

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

    .stat-icon.pending { color: #ff9800; }
    .stat-icon.inprogress { color: #2196f3; }
    .stat-icon.quoted { color: #4caf50; }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    .table-container {
      overflow-x: auto;
    }

    .enquiries-table {
      width: 100%;
    }

    .enquiry-number {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .enquiry-link {
      font-weight: 500;
      color: #1976d2;
      text-decoration: none;
    }

    .enquiry-link:hover {
      text-decoration: underline;
    }

    .enquiry-date {
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

    .subject-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .subject-title {
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

    .status-badge.status-pending {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .status-badge.status-inprogress {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .status-badge.status-quoted {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.status-completed {
      background-color: #f1f8e9;
      color: #388e3c;
    }

    .status-badge.status-cancelled {
      background-color: #ffebee;
      color: #c62828;
    }

    .priority-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .priority-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .priority-badge.priority-low {
      background-color: #f5f5f5;
      color: #666;
    }

    .priority-badge.priority-medium {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .priority-badge.priority-high {
      background-color: #ffebee;
      color: #c62828;
    }

    .priority-badge.priority-urgent {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .assigned-staff {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
    }

    .staff-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #666;
    }

    .unassigned-text {
      color: #999;
      font-style: italic;
    }

    .estimated-value {
      font-weight: 500;
      color: #1976d2;
    }

    .no-estimate {
      color: #999;
      font-style: italic;
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
export class EnquiryListComponent implements OnInit {
  displayedColumns: string[] = ['enquiryNumber', 'customer', 'subject', 'status', 'priority', 'assignedStaff', 'estimatedValue', 'actions'];
  
  searchControl = new FormControl('');
  statusControl = new FormControl<EnquiryStatus[]>([]);
  priorityControl = new FormControl<string[]>([]);
  staffControl = new FormControl<number[]>([]);

  enquiries: EnquiryDto[] = [];
  totalEnquiries = 0;
  pageSize = 10;
  currentPage = 0;

  statusOptions = [
    { value: EnquiryStatus.Pending, label: 'Pending' },
    { value: EnquiryStatus.InProgress, label: 'In Progress' },
    { value: EnquiryStatus.Quoted, label: 'Quoted' },
    { value: EnquiryStatus.Completed, label: 'Completed' },
    { value: EnquiryStatus.Cancelled, label: 'Cancelled' }
  ];

  staffList = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' }
  ];

  EnquiryStatus = EnquiryStatus;

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
    this.priorityControl.valueChanges.subscribe(() => this.applyFilters());
    this.staffControl.valueChanges.subscribe(() => this.applyFilters());
  }

  private loadMockData() {
    this.enquiries = [
      {
        id: 1,
        enquiryNumber: 'ENQ-2024-001',
        customerId: 1,
        reportedBy: 1,
        customerName: 'Alice Johnson',
        customerEmail: 'alice@abccorp.com',
        customerPhone: '+1234567890',
        organizationName: 'ABC Corporation',
        assignedStaffId: 1,
        assignedStaffName: 'John Doe',
        status: EnquiryStatus.Pending,
        priority: 'High',
        subject: 'Industrial Motor Requirements',
        description: 'Need quotation for 10 industrial motors',
        requirementDate: '2024-02-15',
        budgetRange: '₹50,000 - ₹1,00,000',
        enquiredProducts: [
          {
          id: 1,
          enquiryId: 1,
          productId: 1,
          productName: 'Industrial Motor',
          productModel: 'IM-001',
          quantity: 10,
          notes: 'Urgent requirement for factory expansion',
          estimatedPrice: 7500,
          unitPrice: 7500,
        }
        ],
        totalEstimatedValue: 75000,
        createdAt: '2024-01-20T00:00:00Z',
        isActive: true
      },
      {
        id: 2,
        enquiryNumber: 'ENQ-2024-002',
        customerId: 2,
        reportedBy: 2,
        customerName: 'Bob Smith',
        customerEmail: 'bob@xyzind.com',
        customerPhone: '+1234567891',
        organizationName: 'XYZ Industries',
        assignedStaffId: 2,
        assignedStaffName: 'Jane Smith',
        status: EnquiryStatus.InProgress,
        priority: 'Medium',
        subject: 'Electronic Components Bulk Order',
        description: 'Bulk procurement of electronic components',
        requirementDate: '2024-02-20',
        budgetRange: '₹1,00,000 - ₹2,00,000',
        enquiredProducts: [
          { id: 2, enquiryId: 2, productId: 2, productName: 'Electronic Controller', productModel: 'EC-002', quantity: 25, notes: 'Need technical specifications', estimatedPrice: 6000, unitPrice: 6000 }
        ],
        totalEstimatedValue: 150000,
        createdAt: '2024-01-22T00:00:00Z',
        isActive: true
      },
      {
        id: 3,
        enquiryNumber: 'ENQ-2024-003',
        customerId: 3,
        reportedBy: 3,
        customerName: 'Carol Davis',
        customerEmail: 'carol.davis@email.com',
        customerPhone: '+1234567892',
        status: EnquiryStatus.Quoted,
        priority: 'Low',
        subject: 'Precision Tools',
        description: 'Precision manufacturing tools needed',
        requirementDate: '2024-03-01',
        enquiredProducts: [
          { id: 3, enquiryId: 3, productId: 3, productName: 'Precision Tool', productModel: 'PT-003', quantity: 5, notes: 'High precision required', estimatedPrice: 5000, unitPrice: 5000 }
        ],
        totalEstimatedValue: 25000,
        quotationId: 1,
        quotationNumber: 'QUO-2024-001',
        createdAt: '2024-01-18T00:00:00Z',
        isActive: true
      }
    ];

    this.totalEnquiries = this.enquiries.length;
  }

  private applyFilters() {
    // Implementation would filter the enquiries based on form controls
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
    this.priorityControl.setValue([]);
    this.staffControl.setValue([]);
  }

  hasActiveFilters(): boolean {
    return !!(this.statusControl.value?.length || this.priorityControl.value?.length);
  }

  getSelectedStatuses(): EnquiryStatus[] {
    return this.statusControl.value || [];
  }

  getSelectedPriorities(): string[] {
    return this.priorityControl.value || [];
  }

  removeStatusFilter(status: EnquiryStatus) {
    const current = this.statusControl.value || [];
    this.statusControl.setValue(current.filter(s => s !== status));
  }

  removePriorityFilter(priority: string) {
    const current = this.priorityControl.value || [];
    this.priorityControl.setValue(current.filter(p => p !== priority));
  }

  getStatusLabel(status: EnquiryStatus): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status.toString();
  }

  getStatusClass(status: EnquiryStatus): string {
    return EnquiryStatus[status].toLowerCase();
  }

  getPriorityIcon(priority: string): string {
    const icons: { [key: string]: string } = {
      'Low': 'keyboard_arrow_down',
      'Medium': 'remove',
      'High': 'keyboard_arrow_up',
      'Urgent': 'priority_high'
    };
    return icons[priority] || 'help';
  }

  getEnquiriesByStatus(status: string): number {
    return this.enquiries.filter(e => EnquiryStatus[e.status??1] === status).length;
  }

  createQuotation(enquiryId: number) {
    // Navigate to create quotation from enquiry
    this.snackBar.open('Creating quotation...', 'Close', { duration: 2000 });
  }

  assignEnquiry(enquiryId: number) {
    // Open assign dialog
    this.snackBar.open('Assignment feature coming soon', 'Close', { duration: 2000 });
  }

  exportEnquiry(enquiryId: number) {
    this.snackBar.open('Exporting enquiry...', 'Close', { duration: 2000 });
  }

  deleteEnquiry(enquiryId: number) {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      this.snackBar.open('Enquiry deleted successfully', 'Close', { duration: 3000 });
    }
  }

  exportEnquiries() {
    this.snackBar.open('Exporting all enquiries...', 'Close', { duration: 2000 });
  }

  refreshData() {
    this.loadMockData();
    this.snackBar.open('Data refreshed', 'Close', { duration: 2000 });
  }
}
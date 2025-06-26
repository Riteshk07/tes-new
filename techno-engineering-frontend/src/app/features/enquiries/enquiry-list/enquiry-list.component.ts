import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EnquiryDto, EnquiryStatus } from '../../../models/enquiry.dto';

import { ViewChild, TemplateRef } from '@angular/core';

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
  selector: 'app-enquiry-list',
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
    <div class="enquiry-list-container">
      <div class="header">
        <h1>Enquiry Management</h1>
        <div class="header-actions">
          <app-button variant="primary" routerLink="/enquiries/create">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            New Enquiry
          </app-button>
          <app-button variant="outline" (click)="exportEnquiries()">
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
      <app-card title="Filter Enquiries" class="filters-card">
        <div class="filters-row">
          <app-search-input
            placeholder="Search enquiries by number, customer, or subject"
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
            placeholder="Priority"
            [options]="priorityOptions"
            [multiple]="true"
            [formControl]="priorityControl"
            width="200px"
          ></app-select>

          <app-select
            placeholder="Assigned Staff"
            [options]="staffOptions"
            [multiple]="true"
            [formControl]="staffControl"
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
            <app-chip 
              *ngFor="let priority of getSelectedPriorities()" 
              (remove)="removePriorityFilter(priority)"
              [removable]="true"
            >
              {{priority}}
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
                <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{totalEnquiries}}</div>
                <div class="stat-label">Total Enquiries</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon pending" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getEnquiriesByStatus('Pending')}}</div>
                <div class="stat-label">Pending</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon inprogress" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getEnquiriesByStatus('InProgress')}}</div>
                <div class="stat-label">In Progress</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon quoted" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getEnquiriesByStatus('Quoted')}}</div>
                <div class="stat-label">Quoted</div>
              </div>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Enquiries Table -->
      <app-card>
        <app-table
          [data]="filteredEnquiries"
          [columns]="tableColumns"
          [searchable]="false"
          [sortable]="true"
        >
          <ng-template #enquiryNumberTemplate let-enquiry>
            <div class="enquiry-number">
              <a [routerLink]="['/enquiries/view', enquiry.id]" class="enquiry-link">
                {{enquiry.enquiryNumber}}
              </a>
              <div class="enquiry-date">{{enquiry.createdAt | date:'short'}}</div>
            </div>
          </ng-template>

          <ng-template #customerTemplate let-enquiry>
            <div class="customer-info">
              <div class="customer-name">{{enquiry.customerName}}</div>
              <div class="customer-org" *ngIf="enquiry.organizationName">{{enquiry.organizationName}}</div>
            </div>
          </ng-template>

          <ng-template #subjectTemplate let-enquiry>
            <div class="subject-info">
              <div class="subject-title">{{enquiry.subject}}</div>
              <div class="item-count">{{(enquiry.enquiredProducts?.length || 0)}} items</div>
            </div>
          </ng-template>

          <ng-template #statusTemplate let-enquiry>
            <span class="status-badge" [class]="'status-' + getStatusClass(enquiry.status)">
              {{getStatusLabel(enquiry.status)}}
            </span>
          </ng-template>

          <ng-template #priorityTemplate let-enquiry>
            <span class="priority-badge" [class]="'priority-' + enquiry.priority.toLowerCase()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path [attr.d]="getPriorityIconPath(enquiry.priority)"/>
              </svg>
              {{enquiry.priority}}
            </span>
          </ng-template>

          <ng-template #assignedStaffTemplate let-enquiry>
            <div class="assigned-staff" *ngIf="enquiry.assignedStaffName; else unassigned">
              <svg class="staff-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
              </svg>
              {{enquiry.assignedStaffName}}
            </div>
            <ng-template #unassigned>
              <span class="unassigned-text">Unassigned</span>
            </ng-template>
          </ng-template>

          <ng-template #estimatedValueTemplate let-enquiry>
            <div class="estimated-value" *ngIf="enquiry.totalEstimatedValue; else noEstimate">
              ₹{{enquiry.totalEstimatedValue | number:'1.0-0'}}
            </div>
            <ng-template #noEstimate>
              <span class="no-estimate">TBD</span>
            </ng-template>
          </ng-template>

          <ng-template #actionsTemplate let-enquiry>
            <div class="action-buttons">
              <app-button 
                variant="outline" 
                size="small"
                [routerLink]="['/enquiries/view', enquiry.id]"
                title="View Details"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </app-button>
              <app-button 
                variant="outline" 
                size="small"
                [routerLink]="['/enquiries/edit', enquiry.id]"
                title="Edit Enquiry"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </app-button>
              <app-button 
                variant="outline" 
                size="small"
                (click)="createQuotation(enquiry.id)"
                [disabled]="enquiry.status === EnquiryStatus.Quoted"
                title="Create Quotation"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </app-button>
              <app-button 
                variant="outline" 
                size="small"
                (click)="deleteEnquiry(enquiry.id)"
                title="Delete Enquiry"
                class="delete-button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </app-button>
            </div>
          </ng-template>
        </app-table>

        <!-- Pagination -->
        <div *ngIf="totalPages > 1" class="pagination">
          <app-button 
            variant="outline" 
            size="small"
            [disabled]="currentPage === 1"
            (click)="goToPage(currentPage - 1)"
          >
            Previous
          </app-button>
          
          <span class="page-info">
            Page {{currentPage}} of {{totalPages}} ({{totalEnquiries}} enquiries)
          </span>
          
          <app-button 
            variant="outline" 
            size="small"
            [disabled]="currentPage === totalPages"
            (click)="goToPage(currentPage + 1)"
          >
            Next
          </app-button>
        </div>
      </app-card>
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
    
    .action-buttons {
      display: flex;
      gap: 8px;
    }
    
    .delete-button {
      color: #ea3b26 !important;
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
  @ViewChild('enquiryNumberTemplate', { static: true }) enquiryNumberTemplate!: TemplateRef<any>;
  @ViewChild('customerTemplate', { static: true }) customerTemplate!: TemplateRef<any>;
  @ViewChild('subjectTemplate', { static: true }) subjectTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('priorityTemplate', { static: true }) priorityTemplate!: TemplateRef<any>;
  @ViewChild('assignedStaffTemplate', { static: true }) assignedStaffTemplate!: TemplateRef<any>;
  @ViewChild('estimatedValueTemplate', { static: true }) estimatedValueTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  searchControl = new FormControl('');
  statusControl = new FormControl<EnquiryStatus[]>([]);
  priorityControl = new FormControl<string[]>([]);
  staffControl = new FormControl<number[]>([]);

  enquiries: EnquiryDto[] = [];
  filteredEnquiries: EnquiryDto[] = [];
  totalEnquiries = 0;
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';
  
  get totalPages(): number {
    return Math.ceil(this.filteredEnquiries.length / this.pageSize);
  }
  
  tableColumns: any[] = []; // Will be initialized in ngOnInit

  statusOptions = [
    { value: EnquiryStatus.Pending, label: 'Pending' },
    { value: EnquiryStatus.InProgress, label: 'In Progress' },
    { value: EnquiryStatus.Quoted, label: 'Quoted' },
    { value: EnquiryStatus.Completed, label: 'Completed' },
    { value: EnquiryStatus.Cancelled, label: 'Cancelled' }
  ];
  
  priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Urgent', label: 'Urgent' }
  ];

  staffList = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' }
  ];
  
  staffOptions = this.staffList.map(staff => ({
    value: staff.id,
    label: staff.name
  }));

  EnquiryStatus = EnquiryStatus;

  ngOnInit() {
    this.loadMockData();
    this.setupFilters();
    this.filteredEnquiries = [...this.enquiries];
    // Assign TemplateRefs to tableColumns after ViewChilds are available
    this.tableColumns = [
      { key: 'enquiryNumber', title: 'Enquiry #', label: 'Enquiry #', template: this.enquiryNumberTemplate },
      { key: 'customer', title: 'Customer', label: 'Customer', template: this.customerTemplate },
      { key: 'subject', title: 'Subject', label: 'Subject', template: this.subjectTemplate },
      { key: 'status', title: 'Status', label: 'Status', template: this.statusTemplate },
      { key: 'priority', title: 'Priority', label: 'Priority', template: this.priorityTemplate },
      { key: 'assignedStaff', title: 'Assigned To', label: 'Assigned To', template: this.assignedStaffTemplate },
      { key: 'estimatedValue', title: 'Est. Value', label: 'Est. Value', template: this.estimatedValueTemplate },
      { key: 'actions', title: 'Actions', label: 'Actions', template: this.actionsTemplate }
    ];
    this.filteredEnquiries = [...this.enquiries];
  }
    
  private setupFilters() {
    this.statusControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });
    this.priorityControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });
    this.staffControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });
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

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    this.currentPage = 1;
    this.applyFilters();
  }
  
  private applyFilters() {
    let filtered = [...this.enquiries];
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(enquiry => 
        enquiry.enquiryNumber.toLowerCase().includes(this.searchTerm) ||
        (enquiry.customerName?.toLowerCase() ?? '').includes(this.searchTerm) ||
        (enquiry.subject?.toLowerCase() ?? '').includes(this.searchTerm)
      );
    }
    
    // Apply status filter
    const selectedStatuses = this.statusControl.value || [];
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(enquiry => enquiry.status !== undefined && selectedStatuses.includes(enquiry.status));
    }
    
    // Apply priority filter
    const selectedPriorities = this.priorityControl.value || [];
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(enquiry => enquiry.priority !== undefined && selectedPriorities.includes(enquiry.priority));
    }
    
    // Apply staff filter
    const selectedStaff = this.staffControl.value || [];
    if (selectedStaff.length > 0) {
      filtered = filtered.filter(enquiry => 
        enquiry.assignedStaffId && selectedStaff.includes(enquiry.assignedStaffId)
      );
    }
    
    this.totalEnquiries = filtered.length;
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredEnquiries = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
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

  getPriorityIconPath(priority: string): string {
    const iconPaths: { [key: string]: string } = {
      'Low': 'M7 14l5-5 5 5z',
      'Medium': 'M19 13H5v-2h14v2z',
      'High': 'M7 10l5 5 5-5z',
      'Urgent': 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'
    };
    return iconPaths[priority] || 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z';
  }

  getEnquiriesByStatus(status: string): number {
    return this.enquiries.filter(e => EnquiryStatus[e.status??1] === status).length;
  }

  createQuotation(enquiryId: number) {
    // Navigate to create quotation from enquiry
    alert('Creating quotation...');
  }

  assignEnquiry(enquiryId: number) {
    // Open assign dialog
    alert('Assignment feature coming soon');
  }

  exportEnquiry(enquiryId: number) {
    alert('Exporting enquiry...');
  }

  deleteEnquiry(enquiryId: number) {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      // Remove from local array for demo
      this.enquiries = this.enquiries.filter(e => e.id !== enquiryId);
      this.applyFilters();
      alert('Enquiry deleted successfully');
    }
  }

  exportEnquiries() {
    alert('Exporting all enquiries...');
  }

  refreshData() {
    this.loadMockData();
    this.filteredEnquiries = [...this.enquiries];
    alert('Data refreshed');
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { EnquiryDto, EnquiryStatus } from '../../../models/enquiry.dto';

@Component({
  selector: 'app-enquiry-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    MatChipsModule,
    MatExpansionModule,
    MatDividerModule
  ],
  template: `
    <div class="enquiry-detail-container">
      <div class="header">
        <div class="header-info">
          <h1>{{enquiry?.enquiryNumber}}</h1>
          <span class="status-badge" [class]="'status-' + getStatusClass(enquiry?.status || 0)">
            {{getStatusLabel(enquiry?.status || 0)}}
          </span>
        </div>
        <div class="header-actions">
          <button mat-button routerLink="/enquiries">
            <mat-icon>arrow_back</mat-icon>
            Back to Enquiries
          </button>
          <button mat-raised-button color="primary" [routerLink]="['/enquiries/edit', enquiryId]">
            <mat-icon>edit</mat-icon>
            Edit Enquiry
          </button>
          <button mat-icon-button [matMenuTriggerFor]="actionMenu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #actionMenu="matMenu">
            <button mat-menu-item (click)="createQuotation()" 
                    [disabled]="enquiry?.status === EnquiryStatus.Quoted">
              <mat-icon>description</mat-icon>
              Create Quotation
            </button>
            <button mat-menu-item (click)="exportEnquiry()">
              <mat-icon>download</mat-icon>
              Export
            </button>
            <button mat-menu-item (click)="duplicateEnquiry()">
              <mat-icon>content_copy</mat-icon>
              Duplicate
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="deleteEnquiry()" color="warn">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          </mat-menu>
        </div>
      </div>

      <div class="enquiry-content" *ngIf="enquiry">
        <!-- Quick Actions -->
        <div class="quick-actions">
          <mat-card class="action-card">
            <mat-card-content>
              <div class="status-update">
                <mat-form-field appearance="outline">
                  <mat-label>Update Status</mat-label>
                  <mat-select [value]="enquiry.status" (selectionChange)="updateStatus($event.value)">
                    <mat-option [value]="EnquiryStatus.Pending">Pending</mat-option>
                    <mat-option [value]="EnquiryStatus.InProgress">In Progress</mat-option>
                    <mat-option [value]="EnquiryStatus.Quoted">Quoted</mat-option>
                    <mat-option [value]="EnquiryStatus.Completed">Completed</mat-option>
                    <mat-option [value]="EnquiryStatus.Cancelled">Cancelled</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Assign to Staff</mat-label>
                  <mat-select [value]="enquiry.assignedStaffId" (selectionChange)="assignStaff($event.value)">
                    <mat-option [value]="null">Unassigned</mat-option>
                    <mat-option *ngFor="let staff of staffList" [value]="staff.id">
                      {{staff.name}}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Customer Information -->
        <mat-card class="customer-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>person</mat-icon>
            <mat-card-title>Customer Information</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="customer-grid">
              <div class="customer-section">
                <h4>Contact Details</h4>
                <div class="info-item">
                  <strong>Name:</strong>
                  <span>{{enquiry.customerName}}</span>
                </div>
                <div class="info-item" *ngIf="enquiry.organizationName">
                  <strong>Organization:</strong>
                  <span>{{enquiry.organizationName}}</span>
                </div>
                <div class="info-item">
                  <strong>Email:</strong>
                  <a href="mailto:{{enquiry.customerEmail}}">{{enquiry.customerEmail}}</a>
                </div>
                <div class="info-item">
                  <strong>Phone:</strong>
                  <a href="tel:{{enquiry.customerPhone}}">{{enquiry.customerPhone}}</a>
                </div>
              </div>

              <div class="enquiry-section">
                <h4>Enquiry Details</h4>
                <div class="info-item">
                  <strong>Subject:</strong>
                  <span>{{enquiry.subject}}</span>
                </div>
                <div class="info-item">
                  <strong>Priority:</strong>
                  <span class="priority-badge" [class]="'priority-' + enquiry.priority?.toLowerCase()">
                    <mat-icon>{{getPriorityIcon(enquiry.priority??"")}}</mat-icon>
                    {{enquiry.priority}}
                  </span>
                </div>
                <div class="info-item" *ngIf="enquiry.requirementDate">
                  <strong>Required By:</strong>
                  <span>{{enquiry.requirementDate | date:'medium'}}</span>
                </div>
                <div class="info-item" *ngIf="enquiry.budgetRange">
                  <strong>Budget Range:</strong>
                  <span>{{enquiry.budgetRange}}</span>
                </div>
              </div>
            </div>

            <div class="description-section" *ngIf="enquiry.description">
              <h4>Description</h4>
              <p class="description-text">{{enquiry.description}}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-tab-group class="details-tabs">
          <!-- Products Tab -->
          <mat-tab label="Products">
            <div class="tab-content">
              <div class="products-section">
                <div class="section-header">
                  <h3>Requested Products</h3>
                  <div class="summary-info">
                    <span class="item-count">{{enquiry.items?.length || 0}} items</span>
                    <span class="total-value" *ngIf="enquiry.totalEstimatedValue">
                      Est. Value: ₹{{enquiry.totalEstimatedValue | number:'1.0-0'}}
                    </span>
                  </div>
                </div>

                <table mat-table [dataSource]="enquiry.items || []" class="products-table">
                  <ng-container matColumnDef="product">
                    <th mat-header-cell *matHeaderCellDef>Product</th>
                    <td mat-cell *matCellDef="let item">
                      <div class="product-info">
                        <div class="product-name">{{item.productName}}</div>
                        <div class="product-model">Model: {{item.productModel}}</div>
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="quantity">
                    <th mat-header-cell *matHeaderCellDef>Quantity</th>
                    <td mat-cell *matCellDef="let item">
                      <span class="quantity-value">{{item.quantity}}</span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="estimatedPrice">
                    <th mat-header-cell *matHeaderCellDef>Est. Price</th>
                    <td mat-cell *matCellDef="let item">
                      <span *ngIf="item.estimatedPrice; else noPrice">
                        ₹{{item.estimatedPrice | number:'1.0-0'}}
                      </span>
                      <ng-template #noPrice>
                        <span class="no-price">TBD</span>
                      </ng-template>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="notes">
                    <th mat-header-cell *matHeaderCellDef>Notes</th>
                    <td mat-cell *matCellDef="let item">
                      <span *ngIf="item.notes; else noNotes">{{item.notes}}</span>
                      <ng-template #noNotes>
                        <span class="no-notes">-</span>
                      </ng-template>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="productColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: productColumns;"></tr>
                </table>
              </div>
            </div>
          </mat-tab>

          <!-- Communication Tab -->
          <mat-tab label="Communication">
            <div class="tab-content">
              <div class="communication-section">
                <div class="add-comment">
                  <mat-form-field appearance="outline" class="comment-field">
                    <mat-label>Add Comment</mat-label>
                    <textarea matInput [formControl]="commentControl" rows="3" 
                             placeholder="Enter your comment or note"></textarea>
                  </mat-form-field>
                  <div class="comment-actions">
                    <button mat-raised-button color="primary" (click)="addComment()" 
                            [disabled]="!commentControl.value">
                      <mat-icon>send</mat-icon>
                      Add Comment
                    </button>
                  </div>
                </div>

                <div class="comments-list">
                  <mat-expansion-panel *ngFor="let comment of comments" class="comment-panel">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <div class="comment-header">
                          <span class="comment-author">{{comment.userName}}</span>
                          <span class="comment-role">({{comment.userRole}})</span>
                          <span class="comment-date">{{comment.createdAt | date:'short'}}</span>
                        </div>
                      </mat-panel-title>
                    </mat-expansion-panel-header>
                    <div class="comment-content">
                      {{comment.comment}}
                    </div>
                  </mat-expansion-panel>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Activity Timeline Tab -->
          <mat-tab label="Activity">
            <div class="tab-content">
              <div class="activity-section">
                <div class="activity-timeline">
                  <div *ngFor="let activity of activities" class="activity-item">
                    <div class="activity-icon">
                      <mat-icon [class]="'activity-' + activity.activityType.toLowerCase()">
                        {{getActivityIcon(activity.activityType)}}
                      </mat-icon>
                    </div>
                    <div class="activity-content">
                      <div class="activity-description">{{activity.description}}</div>
                      <div class="activity-meta">
                        <span class="activity-user">{{activity.userName}}</span>
                        <span class="activity-date">{{activity.createdAt | date:'short'}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Quotation Tab -->
          <mat-tab label="Quotation" [disabled]="!enquiry.quotationId">
            <div class="tab-content">
              <div class="quotation-section" *ngIf="enquiry.quotationId">
                <mat-card class="quotation-card">
                  <mat-card-header>
                    <mat-card-title>Generated Quotation</mat-card-title>
                    <mat-card-subtitle>{{enquiry.quotationNumber}}</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="quotation-actions">
                      <button mat-raised-button color="primary" 
                              [routerLink]="['/quotations/view', enquiry.quotationId]">
                        <mat-icon>visibility</mat-icon>
                        View Quotation
                      </button>
                      <button mat-button (click)="downloadQuotation()">
                        <mat-icon>download</mat-icon>
                        Download PDF
                      </button>
                      <button mat-button (click)="sendQuotation()">
                        <mat-icon>email</mat-icon>
                        Send Email
                      </button>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
              <div class="no-quotation" *ngIf="!enquiry.quotationId">
                <mat-icon>description</mat-icon>
                <p>No quotation generated yet</p>
                <button mat-raised-button color="primary" (click)="createQuotation()">
                  <mat-icon>add</mat-icon>
                  Create Quotation
                </button>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .enquiry-detail-container {
      padding: 24px;
      max-width: 1200px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-info h1 {
      margin: 0;
      color: #333;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .status-badge {
      padding: 8px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
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

    .quick-actions {
      margin-bottom: 24px;
    }

    .action-card .status-update {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .customer-card {
      margin-bottom: 24px;
    }

    .customer-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 24px;
    }

    .customer-section h4,
    .enquiry-section h4 {
      margin-bottom: 16px;
      color: #333;
      font-weight: 500;
    }

    .info-item {
      display: flex;
      margin-bottom: 12px;
      gap: 8px;
    }

    .info-item strong {
      min-width: 120px;
      color: #666;
    }

    .info-item a {
      color: #1976d2;
      text-decoration: none;
    }

    .info-item a:hover {
      text-decoration: underline;
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

    .description-section {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }

    .description-section h4 {
      margin-bottom: 12px;
      color: #333;
    }

    .description-text {
      line-height: 1.6;
      color: #666;
      margin: 0;
    }

    .details-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tab-content {
      padding: 24px;
      min-height: 400px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h3 {
      margin: 0;
      color: #333;
    }

    .summary-info {
      display: flex;
      gap: 16px;
      font-size: 0.9rem;
      color: #666;
    }

    .total-value {
      font-weight: 500;
      color: #1976d2;
    }

    .products-table {
      width: 100%;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .product-name {
      font-weight: 500;
    }

    .product-model {
      font-size: 0.85rem;
      color: #666;
    }

    .quantity-value {
      font-weight: 500;
      color: #1976d2;
    }

    .no-price,
    .no-notes {
      color: #999;
      font-style: italic;
    }

    .add-comment {
      margin-bottom: 32px;
      padding: 24px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .comment-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .comment-actions {
      display: flex;
      justify-content: flex-end;
    }

    .comment-panel {
      margin-bottom: 16px;
    }

    .comment-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .comment-author {
      font-weight: 500;
    }

    .comment-role {
      color: #666;
      font-size: 0.9rem;
    }

    .comment-date {
      color: #999;
      font-size: 0.85rem;
      margin-left: auto;
    }

    .comment-content {
      padding: 16px 0;
      line-height: 1.6;
    }

    .activity-timeline {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .activity-item {
      display: flex;
      gap: 16px;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .activity-content {
      flex: 1;
    }

    .activity-description {
      font-weight: 500;
      margin-bottom: 8px;
    }

    .activity-meta {
      display: flex;
      gap: 16px;
      font-size: 0.85rem;
      color: #666;
    }

    .quotation-card {
      max-width: 500px;
    }

    .quotation-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .no-quotation {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #999;
    }

    .no-quotation mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    .no-quotation p {
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .header-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .customer-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .action-card .status-update {
        flex-direction: column;
        align-items: stretch;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .summary-info {
        flex-direction: column;
        gap: 4px;
      }

      .quotation-actions {
        flex-direction: column;
      }
    }
  `]
})
export class EnquiryDetailComponent implements OnInit {
  enquiryId: number | null = null;
  enquiry: EnquiryDto | null = null;
  
  commentControl = new FormControl('');
  productColumns = ['product', 'quantity', 'estimatedPrice', 'notes'];
  
  EnquiryStatus = EnquiryStatus;

  staffList = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' }
  ];

  comments = [
    {
      id: 1,
      userName: 'John Doe',
      userRole: 'Staff',
      comment: 'Initial review completed. Customer requirements are clear.',
      createdAt: '2024-01-21T10:00:00Z'
    },
    {
      id: 2,
      userName: 'Alice Johnson',
      userRole: 'Customer',
      comment: 'When can we expect the quotation? This is urgent.',
      createdAt: '2024-01-21T14:30:00Z'
    }
  ];

  activities = [
    {
      id: 1,
      activityType: 'Created',
      description: 'Enquiry created by customer',
      userName: 'Alice Johnson',
      createdAt: '2024-01-20T09:00:00Z'
    },
    {
      id: 2,
      activityType: 'Assigned',
      description: 'Enquiry assigned to John Doe',
      userName: 'Admin',
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      id: 3,
      activityType: 'StatusChanged',
      description: 'Status changed from Pending to In Progress',
      userName: 'John Doe',
      createdAt: '2024-01-21T09:00:00Z'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.enquiryId = +params['id'];
      this.loadEnquiryDetails();
    });
  }

  private loadEnquiryDetails() {
    // Mock enquiry data
    this.enquiry = {
      id: this.enquiryId!,
      enquiryNumber: 'ENQ-2024-001',
      customerId: 1,
      reportedBy: 1,
      customerName: 'Alice Johnson',
      customerEmail: 'alice@abccorp.com',
      customerPhone: '+1234567890',
      organizationName: 'ABC Corporation',
      assignedStaffId: 1,
      assignedStaffName: 'John Doe',
      status: EnquiryStatus.InProgress,
      priority: 'High',
      subject: 'Industrial Motor Requirements',
      description: 'We need quotation for 10 industrial motors for our new factory expansion. The motors should be high-performance and reliable for continuous operation.',
      requirementDate: '2024-02-15',
      budgetRange: '₹50,000 - ₹1,00,000',
      enquiredProducts: [
        {
          id: 1,
          enquiryId: this.enquiryId!,
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
      quotationId: 1,
      quotationNumber: 'QUO-2024-001',
      createdAt: '2024-01-20T00:00:00Z',
      isActive: true
    };
  }

  getStatusLabel(status: EnquiryStatus): string {
    const labels: { [key: number]: string } = {
      [EnquiryStatus.Pending]: 'Pending',
      [EnquiryStatus.InProgress]: 'In Progress',
      [EnquiryStatus.Quoted]: 'Quoted',
      [EnquiryStatus.Completed]: 'Completed',
      [EnquiryStatus.Cancelled]: 'Cancelled'
    };
    return labels[status] || 'Unknown';
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

  getActivityIcon(activityType: string): string {
    const icons: { [key: string]: string } = {
      'Created': 'add_circle',
      'StatusChanged': 'sync',
      'Assigned': 'assignment_ind',
      'CommentAdded': 'comment',
      'QuotationGenerated': 'description',
      'Updated': 'edit'
    };
    return icons[activityType] || 'info';
  }

  updateStatus(newStatus: EnquiryStatus) {
    if (this.enquiry) {
      this.enquiry.status = newStatus;
      this.snackBar.open('Status updated successfully', 'Close', { duration: 3000 });
    }
  }

  assignStaff(staffId: number | null) {
    if (this.enquiry) {
      this.enquiry.assignedStaffId = staffId??0;
      if (staffId) {
        const staff = this.staffList.find(s => s.id === staffId);
        this.enquiry.assignedStaffName = staff?.name;
      } else {
        this.enquiry.assignedStaffName = undefined;
      }
      this.snackBar.open('Assignment updated successfully', 'Close', { duration: 3000 });
    }
  }

  addComment() {
    if (this.commentControl.value) {
      const newComment = {
        id: this.comments.length + 1,
        userName: 'Current User',
        userRole: 'Staff',
        comment: this.commentControl.value,
        createdAt: new Date().toISOString()
      };
      
      this.comments.unshift(newComment);
      this.commentControl.setValue('');
      this.snackBar.open('Comment added successfully', 'Close', { duration: 3000 });
    }
  }

  createQuotation() {
    this.snackBar.open('Redirecting to quotation creation...', 'Close', { duration: 2000 });
    // Navigate to create quotation with enquiry data
  }

  exportEnquiry() {
    this.snackBar.open('Exporting enquiry...', 'Close', { duration: 2000 });
  }

  duplicateEnquiry() {
    this.snackBar.open('Duplicating enquiry...', 'Close', { duration: 2000 });
  }

  deleteEnquiry() {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      this.snackBar.open('Enquiry deleted successfully', 'Close', { duration: 3000 });
    }
  }

  downloadQuotation() {
    this.snackBar.open('Downloading quotation PDF...', 'Close', { duration: 2000 });
  }

  sendQuotation() {
    this.snackBar.open('Sending quotation via email...', 'Close', { duration: 2000 });
  }
}
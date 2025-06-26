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
import { QuotationDto, QuotationStatus } from '../../../models/quotation.dto';

@Component({
  selector: 'app-quotation-detail',
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
    <div class="quotation-detail-container">
      <div class="header">
        <div class="header-info">
          <h1>{{quotation?.quotationNumber}}</h1>
          <span class="status-badge" [class]="'status-' + getStatusClass(quotation?.status || 0)">
            {{getStatusLabel(quotation?.status || 0)}}
          </span>
          <span class="validity-indicator" [class]="getValidityClass(quotation?.validUntil || '')">
            {{getValidityStatus(quotation?.validUntil || '')}}
          </span>
        </div>
        <div class="header-actions">
          <button mat-button routerLink="/quotations">
            <mat-icon>arrow_back</mat-icon>
            Back to Quotations
          </button>
          <button mat-raised-button color="primary" [routerLink]="['/quotations/edit', quotationId]"
                  [disabled]="quotation?.status === QuotationStatus.Accepted">
            <mat-icon>edit</mat-icon>
            Edit Quotation
          </button>
          <button mat-icon-button [matMenuTriggerFor]="actionMenu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #actionMenu="matMenu">
            <button mat-menu-item (click)="downloadPDF()">
              <mat-icon>download</mat-icon>
              Download PDF
            </button>
            <button mat-menu-item (click)="sendEmail()" 
                    [disabled]="quotation?.status === QuotationStatus.Draft">
              <mat-icon>email</mat-icon>
              Send Email
            </button>
            <button mat-menu-item (click)="duplicateQuotation()">
              <mat-icon>content_copy</mat-icon>
              Duplicate
            </button>
            <button mat-menu-item (click)="createRevision()"
                    [disabled]="quotation?.status !== QuotationStatus.Sent">
              <mat-icon>edit_note</mat-icon>
              Create Revision
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="deleteQuotation()" color="warn"
                    [disabled]="quotation?.status === QuotationStatus.Accepted">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          </mat-menu>
        </div>
      </div>

      <div class="quotation-content" *ngIf="quotation">
        <!-- Quick Actions -->
        <div class="quick-actions" *ngIf="quotation.status === QuotationStatus.Sent">
          <mat-card class="action-card">
            <mat-card-content>
              <div class="status-update">
                <h3>Customer Response</h3>
                <div class="response-actions">
                  <button mat-raised-button color="primary" (click)="acceptQuotation()">
                    <mat-icon>check_circle</mat-icon>
                    Mark as Accepted
                  </button>
                  <button mat-button color="warn" (click)="rejectQuotation()">
                    <mat-icon>cancel</mat-icon>
                    Mark as Rejected
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Customer Information -->
        <mat-card class="customer-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>business</mat-icon>
            <mat-card-title>Customer Information</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="customer-grid">
              <div class="customer-section">
                <h4>Contact Details</h4>
                <div class="info-item">
                  <strong>Name:</strong>
                  <span>{{quotation.customerName}}</span>
                </div>
                <div class="info-item" *ngIf="quotation.customerOrganization">
                  <strong>Organization:</strong>
                  <span>{{quotation.customerOrganization}}</span>
                </div>
                <div class="info-item">
                  <strong>Email:</strong>
                  <a href="mailto:{{quotation.customerEmail}}">{{quotation.customerEmail}}</a>
                </div>
                <div class="info-item">
                  <strong>Phone:</strong>
                  <a href="tel:{{quotation.customerPhone}}">{{quotation.customerPhone}}</a>
                </div>
              </div>

              <div class="quotation-section">
                <h4>Quotation Details</h4>
                <div class="info-item">
                  <strong>Date:</strong>
                  <span>{{quotation.quotationDate | date:'medium'}}</span>
                </div>
                <div class="info-item">
                  <strong>Valid Until:</strong>
                  <span>{{quotation.validUntil | date:'medium'}}</span>
                </div>
                <div class="info-item" *ngIf="quotation.reference">
                  <strong>Reference:</strong>
                  <span>{{quotation.reference}}</span>
                </div>
                <div class="info-item" *ngIf="quotation.enquiryId">
                  <strong>From Enquiry:</strong>
                  <a [routerLink]="['/enquiries/view', quotation.enquiryId]">
                    View Original Enquiry
                  </a>
                </div>
              </div>
            </div>

            <div class="notes-section" *ngIf="quotation.notes">
              <h4>Notes</h4>
              <p class="notes-text">{{quotation.notes}}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-tab-group class="details-tabs">
          <!-- Line Items Tab -->
          <mat-tab label="Line Items">
            <div class="tab-content">
              <div class="items-section">
                <div class="section-header">
                  <h3>Quotation Items</h3>
                  <div class="summary-info">
                    <span class="item-count">{{quotation.lineItems?.length || 0}} items</span>
                    <span class="total-value">
                      Total: ₹{{quotation.grandTotal | number:'1.0-0'}}
                    </span>
                  </div>
                </div>

                <div class="items-table">
                  <table mat-table [dataSource]="quotation.lineItems || []" class="line-items-table">
                    <ng-container matColumnDef="product">
                      <th mat-header-cell *matHeaderCellDef>Product/Service</th>
                      <td mat-cell *matCellDef="let item">
                        <div class="product-info">
                          <div class="product-name">{{item.productName}}</div>
                          <div class="product-description">{{item.productDescription}}</div>
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="quantity">
                      <th mat-header-cell *matHeaderCellDef>Quantity</th>
                      <td mat-cell *matCellDef="let item">
                        <span class="quantity-value">{{item.quantity}}</span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="unitPrice">
                      <th mat-header-cell *matHeaderCellDef>Unit Price</th>
                      <td mat-cell *matCellDef="let item">
                        <span class="price-value">₹{{item.unitPrice | number:'1.0-0'}}</span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="discount">
                      <th mat-header-cell *matHeaderCellDef>Discount</th>
                      <td mat-cell *matCellDef="let item">
                        <span *ngIf="item.discount > 0; else noDiscount" class="discount-value">
                          {{item.discount}}%
                        </span>
                        <ng-template #noDiscount>
                          <span class="no-discount">-</span>
                        </ng-template>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="tax">
                      <th mat-header-cell *matHeaderCellDef>Tax</th>
                      <td mat-cell *matCellDef="let item">
                        <span class="tax-value">{{item.taxRate}}%</span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="lineTotal">
                      <th mat-header-cell *matHeaderCellDef>Line Total</th>
                      <td mat-cell *matCellDef="let item">
                        <span class="line-total">₹{{item.lineTotal | number:'1.0-0'}}</span>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="lineItemColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: lineItemColumns;"></tr>
                  </table>
                </div>

                <!-- Totals Summary -->
                <div class="totals-summary">
                  <div class="totals-grid">
                    <div class="total-row">
                      <span class="total-label">Subtotal:</span>
                      <span class="total-value">₹{{quotation.subtotal | number:'1.0-0'}}</span>
                    </div>
                    <div class="total-row" *ngIf="quotation.totalDiscount??0 > 0">
                      <span class="total-label">Total Discount:</span>
                      <span class="total-value discount">-₹{{quotation.totalDiscount | number:'1.0-0'}}</span>
                    </div>
                    <div class="total-row">
                      <span class="total-label">Tax (GST):</span>
                      <span class="total-value">₹{{quotation.taxAmount | number:'1.0-0'}}</span>
                    </div>
                    <div class="total-row grand-total">
                      <span class="total-label">Grand Total:</span>
                      <span class="total-value">₹{{quotation.grandTotal | number:'1.0-0'}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Terms & Conditions Tab -->
          <mat-tab label="Terms & Conditions">
            <div class="tab-content">
              <div class="terms-section">
                <mat-card class="terms-card">
                  <mat-card-content>
                    <div class="terms-grid">
                      <div class="term-item" *ngIf="quotation.paymentTerms">
                        <h4>Payment Terms</h4>
                        <p>{{quotation.paymentTerms}}</p>
                      </div>
                      
                      <div class="term-item" *ngIf="quotation.deliveryTerms">
                        <h4>Delivery Terms</h4>
                        <p>{{quotation.deliveryTerms}}</p>
                      </div>
                      
                      <div class="term-item" *ngIf="quotation.warranty">
                        <h4>Warranty</h4>
                        <p>{{quotation.warranty}}</p>
                      </div>
                      
                      <div class="term-item">
                        <h4>Validity</h4>
                        <p>This quotation is valid until {{quotation.validUntil | date:'fullDate'}}</p>
                      </div>
                    </div>

                    <div class="standard-terms">
                      <h4>Standard Terms and Conditions</h4>
                      <ul>
                        <li>Prices are subject to change without prior notice.</li>
                        <li>Delivery charges are extra unless specified otherwise.</li>
                        <li>All disputes are subject to local jurisdiction.</li>
                        <li>Payment to be made as per agreed terms.</li>
                        <li>Goods once sold will not be taken back.</li>
                      </ul>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- History Tab -->
          <mat-tab label="History">
            <div class="tab-content">
              <div class="history-section">
                <div class="history-timeline">
                  <div *ngFor="let event of quotationHistory" class="history-item">
                    <div class="history-icon">
                      <mat-icon [class]="'history-' + event.eventType.toLowerCase()">
                        {{getHistoryIcon(event.eventType)}}
                      </mat-icon>
                    </div>
                    <div class="history-content">
                      <div class="history-description">{{event.description}}</div>
                      <div class="history-meta">
                        <span class="history-user">{{event.userName}}</span>
                        <span class="history-date">{{event.createdAt | date:'short'}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Communication Tab -->
          <mat-tab label="Communication">
            <div class="tab-content">
              <div class="communication-section">
                <div class="add-note">
                  <mat-form-field appearance="outline" class="note-field">
                    <mat-label>Add Internal Note</mat-label>
                    <textarea matInput [formControl]="noteControl" rows="3" 
                             placeholder="Enter internal note or communication log"></textarea>
                  </mat-form-field>
                  <div class="note-actions">
                    <button mat-raised-button color="primary" (click)="addNote()" 
                            [disabled]="!noteControl.value">
                      <mat-icon>add</mat-icon>
                      Add Note
                    </button>
                  </div>
                </div>

                <div class="notes-list">
                  <mat-expansion-panel *ngFor="let note of internalNotes" class="note-panel">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <div class="note-header">
                          <span class="note-author">{{note.userName}}</span>
                          <span class="note-date">{{note.createdAt | date:'short'}}</span>
                        </div>
                      </mat-panel-title>
                    </mat-expansion-panel-header>
                    <div class="note-content">
                      {{note.note}}
                    </div>
                  </mat-expansion-panel>
                </div>

                <div class="email-log" *ngIf="emailHistory.length > 0">
                  <h4>Email Communication</h4>
                  <div class="email-list">
                    <div *ngFor="let email of emailHistory" class="email-item">
                      <div class="email-header">
                        <mat-icon>email</mat-icon>
                        <span class="email-subject">{{email.subject}}</span>
                        <span class="email-date">{{email.sentAt | date:'short'}}</span>
                      </div>
                      <div class="email-recipients">
                        To: {{email.recipients.join(', ')}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .quotation-detail-container {
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

    .validity-indicator {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .validity-indicator.valid {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .validity-indicator.expiring-soon {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .validity-indicator.expired {
      background-color: #ffebee;
      color: #c62828;
    }

    .quick-actions {
      margin-bottom: 24px;
    }

    .action-card .status-update {
      text-align: center;
    }

    .action-card h3 {
      margin-bottom: 16px;
      color: #333;
    }

    .response-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
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
    .quotation-section h4 {
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

    .notes-section {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }

    .notes-section h4 {
      margin-bottom: 12px;
      color: #333;
    }

    .notes-text {
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

    .items-table {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 24px;
    }

    .line-items-table {
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

    .product-description {
      font-size: 0.85rem;
      color: #666;
    }

    .quantity-value,
    .price-value,
    .tax-value {
      font-weight: 500;
    }

    .discount-value {
      color: #f44336;
      font-weight: 500;
    }

    .no-discount {
      color: #999;
    }

    .line-total {
      font-weight: 500;
      color: #1976d2;
    }

    .totals-summary {
      border-top: 1px solid #eee;
      padding: 16px;
      background: #f9f9f9;
    }

    .totals-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 300px;
      margin-left: auto;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .total-label {
      font-weight: 500;
      color: #666;
    }

    .total-value {
      font-weight: 500;
      color: #333;
    }

    .total-value.discount {
      color: #f44336;
    }

    .grand-total {
      border-top: 1px solid #ddd;
      padding-top: 8px;
      margin-top: 8px;
    }

    .grand-total .total-label {
      font-size: 1.1rem;
      color: #333;
    }

    .grand-total .total-value {
      font-size: 1.2rem;
      color: #1976d2;
    }

    .terms-card {
      max-width: none;
    }

    .terms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .term-item h4 {
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }

    .term-item p {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }

    .standard-terms {
      border-top: 1px solid #eee;
      padding-top: 24px;
    }

    .standard-terms h4 {
      margin-bottom: 16px;
      color: #333;
    }

    .standard-terms ul {
      color: #666;
      line-height: 1.6;
    }

    .history-timeline {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .history-item {
      display: flex;
      gap: 16px;
    }

    .history-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .history-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .history-content {
      flex: 1;
    }

    .history-description {
      font-weight: 500;
      margin-bottom: 8px;
    }

    .history-meta {
      display: flex;
      gap: 16px;
      font-size: 0.85rem;
      color: #666;
    }

    .add-note {
      margin-bottom: 32px;
      padding: 24px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .note-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .note-actions {
      display: flex;
      justify-content: flex-end;
    }

    .note-panel {
      margin-bottom: 16px;
    }

    .note-header {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }

    .note-author {
      font-weight: 500;
    }

    .note-date {
      color: #999;
      font-size: 0.85rem;
      margin-left: auto;
    }

    .note-content {
      padding: 16px 0;
      line-height: 1.6;
    }

    .email-log {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }

    .email-log h4 {
      margin-bottom: 16px;
      color: #333;
    }

    .email-item {
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .email-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .email-subject {
      font-weight: 500;
      flex: 1;
    }

    .email-date {
      color: #666;
      font-size: 0.85rem;
    }

    .email-recipients {
      color: #666;
      font-size: 0.9rem;
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

      .response-actions {
        flex-direction: column;
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

      .terms-grid {
        grid-template-columns: 1fr;
      }

      .totals-grid {
        max-width: 100%;
      }
    }
  `]
})
export class QuotationDetailComponent implements OnInit {
  quotationId: number | null = null;
  quotation: QuotationDto | null = null;
  
  noteControl = new FormControl('');
  lineItemColumns = ['product', 'quantity', 'unitPrice', 'discount', 'tax', 'lineTotal'];
  
  QuotationStatus = QuotationStatus;

  quotationHistory = [
    {
      id: 1,
      eventType: 'Created',
      description: 'Quotation created',
      userName: 'John Doe',
      createdAt: '2024-01-21T09:00:00Z'
    },
    {
      id: 2,
      eventType: 'Sent',
      description: 'Quotation sent to customer via email',
      userName: 'John Doe',
      createdAt: '2024-01-21T10:30:00Z'
    },
    {
      id: 3,
      eventType: 'Viewed',
      description: 'Customer viewed the quotation',
      userName: 'System',
      createdAt: '2024-01-22T14:15:00Z'
    }
  ];

  internalNotes = [
    {
      id: 1,
      userName: 'John Doe',
      note: 'Customer requested bulk pricing. Applied 5% discount on quantities above 20.',
      createdAt: '2024-01-21T11:00:00Z'
    },
    {
      id: 2,
      userName: 'Jane Smith',
      note: 'Follow up scheduled for next week. Customer is evaluating multiple vendors.',
      createdAt: '2024-01-22T09:30:00Z'
    }
  ];

  emailHistory = [
    {
      id: 1,
      subject: 'Quotation QUO-2024-001 - Industrial Motor Requirements',
      recipients: ['alice@abccorp.com'],
      sentAt: '2024-01-21T10:30:00Z'
    },
    {
      id: 2,
      subject: 'Follow-up: Quotation QUO-2024-001',
      recipients: ['alice@abccorp.com'],
      sentAt: '2024-01-23T14:00:00Z'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.quotationId = +params['id'];
      this.loadQuotationDetails();
    });
  }

  private loadQuotationDetails() {
    // Mock quotation data
    this.quotation = {
      id: this.quotationId!,
      quotationNumber: 'QUO-2024-001',
      enquiryId: 1,
      customerId: 1,
      userId: 1,
      billToAddressId: 1,
      shipToAddressId: 1,
      estimateDate: '2024-01-21',
      placeOfSupply: 'India',
      customerName: 'Alice Johnson',
      customerOrganization: 'ABC Corporation',
      customerEmail: 'alice@abccorp.com',
      customerPhone: '+1234567890',
      quotationDate: '2024-01-21',
      validUntil: '2024-02-21',
      reference: 'Industrial Motor Requirements',
      notes: 'Bulk pricing applied for quantities above 20 units. Delivery within 15 days of order confirmation.',
      paymentTerms: 'Net 30 days',
      deliveryTerms: 'FOB - Factory',
      warranty: '12 months manufacturer warranty',
      quotationItems: [
        {
          id: 1,
          quotationId: this.quotationId!,
          productId: 1,
          productName: 'Industrial Motor',
          productDescription: 'High-performance industrial motor suitable for continuous operation',
          quantity: 10,
          unitPrice: 7500,
          discount: 5,
          taxRate: 18,
          lineTotal: 83475,
          hsN_SAC: '8501',
          cgstAmount: 6750,
          sgstAmount: 6750,
          cgstPercentage: 9,
          sgstPercentage: 9,
          rate: 18,
          amount: 83475
        }
      ],
      subtotal: 75000,
      totalDiscount: 3750,
      taxAmount: 12825,
      grandTotal: 84075,
      status: QuotationStatus.Sent,
      createdBy: 1,
      createdAt: '2024-01-21T00:00:00Z',
      updatedAt: '2024-01-21T00:00:00Z',
      isActive: true
    };
  }

  getStatusLabel(status: QuotationStatus): string {
    const labels: { [key: number]: string } = {
      [QuotationStatus.Draft]: 'Draft',
      [QuotationStatus.Sent]: 'Sent',
      [QuotationStatus.Accepted]: 'Accepted',
      [QuotationStatus.Rejected]: 'Rejected',
      [QuotationStatus.Expired]: 'Expired'
    };
    return labels[status] || 'Unknown';
  }

  getStatusClass(status: QuotationStatus): string {
    return QuotationStatus[status].toLowerCase();
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

  getHistoryIcon(eventType: string): string {
    const icons: { [key: string]: string } = {
      'Created': 'add_circle',
      'Sent': 'send',
      'Viewed': 'visibility',
      'Accepted': 'check_circle',
      'Rejected': 'cancel',
      'Updated': 'edit',
      'Downloaded': 'download'
    };
    return icons[eventType] || 'info';
  }

  acceptQuotation() {
    if (this.quotation) {
      this.quotation.status = QuotationStatus.Accepted;
      this.snackBar.open('Quotation marked as accepted', 'Close', { duration: 3000 });
    }
  }

  rejectQuotation() {
    if (confirm('Are you sure you want to mark this quotation as rejected?')) {
      if (this.quotation) {
        this.quotation.status = QuotationStatus.Rejected;
        this.snackBar.open('Quotation marked as rejected', 'Close', { duration: 3000 });
      }
    }
  }

  addNote() {
    if (this.noteControl.value) {
      const newNote = {
        id: this.internalNotes.length + 1,
        userName: 'Current User',
        note: this.noteControl.value,
        createdAt: new Date().toISOString()
      };
      
      this.internalNotes.unshift(newNote);
      this.noteControl.setValue('');
      this.snackBar.open('Note added successfully', 'Close', { duration: 3000 });
    }
  }

  downloadPDF() {
    this.snackBar.open('Downloading quotation PDF...', 'Close', { duration: 2000 });
  }

  sendEmail() {
    this.snackBar.open('Sending quotation via email...', 'Close', { duration: 2000 });
  }

  duplicateQuotation() {
    this.snackBar.open('Duplicating quotation...', 'Close', { duration: 2000 });
  }

  createRevision() {
    this.snackBar.open('Creating quotation revision...', 'Close', { duration: 2000 });
  }

  deleteQuotation() {
    if (confirm('Are you sure you want to delete this quotation?')) {
      this.snackBar.open('Quotation deleted successfully', 'Close', { duration: 3000 });
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import { QuotationStatus } from '../../../models/quotation.dto';

// Import shared components
import { 
  FloatingInputComponent,
  SearchInputComponent,
  ButtonComponent,
  SelectComponent,
  SelectOption,
  DateInputComponent,
  StepperComponent,
  StepperStepComponent,
  AutocompleteComponent,
  AutocompleteOption,
  TableComponent,
  TableColumn,
  TableAction,
  CardComponent,
  ExpansionPanelComponent
} from '../../../shared/components';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  organizationName: string;
}

interface Product {
  id: number;
  name: string;
  modelNumber: string;
  description: string;
  unitPrice: number;
}

interface LineItem {
  productId?: number;
  productName: string;
  productDescription: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  lineTotal: number;
}

interface QuotationSummary {
  subtotal: number;
  totalDiscount: number;
  taxAmount: number;
  grandTotal: number;
}

@Component({
  selector: 'app-quotation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FloatingInputComponent,
    SearchInputComponent,
    ButtonComponent,
    SelectComponent,
    DateInputComponent,
    StepperComponent,
    StepperStepComponent,
    AutocompleteComponent,
    TableComponent,
    CardComponent,
    ExpansionPanelComponent
  ],
  template: `
    <div class="quotation-form-container">
      <div class="header">
        <h1>{{isEditMode ? 'Edit Quotation' : 'Create New Quotation'}}</h1>
        <div class="header-actions">
          <app-button variant="outline" (click)="goBack()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Quotations
          </app-button>
          <app-button 
            variant="outline" 
            (click)="saveAsDraft()" 
            [disabled]="isLoading" 
            *ngIf="!isEditMode"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
            Save as Draft
          </app-button>
        </div>
      </div>

      <app-stepper [linear]="!isEditMode" [selectedIndex]="currentStepIndex" (selectionChange)="onStepChange($event)">
        <!-- Customer Information Step -->
        <app-stepper-step [stepControl]="customerForm" label="Customer Information">
          <app-card title="Customer Details" subtitle="Select or enter customer information">
            <form [formGroup]="customerForm">
              <div class="customer-selection" *ngIf="!isEditMode && !fromEnquiry">
                <app-autocomplete
                  label="Search Existing Customer"
                  placeholder="Type customer name or email"
                  [options]="customerOptions"
                  hint="Search for existing customer or create new below"
                  (optionSelected)="selectCustomer($event)"
                  width="100%"
                  class="full-width"
                >
                </app-autocomplete>
              </div>

              <div class="form-row">
                <app-floating-input
                  label="Customer Name"
                  formControlName="customerName"
                  [required]="true"
                  [error]="getFieldError('customerForm', 'customerName')"
                  width="100%"
                >
                </app-floating-input>

                <app-floating-input
                  label="Organization"
                  formControlName="customerOrganization"
                  width="100%"
                >
                </app-floating-input>
              </div>

              <div class="form-row">
                <app-floating-input
                  label="Email"
                  type="email"
                  formControlName="customerEmail"
                  [required]="true"
                  [error]="getFieldError('customerForm', 'customerEmail')"
                  width="100%"
                >
                </app-floating-input>

                <app-floating-input
                  label="Phone"
                  formControlName="customerPhone"
                  [required]="true"
                  [error]="getFieldError('customerForm', 'customerPhone')"
                  width="100%"
                >
                </app-floating-input>
              </div>
            </form>
            
            <div slot="actions">
              <app-button 
                variant="primary" 
                (click)="nextStep()" 
                [disabled]="customerForm.invalid"
              >
                Next: Quotation Details
              </app-button>
            </div>
          </app-card>
        </app-stepper-step>

        <!-- Quotation Details Step -->
        <app-stepper-step [stepControl]="quotationForm" label="Quotation Details">
          <app-card title="Quotation Information" subtitle="Enter quotation details and validity">
            <form [formGroup]="quotationForm">
              <div class="form-row">
                <app-floating-input
                  label="Quotation Number"
                  formControlName="quotationNumber"
                  [disabled]="true"
                  hint="Auto-generated quotation number"
                  width="100%"
                >
                </app-floating-input>

                <app-date-input
                  label="Quotation Date"
                  formControlName="quotationDate"
                  [required]="true"
                  width="100%"
                >
                </app-date-input>
              </div>

              <div class="form-row">
                <app-date-input
                  label="Valid Until"
                  formControlName="validUntil"
                  [required]="true"
                  [error]="getFieldError('quotationForm', 'validUntil')"
                  width="100%"
                >
                </app-date-input>

                <app-floating-input
                  label="Reference"
                  formControlName="reference"
                  placeholder="Customer reference or enquiry subject"
                  width="100%"
                >
                </app-floating-input>
              </div>

              <app-floating-input
                label="Notes"
                type="textarea"
                formControlName="notes"
                placeholder="Additional notes or terms and conditions"
                width="100%"
                class="full-width"
              >
              </app-floating-input>

              <app-expansion-panel 
                title="Terms and Conditions"
                description="Standard terms and payment conditions"
                class="terms-panel"
              >
                <div class="terms-content">
                  <app-select
                    label="Payment Terms"
                    formControlName="paymentTerms"
                    [options]="paymentTermsOptions"
                    width="100%"
                    class="full-width"
                  >
                  </app-select>

                  <app-floating-input
                    label="Delivery Terms"
                    formControlName="deliveryTerms"
                    placeholder="e.g., FOB, Ex-Works, Delivered"
                    width="100%"
                    class="full-width"
                  >
                  </app-floating-input>

                  <app-floating-input
                    label="Warranty"
                    formControlName="warranty"
                    placeholder="e.g., 12 months manufacturer warranty"
                    width="100%"
                    class="full-width"
                  >
                  </app-floating-input>
                </div>
              </app-expansion-panel>
            </form>
            
            <div slot="actions">
              <app-button variant="outline" (click)="previousStep()">
                Previous
              </app-button>
              <app-button 
                variant="primary" 
                (click)="nextStep()" 
                [disabled]="quotationForm.invalid"
              >
                Next: Add Line Items
              </app-button>
            </div>
          </app-card>
        </app-stepper-step>

        <!-- Line Items Step -->
        <app-stepper-step label="Line Items">
          <app-card title="Quotation Line Items" subtitle="Add products and services to the quotation">
            <div class="add-item-section">
              <div class="item-search">
                <app-autocomplete
                  label="Search Products"
                  placeholder="Type product name or model number"
                  [options]="productOptions"
                  (optionSelected)="addLineItem($event)"
                  width="100%"
                  class="search-field"
                >
                </app-autocomplete>
                <app-button variant="primary" (click)="addCustomLineItem()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Custom Item
                </app-button>
              </div>
            </div>

            <div class="line-items-section" *ngIf="lineItems.length > 0">
              <!-- Custom line items table with inline editing -->
              <div class="line-items-table">
                <div class="table-header">
                  <div class="header-cell product-col">Product/Service</div>
                  <div class="header-cell qty-col">Qty</div>
                  <div class="header-cell price-col">Unit Price</div>
                  <div class="header-cell discount-col">Disc %</div>
                  <div class="header-cell tax-col">Tax %</div>
                  <div class="header-cell total-col">Total</div>
                  <div class="header-cell actions-col">Actions</div>
                </div>

                <div class="table-body">
                  <div 
                    *ngFor="let item of lineItems; let i = index; trackBy: trackByIndex" 
                    class="table-row"
                  >
                    <div class="cell product-col">
                      <div class="item-info">
                        <app-floating-input
                          label="Product/Service name"
                          [(ngModel)]="item.productName"
                          (ngModelChange)="updateLineItem(i)"
                          width="100%"
                          class="item-name-field"
                        >
                        </app-floating-input>
                        <app-floating-input
                          label="Description"
                          type="textarea"
                          [(ngModel)]="item.productDescription"
                          (ngModelChange)="updateLineItem(i)"
                          width="100%"
                          class="item-desc-field"
                        >
                        </app-floating-input>
                      </div>
                    </div>

                    <div class="cell qty-col">
                      <app-floating-input
                        label="Qty"
                        type="number"
                        [(ngModel)]="item.quantity"
                        (ngModelChange)="updateLineItem(i)"
                        [min]="1"
                        width="100%"
                      >
                      </app-floating-input>
                    </div>

                    <div class="cell price-col">
                      <app-floating-input
                        label="Price"
                        type="number"
                        [(ngModel)]="item.unitPrice"
                        (ngModelChange)="updateLineItem(i)"
                        [min]="0"
                        prefix="₹"
                        width="100%"
                      >
                      </app-floating-input>
                    </div>

                    <div class="cell discount-col">
                      <app-floating-input
                        label="Disc"
                        type="number"
                        [(ngModel)]="item.discount"
                        (ngModelChange)="updateLineItem(i)"
                        [min]="0"
                        [max]="100"
                        suffix="%"
                        width="100%"
                      >
                      </app-floating-input>
                    </div>

                    <div class="cell tax-col">
                      <app-select
                        label="Tax"
                        [(ngModel)]="item.taxRate"
                        (ngModelChange)="updateLineItem(i)"
                        [options]="taxRateOptions"
                        width="100%"
                      >
                      </app-select>
                    </div>

                    <div class="cell total-col">
                      <div class="line-total">
                        ₹{{item.lineTotal | number:'1.0-0'}}
                      </div>
                    </div>

                    <div class="cell actions-col">
                      <app-button 
                        variant="outline" 
                        size="small"
                        (click)="removeLineItem(i)"
                        class="delete-button"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </app-button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Totals Summary -->
              <div class="totals-section">
                <div class="totals-grid">
                  <div class="total-row">
                    <span class="total-label">Subtotal:</span>
                    <span class="total-value">₹{{quotationSummary.subtotal | number:'1.0-0'}}</span>
                  </div>
                  <div class="total-row">
                    <span class="total-label">Total Discount:</span>
                    <span class="total-value discount">-₹{{quotationSummary.totalDiscount | number:'1.0-0'}}</span>
                  </div>
                  <div class="total-row">
                    <span class="total-label">Tax (GST):</span>
                    <span class="total-value">₹{{quotationSummary.taxAmount | number:'1.0-0'}}</span>
                  </div>
                  <div class="total-row grand-total">
                    <span class="total-label">Grand Total:</span>
                    <span class="total-value">₹{{quotationSummary.grandTotal | number:'1.0-0'}}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="no-items" *ngIf="lineItems.length === 0">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
              </svg>
              <p>No line items added yet</p>
              <p class="hint">Search products above or add custom items to build your quotation</p>
            </div>
            
            <div slot="actions">
              <app-button variant="outline" (click)="previousStep()">
                Previous
              </app-button>
              <app-button 
                variant="primary" 
                (click)="onSubmit()" 
                [disabled]="lineItems.length === 0 || isLoading"
              >
                <svg *ngIf="!isLoading" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
                <svg *ngIf="isLoading" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="spinning">
                  <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                </svg>
                {{isLoading ? 'Saving...' : (isEditMode ? 'Update Quotation' : 'Create Quotation')}}
              </app-button>
            </div>
          </app-card>
        </app-stepper-step>
      </app-stepper>
    </div>
  `,
  styles: [`
    .quotation-form-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      color: #1f2937;
      font-size: 28px;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .customer-selection {
      margin-bottom: 24px;
    }

    .terms-panel {
      margin-top: 16px;
    }

    .terms-content {
      padding: 16px 0;
    }

    .add-item-section {
      margin-bottom: 24px;
    }

    .item-search {
      display: flex;
      gap: 16px;
      align-items: flex-end;
      margin-bottom: 24px;
    }

    .search-field {
      flex: 1;
    }

    .line-items-section {
      margin-bottom: 24px;
    }

    .line-items-table {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 24px;
    }

    .table-header {
      display: grid;
      grid-template-columns: 300px 80px 120px 80px 80px 120px 80px;
      gap: 16px;
      padding: 16px;
      background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
      border-bottom: 1px solid #e5e7eb;
      font-weight: 600;
      color: #374151;
    }

    .header-cell {
      font-size: 14px;
      font-weight: 600;
    }

    .table-body {
      max-height: 400px;
      overflow-y: auto;
    }

    .table-row {
      display: grid;
      grid-template-columns: 300px 80px 120px 80px 80px 120px 80px;
      gap: 16px;
      padding: 16px;
      border-bottom: 1px solid #f3f4f6;
      align-items: start;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #f9fafb;
      }
    }

    .cell {
      min-height: 80px;
      display: flex;
      align-items: center;
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    .item-name-field,
    .item-desc-field {
      width: 100%;
    }

    .line-total {
      font-weight: 600;
      color: #2653a6;
      font-size: 14px;
      white-space: nowrap;
    }

    .delete-button {
      color: #ea3b26;
    }

    .totals-section {
      border-top: 2px solid #e5e7eb;
      padding: 20px;
      background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
      border-radius: 0 0 12px 12px;
    }

    .totals-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 320px;
      margin-left: auto;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
    }

    .total-label {
      font-weight: 500;
      color: #6b7280;
      font-size: 14px;
    }

    .total-value {
      font-weight: 600;
      color: #1f2937;
      font-size: 14px;
    }

    .total-value.discount {
      color: #ea3b26;
    }

    .grand-total {
      border-top: 2px solid #d1d5db;
      padding-top: 12px;
      margin-top: 8px;
    }

    .grand-total .total-label {
      font-size: 16px;
      color: #1f2937;
      font-weight: 600;
    }

    .grand-total .total-value {
      font-size: 18px;
      color: #2653a6;
      font-weight: 700;
    }

    .no-items {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: #9ca3af;
      text-align: center;
      border: 2px dashed #e5e7eb;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .no-items svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-items p {
      margin: 8px 0;
      font-size: 16px;
    }

    .no-items .hint {
      font-size: 14px;
      max-width: 300px;
      color: #6b7280;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .table-header,
      .table-row {
        grid-template-columns: 250px 60px 100px 60px 60px 100px 60px;
        gap: 8px;
        padding: 12px;
      }

      .header-cell,
      .total-label,
      .total-value {
        font-size: 12px;
      }
    }

    @media (max-width: 768px) {
      .quotation-form-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .header h1 {
        font-size: 24px;
      }

      .header-actions {
        width: 100%;
        justify-content: stretch;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .item-search {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }

      .line-items-table {
        overflow-x: auto;
      }

      .table-header,
      .table-row {
        grid-template-columns: 200px 50px 80px 50px 50px 80px 50px;
        gap: 4px;
        padding: 8px;
        min-width: 600px;
      }

      .totals-grid {
        max-width: 100%;
      }

      .no-items {
        padding: 32px 16px;
      }
    }

    // Reduce motion
    @media (prefers-reduced-motion: reduce) {
      .spinning {
        animation: none;
      }
    }
  `]
})
export class QuotationFormComponent implements OnInit {
  customerForm: FormGroup;
  quotationForm: FormGroup;
  isEditMode = false;
  quotationId: number | null = null;
  isLoading = false;
  fromEnquiry = false;
  enquiryId: number | null = null;
  currentStepIndex = 0;

  lineItems: LineItem[] = [];
  
  quotationSummary: QuotationSummary = {
    subtotal: 0,
    totalDiscount: 0,
    taxAmount: 0,
    grandTotal: 0
  };

  paymentTermsOptions: SelectOption[] = [
    { value: 'Net 30', label: 'Net 30 days' },
    { value: 'Net 15', label: 'Net 15 days' },
    { value: 'COD', label: 'Cash on Delivery' },
    { value: '50% Advance', label: '50% Advance, 50% on Delivery' },
    { value: 'Custom', label: 'Custom Terms' }
  ];

  taxRateOptions: SelectOption[] = [
    { value: 0, label: '0%' },
    { value: 5, label: '5%' },
    { value: 12, label: '12%' },
    { value: 18, label: '18%' },
    { value: 28, label: '28%' }
  ];

  customers: Customer[] = [
    { id: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice@abccorp.com', organizationName: 'ABC Corporation' },
    { id: 2, firstName: 'Bob', lastName: 'Smith', email: 'bob@xyzind.com', organizationName: 'XYZ Industries' },
    { id: 3, firstName: 'Carol', lastName: 'Davis', email: 'carol.davis@email.com', organizationName: '' }
  ];

  products: Product[] = [
    { id: 1, name: 'Industrial Motor', modelNumber: 'IM-001', description: 'High-performance industrial motor', unitPrice: 7500 },
    { id: 2, name: 'Electronic Controller', modelNumber: 'EC-002', description: 'Advanced electronic controller', unitPrice: 6000 },
    { id: 3, name: 'Precision Tool', modelNumber: 'PT-003', description: 'High-precision manufacturing tool', unitPrice: 5000 }
  ];

  get customerOptions(): AutocompleteOption[] {
    return this.customers.map(customer => ({
      value: customer,
      label: `${customer.firstName} ${customer.lastName}`,
      subtitle: `${customer.email} - ${customer.organizationName}`
    }));
  }

  get productOptions(): AutocompleteOption[] {
    return this.products.map(product => ({
      value: product,
      label: product.name,
      subtitle: `${product.modelNumber} - ₹${product.unitPrice.toLocaleString()}`
    }));
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
      customerOrganization: [''],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', Validators.required]
    });

    this.quotationForm = this.fb.group({
      quotationNumber: [{ value: this.generateQuotationNumber(), disabled: true }],
      quotationDate: [this.formatDate(new Date()), Validators.required],
      validUntil: [this.formatDate(this.getDefaultValidUntil()), Validators.required],
      reference: [''],
      notes: [''],
      paymentTerms: ['Net 30'],
      deliveryTerms: [''],
      warranty: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.quotationId = +params['id'];
        this.loadQuotation();
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['enquiryId']) {
        this.fromEnquiry = true;
        this.enquiryId = +params['enquiryId'];
        this.loadFromEnquiry();
      }
    });
  }

  private generateQuotationNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `QUO-${year}-${sequence}`;
  }

  private getDefaultValidUntil(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 30); // 30 days from now
    return date;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  selectCustomer(option: AutocompleteOption): void {
    const customer = option.value as Customer;
    this.customerForm.patchValue({
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerOrganization: customer.organizationName,
      customerEmail: customer.email
    });
  }

  addLineItem(option: AutocompleteOption): void {
    const product = option.value as Product;
    const newItem: LineItem = {
      productId: product.id,
      productName: product.name,
      productDescription: product.description,
      quantity: 1,
      unitPrice: product.unitPrice,
      discount: 0,
      taxRate: 18,
      lineTotal: product.unitPrice
    };
    
    this.lineItems.push(newItem);
    this.updateLineItem(this.lineItems.length - 1);
  }

  addCustomLineItem(): void {
    const newItem: LineItem = {
      productName: '',
      productDescription: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      lineTotal: 0
    };
    
    this.lineItems.push(newItem);
    this.calculateTotals();
  }

  removeLineItem(index: number): void {
    this.lineItems.splice(index, 1);
    this.calculateTotals();
  }

  updateLineItem(index: number): void {
    const item = this.lineItems[index];
    if (item) {
      const subtotal = item.quantity * item.unitPrice;
      const discountAmount = subtotal * (item.discount / 100);
      const taxableAmount = subtotal - discountAmount;
      const taxAmount = taxableAmount * (item.taxRate / 100);
      item.lineTotal = taxableAmount + taxAmount;
    }
    this.calculateTotals();
  }

  private calculateTotals(): void {
    this.quotationSummary.subtotal = this.lineItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    this.quotationSummary.totalDiscount = this.lineItems.reduce((sum, item) => {
      return sum + ((item.quantity * item.unitPrice) * (item.discount / 100));
    }, 0);

    this.quotationSummary.taxAmount = this.lineItems.reduce((sum, item) => {
      const taxableAmount = (item.quantity * item.unitPrice) - ((item.quantity * item.unitPrice) * (item.discount / 100));
      return sum + (taxableAmount * (item.taxRate / 100));
    }, 0);

    this.quotationSummary.grandTotal = this.quotationSummary.subtotal - this.quotationSummary.totalDiscount + this.quotationSummary.taxAmount;
  }

  nextStep(): void {
    if (this.currentStepIndex < 2) {
      this.currentStepIndex++;
    }
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  onStepChange(event: any): void {
    this.currentStepIndex = event.selectedIndex;
  }

  goBack(): void {
    this.router.navigate(['/quotations']);
  }

  getFieldError(formName: string, fieldName: string): string {
    const form = formName === 'customerForm' ? this.customerForm : this.quotationForm;
    const field = form.get(fieldName);
    
    if (field && field.touched && field.invalid) {
      if (field.errors?.['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'customerName': 'Customer name',
      'customerEmail': 'Email',
      'customerPhone': 'Phone',
      'validUntil': 'Valid until date'
    };
    return labels[fieldName] || fieldName;
  }

  trackByIndex(index: number, item: LineItem): number {
    return index;
  }

  private loadFromEnquiry(): void {
    // Load data from enquiry
    const mockEnquiry = {
      customer: {
        customerName: 'Alice Johnson',
        customerOrganization: 'ABC Corporation',
        customerEmail: 'alice@abccorp.com',
        customerPhone: '+1234567890'
      },
      reference: 'Industrial Motor Requirements',
      items: [
        {
          productName: 'Industrial Motor',
          productDescription: 'High-performance industrial motor',
          quantity: 10,
          unitPrice: 7500,
          discount: 0,
          taxRate: 18
        }
      ]
    };

    this.customerForm.patchValue(mockEnquiry.customer);
    this.quotationForm.patchValue({ reference: mockEnquiry.reference });
    this.lineItems = mockEnquiry.items.map(item => ({
      ...item,
      lineTotal: item.quantity * item.unitPrice * (1 + item.taxRate / 100)
    }));
    this.calculateTotals();
  }

  private loadQuotation(): void {
    // Load quotation data for editing
    alert('Loading quotation data...');
  }

  saveAsDraft(): void {
    const quotationData = this.buildQuotationData();
    quotationData.status = QuotationStatus.Draft;
    
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('Quotation saved as draft!');
      this.router.navigate(['/quotations']);
    }, 1500);
  }

  onSubmit(): void {
    if (this.customerForm.valid && this.quotationForm.valid && this.lineItems.length > 0) {
      this.isLoading = true;

      const quotationData = this.buildQuotationData();

      setTimeout(() => {
        this.isLoading = false;
        const message = this.isEditMode ? 'Quotation updated successfully!' : 'Quotation created successfully!';
        alert(message);
        this.router.navigate(['/quotations']);
      }, 2000);
    } else {
      alert('Please fill all required fields and add at least one line item');
    }
  }

  private buildQuotationData() {
    return {
      customer: this.customerForm.value,
      quotation: this.quotationForm.value,
      lineItems: this.lineItems,
      summary: this.quotationSummary,
      status: QuotationStatus.Sent
    };
  }
}
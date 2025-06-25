import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';

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
  CardComponent
} from '../../../shared/components';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber?: string;
  organizationName: string;
}

interface Product {
  id: number;
  name: string;
  modelNumber: string;
  brand: string;
  category: string;
}

interface EnquiryItem {
  productId: number;
  productName: string;
  productModel: string;
  quantity: number;
  notes: string;
}

@Component({
  selector: 'app-enquiry-form',
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
    CardComponent
  ],
  template: `
    <div class="enquiry-form-container">
      <div class="header">
        <h1>{{isEditMode ? 'Edit Enquiry' : 'Create New Enquiry'}}</h1>
        <app-button 
          variant="outline" 
          (click)="goBack()"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Enquiries
        </app-button>
      </div>

      <app-stepper [linear]="!isEditMode" [selectedIndex]="currentStepIndex" (selectionChange)="onStepChange($event)">
        <!-- Customer Information Step -->
        <app-stepper-step [stepControl]="customerForm" label="Customer Information">
          <app-card title="Customer Details" subtitle="Enter customer information for the enquiry">
            <form [formGroup]="customerForm">
              <div class="customer-selection" *ngIf="!isEditMode">
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
                  label="First Name"
                  formControlName="firstName"
                  [required]="true"
                  [error]="getFieldError('customerForm', 'firstName')"
                  width="100%"
                >
                </app-floating-input>

                <app-floating-input
                  label="Last Name"
                  formControlName="lastName"
                  [required]="true"
                  [error]="getFieldError('customerForm', 'lastName')"
                  width="100%"
                >
                </app-floating-input>
              </div>

              <div class="form-row">
                <app-floating-input
                  label="Email"
                  type="email"
                  formControlName="email"
                  [required]="true"
                  [error]="getFieldError('customerForm', 'email')"
                  width="100%"
                >
                </app-floating-input>

                <app-floating-input
                  label="Contact Number"
                  formControlName="contactNumber"
                  [required]="true"
                  [error]="getFieldError('customerForm', 'contactNumber')"
                  width="100%"
                >
                </app-floating-input>
              </div>

              <app-floating-input
                label="Organization Name (Optional)"
                formControlName="organizationName"
                width="100%"
                class="full-width"
              >
              </app-floating-input>
            </form>
            
            <div slot="actions">
              <app-button 
                variant="primary" 
                (click)="nextStep()" 
                [disabled]="customerForm.invalid"
              >
                Next: Enquiry Details
              </app-button>
            </div>
          </app-card>
        </app-stepper-step>

        <!-- Enquiry Details Step -->
        <app-stepper-step [stepControl]="enquiryForm" label="Enquiry Details">
          <app-card title="Enquiry Information" subtitle="Provide details about the enquiry">
            <form [formGroup]="enquiryForm">
              <app-floating-input
                label="Subject"
                formControlName="subject"
                [required]="true"
                placeholder="Brief description of requirement"
                [error]="getFieldError('enquiryForm', 'subject')"
                width="100%"
                class="full-width"
              >
              </app-floating-input>

              <app-floating-input
                label="Description"
                type="textarea"
                formControlName="description"
                placeholder="Detailed description of requirements"
                width="100%"
                class="full-width"
              >
              </app-floating-input>

              <div class="form-row">
                <app-select
                  label="Priority"
                  formControlName="priority"
                  [options]="priorityOptions"
                  [required]="true"
                  [error]="getFieldError('enquiryForm', 'priority')"
                  width="100%"
                >
                </app-select>

                <app-date-input
                  label="Requirement Date"
                  formControlName="requirementDate"
                  width="100%"
                >
                </app-date-input>
              </div>

              <app-floating-input
                label="Budget Range (Optional)"
                formControlName="budgetRange"
                placeholder="e.g., ₹50,000 - ₹1,00,000"
                width="100%"
                class="full-width"
              >
              </app-floating-input>
            </form>
            
            <div slot="actions">
              <app-button variant="outline" (click)="previousStep()">
                Previous
              </app-button>
              <app-button 
                variant="primary" 
                (click)="nextStep()" 
                [disabled]="enquiryForm.invalid"
              >
                Next: Add Products
              </app-button>
            </div>
          </app-card>
        </app-stepper-step>

        <!-- Products Step -->
        <app-stepper-step label="Products">
          <app-card title="Product Requirements" subtitle="Add products to this enquiry">
            <div class="add-product-section">
              <div class="product-search">
                <app-autocomplete
                  label="Search Products"
                  placeholder="Type product name or model number"
                  [options]="productOptions"
                  (optionSelected)="addProduct($event)"
                  width="100%"
                  class="search-field"
                >
                </app-autocomplete>
                <app-button variant="primary" (click)="openProductDialog()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Browse Products
                </app-button>
              </div>
            </div>

            <app-table
              *ngIf="enquiryItems.length > 0"
              [data]="enquiryItems"
              [columns]="productColumns"
              [actions]="productActions"
              emptyMessage="No products added yet"
              class="products-table"
            >
            </app-table>

            <div class="no-products" *ngIf="enquiryItems.length === 0">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zM15 14H9v-2h6v2zm0-4H9V8h6v2z"/>
              </svg>
              <p>No products added yet</p>
              <p class="hint">Use the search above or browse products to add items to this enquiry</p>
            </div>
            
            <div slot="actions">
              <app-button variant="outline" (click)="previousStep()">
                Previous
              </app-button>
              <app-button 
                variant="primary" 
                (click)="onSubmit()" 
                [disabled]="enquiryItems.length === 0 || isLoading"
              >
                <svg *ngIf="!isLoading" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </svg>
                <svg *ngIf="isLoading" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="spinning">
                  <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                </svg>
                {{isLoading ? 'Saving...' : (isEditMode ? 'Update Enquiry' : 'Create Enquiry')}}
              </app-button>
            </div>
          </app-card>
        </app-stepper-step>
      </app-stepper>
    </div>
  `,
  styles: [`
    .enquiry-form-container {
      padding: 24px;
      max-width: 1000px;
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

    .add-product-section {
      margin-bottom: 24px;
    }

    .product-search {
      display: flex;
      gap: 16px;
      align-items: flex-end;
      margin-bottom: 24px;
    }

    .search-field {
      flex: 1;
    }

    .products-table {
      margin-bottom: 24px;
    }

    .no-products {
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

    .no-products svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-products p {
      margin: 8px 0;
      font-size: 16px;
    }

    .no-products .hint {
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

    @media (max-width: 768px) {
      .enquiry-form-container {
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

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .product-search {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }

      .no-products {
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
export class EnquiryFormComponent implements OnInit {
  customerForm: FormGroup;
  enquiryForm: FormGroup;
  isEditMode = false;
  enquiryId: number | null = null;
  isLoading = false;
  currentStepIndex = 0;

  enquiryItems: EnquiryItem[] = [];
  
  priorityOptions: SelectOption[] = [
    { value: 'Low', label: 'Low Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'High', label: 'High Priority' },
    { value: 'Urgent', label: 'Urgent Priority' }
  ];

  productColumns: TableColumn[] = [
    {
      key: 'productName',
      label: 'Product',
      type: 'custom',
      width: '40%'
    },
    {
      key: 'quantity',
      label: 'Quantity',
      type: 'custom',
      width: '15%'
    },
    {
      key: 'notes',
      label: 'Notes',
      type: 'custom',
      width: '35%'
    }
  ];

  productActions: TableAction[] = [
    {
      label: 'Remove',
      icon: 'delete',
      color: 'warn',
      action: (item: EnquiryItem, index: number) => this.removeProduct(index)
    }
  ];

  customers: Customer[] = [
    { id: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice@abccorp.com', contactNumber: '+1234567890', organizationName: 'ABC Corporation' },
    { id: 2, firstName: 'Bob', lastName: 'Smith', email: 'bob@xyzind.com', contactNumber: '+0987654321', organizationName: 'XYZ Industries' },
    { id: 3, firstName: 'Carol', lastName: 'Davis', email: 'carol.davis@email.com', contactNumber: '+1122334455', organizationName: '' }
  ];

  products: Product[] = [
    { id: 1, name: 'Industrial Motor', modelNumber: 'IM-001', brand: 'Brand A', category: 'Machinery' },
    { id: 2, name: 'Electronic Controller', modelNumber: 'EC-002', brand: 'Brand B', category: 'Electronics' },
    { id: 3, name: 'Precision Tool', modelNumber: 'PT-003', brand: 'Brand C', category: 'Tools' }
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
      subtitle: `${product.modelNumber} - ${product.brand}`
    }));
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      organizationName: ['']
    });

    this.enquiryForm = this.fb.group({
      subject: ['', Validators.required],
      description: [''],
      priority: ['Medium', Validators.required],
      requirementDate: [''],
      budgetRange: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.enquiryId = +params['id'];
        this.loadEnquiry();
      }
    });
  }

  selectCustomer(option: AutocompleteOption): void {
    const customer = option.value as Customer;
    this.customerForm.patchValue({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      contactNumber: customer.contactNumber,
      organizationName: customer.organizationName
    });
  }

  addProduct(option: AutocompleteOption): void {
    const product = option.value as Product;
    const existingIndex = this.enquiryItems.findIndex(item => item.productId === product.id);
    
    if (existingIndex >= 0) {
      this.enquiryItems[existingIndex].quantity += 1;
    } else {
      this.enquiryItems.push({
        productId: product.id,
        productName: product.name,
        productModel: product.modelNumber,
        quantity: 1,
        notes: ''
      });
    }
  }

  removeProduct(index: number): void {
    this.enquiryItems.splice(index, 1);
  }

  updateItemQuantity(index: number, quantity: number): void {
    if (quantity > 0) {
      this.enquiryItems[index].quantity = quantity;
    }
  }

  updateItemNotes(index: number, notes: string): void {
    this.enquiryItems[index].notes = notes;
  }

  openProductDialog(): void {
    // Show notification that product browser is coming soon
    alert('Product browser coming soon');
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
    this.router.navigate(['/enquiries']);
  }

  getFieldError(formName: string, fieldName: string): string {
    const form = formName === 'customerForm' ? this.customerForm : this.enquiryForm;
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
      'firstName': 'First name',
      'lastName': 'Last name',
      'email': 'Email',
      'contactNumber': 'Contact number',
      'subject': 'Subject',
      'priority': 'Priority'
    };
    return labels[fieldName] || fieldName;
  }

  private loadEnquiry(): void {
    // Load enquiry data for editing
    const mockEnquiry = {
      customer: {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@abccorp.com',
        contactNumber: '+1234567890',
        organizationName: 'ABC Corporation'
      },
      enquiry: {
        subject: 'Industrial Motor Requirements',
        description: 'Need quotation for industrial motors',
        priority: 'High',
        requirementDate: '2024-02-15',
        budgetRange: '₹50,000 - ₹1,00,000'
      },
      items: [
        {
          productId: 1,
          productName: 'Industrial Motor',
          productModel: 'IM-001',
          quantity: 10,
          notes: 'Urgent requirement'
        }
      ]
    };

    this.customerForm.patchValue(mockEnquiry.customer);
    this.enquiryForm.patchValue(mockEnquiry.enquiry);
    this.enquiryItems = mockEnquiry.items;
  }

  onSubmit(): void {
    if (this.customerForm.valid && this.enquiryForm.valid && this.enquiryItems.length > 0) {
      this.isLoading = true;

      const enquiryData = {
        customerInfo: this.customerForm.value,
        enquiryDetails: this.enquiryForm.value,
        items: this.enquiryItems
      };

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        const message = this.isEditMode ? 'Enquiry updated successfully!' : 'Enquiry created successfully!';
        alert(message);
        this.router.navigate(['/enquiries']);
      }, 2000);
    } else {
      alert('Please fill all required fields and add at least one product');
    }
  }
}
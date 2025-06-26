import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FloatingInputComponent } from '../../../shared/components/floating-input/floating-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatingInputComponent,
    ButtonComponent,
    CheckboxComponent
  ],
  template: `
    <div class="brand-form-container">
      <div class="header">
        <h1>{{isEditMode ? 'Edit Brand' : 'Create Brand'}}</h1>
        <app-button 
          variant="outline" 
          icon="arrow-back" 
          (click)="goBack()">
          Back to Brands
        </app-button>
      </div>

      <div class="form-card">
        <div class="card-header">
          <h2>{{isEditMode ? 'Edit Brand Details' : 'Brand Information'}}</h2>
          <p class="card-subtitle">
            {{isEditMode ? 'Update the brand information below' : 'Enter the details for the new brand'}}
          </p>
        </div>
        
        <div class="card-content">
          <form [formGroup]="brandForm" (ngSubmit)="onSubmit()">
            <div class="form-section">
              <app-floating-input
                label="Brand Name"
                [required]="true"
                formControlName="name"
                width="100%"
                [error]="getFieldError('name')">
              </app-floating-input>

              <app-floating-input
                label="Description (Optional)"
                type="textarea"
                formControlName="description"
                width="100%"
                [error]="getFieldError('description')">
              </app-floating-input>

              <div class="checkbox-section">
                <app-checkbox 
                  formControlName="isActive"
                  label="Active Brand">
                </app-checkbox>
                <p class="checkbox-description">
                  Active brands are available for product assignment and will appear in dropdown lists
                </p>
              </div>
            </div>

            <div class="form-actions">
              <app-button 
                variant="outline" 
                type="button" 
                (click)="goBack()">
                Cancel
              </app-button>
              <app-button 
                variant="primary" 
                type="submit" 
                [disabled]="brandForm.invalid || isLoading"
                [loading]="isLoading"
                [icon]="isEditMode ? 'save' : 'plus'">
                {{isEditMode ? 'Update Brand' : 'Create Brand'}}
              </app-button>
            </div>
          </form>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="preview-card" *ngIf="brandForm.get('name')?.value">
        <div class="card-header">
          <h3>Preview</h3>
          <p class="card-subtitle">How this brand will appear in the system</p>
        </div>
        
        <div class="card-content">
          <div class="brand-preview">
            <div class="preview-item">
              <strong>Brand Name:</strong>
              <span>{{brandForm.get('name')?.value}}</span>
            </div>
            
            <div class="preview-item" *ngIf="brandForm.get('description')?.value">
              <strong>Description:</strong>
              <span>{{brandForm.get('description')?.value}}</span>
            </div>
            
            <div class="preview-item">
              <strong>Status:</strong>
              <span class="status-badge" 
                    [class.active]="brandForm.get('isActive')?.value" 
                    [class.inactive]="!brandForm.get('isActive')?.value">
                {{brandForm.get('isActive')?.value ? 'Active' : 'Inactive'}}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Information -->
      <div class="info-card" *ngIf="isEditMode">
        <div class="card-header">
          <h3>Brand Statistics</h3>
        </div>
        
        <div class="card-content">
          <div class="stats-grid">
            <div class="stat-item">
              <svg class="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 7h-3V6a4 4 0 0 0-4-4h-2a4 4 0 0 0-4 4v1H4a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM9 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1H9V6zm9 13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h6v1a1 1 0 0 0 2 0V9h2v10z"/>
              </svg>
              <div>
                <div class="stat-number">{{mockStats.productCount}}</div>
                <div class="stat-label">Products</div>
              </div>
            </div>
            
            <div class="stat-item">
              <svg class="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
              <div>
                <div class="stat-number">{{mockStats.enquiryCount}}</div>
                <div class="stat-label">Related Enquiries</div>
              </div>
            </div>
            
            <div class="stat-item">
              <svg class="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
              <div>
                <div class="stat-number">{{mockStats.quotationCount}}</div>
                <div class="stat-label">Quotations</div>
              </div>
            </div>
          </div>
          
          <div class="warning-section" *ngIf="mockStats.productCount > 0">
            <svg class="warning-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <div class="warning-text">
              <strong>Note:</strong> This brand is currently associated with {{mockStats.productCount}} product(s). 
              Deactivating this brand will affect product visibility but will not delete existing associations.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .brand-form-container {
      padding: 24px;
      max-width: 800px;
      font-family: Arial, sans-serif;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      color: #2653a6;
      font-size: 28px;
      font-weight: 600;
    }

    .form-card,
    .preview-card,
    .info-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
      margin-bottom: 24px;
    }

    .card-header {
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid #f3f4f6;
      margin-bottom: 24px;
    }

    .card-header h2,
    .card-header h3 {
      margin: 0 0 8px 0;
      color: #1f2937;
      font-weight: 600;
    }

    .card-header h2 {
      font-size: 20px;
    }

    .card-header h3 {
      font-size: 18px;
    }

    .card-subtitle {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
      padding-bottom: 16px;
    }

    .card-content {
      padding: 0 24px 24px 24px;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .checkbox-section {
      margin: 24px 0;
      padding: 20px;
      background-color: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .checkbox-description {
      font-size: 14px;
      color: #64748b;
      margin-top: 8px;
      line-height: 1.5;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .brand-preview {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .preview-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .preview-item strong {
      min-width: 120px;
      color: #4b5563;
      font-weight: 600;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.active {
      background-color: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .status-badge.inactive {
      background-color: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .stat-icon {
      color: #2653a6;
      flex-shrink: 0;
    }

    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: #2653a6;
      line-height: 1;
    }

    .stat-label {
      color: #64748b;
      font-size: 14px;
      margin-top: 4px;
    }

    .warning-section {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 20px;
      background-color: #fffbeb;
      border: 1px solid #fed7aa;
      border-radius: 8px;
    }

    .warning-icon {
      color: #ea3b26;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .warning-text {
      flex: 1;
      font-size: 14px;
      line-height: 1.5;
      color: #92400e;
    }

    .warning-text strong {
      color: #ea3b26;
    }

    @media (max-width: 768px) {
      .brand-form-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .form-actions {
        flex-direction: column-reverse;
        gap: 12px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .warning-section {
        flex-direction: column;
        gap: 8px;
      }

      .card-header,
      .card-content {
        padding: 16px;
      }

      .card-header {
        margin-bottom: 16px;
      }
    }
  `]
})
export class BrandFormComponent implements OnInit {
  brandForm: FormGroup;
  isEditMode = false;
  brandId: number | null = null;
  isLoading = false;

  mockStats = {
    productCount: 0,
    enquiryCount: 0,
    quotationCount: 0
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.brandForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(100)
      ]],
      description: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.brandId = +params['id'];
        this.loadBrand();
      }
    });
  }

  private loadBrand() {
    // Mock brand data for editing
    const mockBrand = {
      name: 'Brand A',
      description: 'A leading manufacturer of industrial equipment and machinery components.',
      isActive: true
    };

    this.mockStats = {
      productCount: 15,
      enquiryCount: 42,
      quotationCount: 28
    };

    this.brandForm.patchValue(mockBrand);
  }

  onSubmit() {
    if (this.brandForm.valid) {
      this.isLoading = true;
      
      const brandData = {
        ...this.brandForm.value,
        id: this.brandId
      };

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        const message = this.isEditMode ? 'Brand updated successfully!' : 'Brand created successfully!';
        console.log(message);
        this.router.navigate(['/brands']);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      this.brandForm.markAllAsTouched();
      console.log('Please fix the errors in the form');
    }
  }

  goBack(): void {
    this.router.navigate(['/brands']);
  }

  getFieldError(fieldName: string): string {
    const field = this.brandForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.hasError('required')) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.hasError('minlength')) {
        const requiredLength = field.getError('minlength').requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${requiredLength} characters long`;
      }
      if (field.hasError('maxlength')) {
        const requiredLength = field.getError('maxlength').requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${requiredLength} characters`;
      }
    }
    return '';
  }
}
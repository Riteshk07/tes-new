import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FloatingInputComponent } from '../../../shared/components/floating-input/floating-input.component';
import { SelectComponent, SelectOption } from '../../../shared/components/select/select.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';
import { StepperComponent, StepperStepComponent } from '../../../shared/components/stepper/stepper.component';
import { ChipComponent, ChipSetComponent } from '../../../shared/components/chip/chip.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatingInputComponent,
    SelectComponent,
    ButtonComponent,
    CheckboxComponent,
    StepperComponent,
    StepperStepComponent,
    ChipComponent,
    ChipSetComponent
  ],
  template: `
    <div class="product-form-container">
      <div class="header">
        <h1>{{isEditMode ? 'Edit Product' : 'Create Product'}}</h1>
        <app-button 
          variant="outline" 
          icon="arrow-back" 
          (click)="goBack()">
          Back to Products
        </app-button>
      </div>

      <app-stepper [linear]="!isEditMode" [selectedIndex]="currentStepIndex" (selectedIndexChange)="currentStepIndex = $event">
        <!-- Basic Information Step -->
        <app-stepper-step [stepControl]="basicInfoForm" label="Basic Information">
          <div class="step-card">
            <div class="step-header">
              <h2>Product Information</h2>
              <p class="step-subtitle">Enter the basic product details</p>
            </div>
            
            <div class="step-content">
              <form [formGroup]="basicInfoForm">
                <div class="form-section">
                  <app-floating-input
                    label="Product Name"
                    [required]="true"
                    formControlName="name"
                    width="100%"
                    [error]="getFieldError('name', basicInfoForm)">
                  </app-floating-input>

                  <div class="form-row">
                    <app-floating-input
                      label="Model Number"
                      [required]="true"
                      formControlName="modelNumber"
                      width="100%"
                      [error]="getFieldError('modelNumber', basicInfoForm)">
                    </app-floating-input>

                    <app-floating-input
                      label="Minimum Buying Quantity"
                      type="number"
                      [required]="true"
                      formControlName="minimumBuyingQuantity"
                      width="100%"
                      [error]="getFieldError('minimumBuyingQuantity', basicInfoForm)">
                    </app-floating-input>
                  </div>

                  <app-floating-input
                    label="Description (Optional)"
                    type="textarea"
                    formControlName="description"
                    width="100%"
                    [error]="getFieldError('description', basicInfoForm)">
                  </app-floating-input>

                  <div class="checkbox-section">
                    <app-checkbox 
                      formControlName="isActive"
                      label="Active Product">
                    </app-checkbox>
                    <p class="checkbox-description">
                      Active products are available for customer inquiries and quotations
                    </p>
                  </div>
                </div>
              </form>
            </div>
            
            <div class="step-actions">
              <app-button 
                variant="primary" 
                (click)="nextStep()" 
                [disabled]="basicInfoForm.invalid">
                Next: Categories & Attributes
              </app-button>
            </div>
          </div>
        </app-stepper-step>

        <!-- Categories & Attributes Step -->
        <app-stepper-step [stepControl]="categoriesForm" label="Categories & Attributes">
          <div class="step-card">
            <div class="step-header">
              <h2>Product Categories & Attributes</h2>
              <p class="step-subtitle">Select brand, category, and optional attributes</p>
            </div>
            
            <div class="step-content">
              <form [formGroup]="categoriesForm">
                <div class="form-section">
                  <div class="form-row">
                    <app-select
                      label="Brand"
                      [options]="brandOptions"
                      [required]="true"
                      formControlName="brandId"
                      width="100%"
                      [error]="getFieldError('brandId', categoriesForm)">
                    </app-select>

                    <app-select
                      label="Category"
                      [options]="categoryOptions"
                      [required]="true"
                      formControlName="categoryId"
                      width="100%"
                      [error]="getFieldError('categoryId', categoriesForm)">
                    </app-select>
                  </div>

                  <div class="form-row">
                    <app-select
                      label="Color (Optional)"
                      [options]="colorOptions"
                      formControlName="colorId"
                      width="100%"
                      placeholder="No Color">
                    </app-select>

                    <app-select
                      label="Materials"
                      [options]="materialOptions"
                      [multiple]="true"
                      formControlName="materialIds"
                      width="100%"
                      placeholder="Select materials">
                    </app-select>
                  </div>

                  <div class="selected-materials" *ngIf="categoriesForm.get('materialIds')?.value?.length">
                    <span class="materials-label">Selected Materials:</span>
                    <app-chip-set>
                      <app-chip 
                        *ngFor="let materialId of categoriesForm.get('materialIds')?.value"
                        [label]="getMaterialName(materialId)"
                        [removable]="true"
                        variant="primary"
                        (removed)="removeMaterial(materialId)">
                      </app-chip>
                    </app-chip-set>
                  </div>
                </div>
              </form>
            </div>
            
            <div class="step-actions">
              <app-button 
                variant="outline" 
                (click)="previousStep()">
                Previous
              </app-button>
              <app-button 
                variant="primary" 
                (click)="nextStep()" 
                [disabled]="categoriesForm.invalid">
                Next: Images
              </app-button>
            </div>
          </div>
        </app-stepper-step>

        <!-- Images Step -->
        <app-stepper-step label="Product Images">
          <div class="step-card">
            <div class="step-header">
              <h2>Product Images</h2>
              <p class="step-subtitle">Upload product images (optional)</p>
            </div>
            
            <div class="step-content">
              <div class="image-upload-section">
                <div class="upload-area" 
                     (dragover)="onDragOver($event)" 
                     (dragleave)="onDragLeave($event)"
                     (drop)="onDrop($event)"
                     [class.drag-over]="isDragOver">
                  <input type="file" #fileInput multiple accept="image/*" 
                         (change)="onFileSelected($event)" style="display: none;">
                  
                  <div class="upload-content">
                    <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                    <p>Drag and drop images here or</p>
                    <app-button 
                      variant="primary" 
                      (click)="fileInput.click()">
                      Browse Files
                    </app-button>
                    <p class="upload-hint">Supports: JPG, PNG, GIF (Max 5MB each)</p>
                  </div>
                </div>

                <div class="image-preview" *ngIf="productImages.length > 0">
                  <h4>Uploaded Images</h4>
                  <div class="image-grid">
                    <div *ngFor="let image of productImages; let i = index" class="image-item">
                      <img [src]="image.url" [alt]="'Product image ' + (i + 1)">
                      <div class="image-overlay">
                        <button 
                          type="button"
                          class="image-action-btn delete-btn"
                          (click)="removeImage(i)">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                          </svg>
                        </button>
                        <button 
                          type="button"
                          class="image-action-btn star-btn"
                          [class.primary]="i === 0"
                          (click)="setPrimaryImage(i)">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p class="image-hint">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
                    </svg>
                    First image will be used as primary product image
                  </p>
                </div>
              </div>
            </div>
            
            <div class="step-actions">
              <app-button 
                variant="outline" 
                (click)="previousStep()">
                Previous
              </app-button>
              <app-button 
                variant="primary" 
                type="submit"
                (click)="onSubmit()" 
                [disabled]="isLoading || !isFormValid()"
                [loading]="isLoading"
                [icon]="isEditMode ? 'save' : 'plus'">
                {{isEditMode ? 'Update Product' : 'Create Product'}}
              </app-button>
            </div>
          </div>
        </app-stepper-step>
      </app-stepper>
    </div>
  `,
  styles: [`
    .product-form-container {
      padding: 24px;
      max-width: 900px;
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

    .step-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
      margin-bottom: 24px;
    }

    .step-header {
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid #f3f4f6;
      margin-bottom: 24px;
    }

    .step-header h2 {
      margin: 0 0 8px 0;
      color: #1f2937;
      font-weight: 600;
      font-size: 20px;
    }

    .step-subtitle {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
      padding-bottom: 16px;
    }

    .step-content {
      padding: 0 24px 24px 24px;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-row > * {
      flex: 1;
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

    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      padding: 16px 24px 24px 24px;
      border-top: 1px solid #e5e7eb;
    }

    .selected-materials {
      margin-top: 20px;
      padding: 16px;
      background-color: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .materials-label {
      font-weight: 600;
      color: #2653a6;
      margin-bottom: 12px;
      display: block;
      font-size: 14px;
    }

    .image-upload-section {
      padding: 16px 0;
    }

    .upload-area {
      border: 2px dashed #d1d5db;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
      background-color: #f9fafb;
    }

    .upload-area:hover,
    .upload-area.drag-over {
      border-color: #2653a6;
      background-color: #eff6ff;
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .upload-icon {
      color: #9ca3af;
      margin-bottom: 8px;
    }

    .upload-hint {
      color: #999;
      font-size: 0.85rem;
      margin: 0;
    }

    .image-preview {
      margin-top: 24px;
    }

    .image-preview h4 {
      margin-bottom: 16px;
      color: #333;
    }

    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .image-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      aspect-ratio: 1;
    }

    .image-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .image-item:hover .image-overlay {
      opacity: 1;
    }

    .image-action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.9);
      color: #4b5563;
    }

    .image-action-btn:hover {
      background: rgba(255, 255, 255, 1);
      transform: scale(1.05);
    }

    .delete-btn {
      color: #ea3b26;
    }

    .star-btn {
      color: #f59e0b;
    }

    .star-btn.primary {
      background: rgba(245, 158, 11, 0.9);
      color: white;
    }

    .image-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6b7280;
      font-size: 14px;
      margin: 0;
      padding: 12px 16px;
      background-color: #f3f4f6;
      border-radius: 8px;
      border-left: 4px solid #2653a6;
    }

    .image-hint svg {
      color: #2653a6;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }

      .half-width {
        width: 100%;
      }

      .upload-area {
        padding: 24px;
      }

      .image-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  basicInfoForm: FormGroup;
  categoriesForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  isLoading = false;
  isDragOver = false;
  currentStepIndex = 0;

  brands: any[] = [];
  categories: any[] = [];
  colors: any[] = [];
  materials: any[] = [];
  productImages: any[] = [];

  brandOptions: any[] = [];
  categoryOptions: any[] = [];
  colorOptions: any[] = [];
  materialOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.basicInfoForm = this.fb.group({
      name: ['', Validators.required],
      modelNumber: ['', Validators.required],
      description: [''],
      minimumBuyingQuantity: [1, [Validators.required, Validators.min(1)]],
      isActive: [true]
    });

    this.categoriesForm = this.fb.group({
      brandId: ['', Validators.required],
      categoryId: ['', Validators.required],
      colorId: [null],
      materialIds: [[]]
    });
  }

  ngOnInit() {
    this.loadMockData();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct();
      }
    });
  }

  private loadMockData() {
    this.brands = [
      { id: 1, name: 'Brand A' },
      { id: 2, name: 'Brand B' },
      { id: 3, name: 'Brand C' }
    ];

    this.categories = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Machinery' },
      { id: 3, name: 'Tools' }
    ];

    this.colors = [
      { id: 1, name: 'Red', hex: '#f44336' },
      { id: 2, name: 'Blue', hex: '#2196f3' },
      { id: 3, name: 'Green', hex: '#4caf50' },
      { id: 4, name: 'Black', hex: '#000000' }
    ];

    this.materials = [
      { id: 1, name: 'Steel' },
      { id: 2, name: 'Aluminum' },
      { id: 3, name: 'Plastic' },
      { id: 4, name: 'Copper' },
      { id: 5, name: 'Rubber' }
    ];

    // Convert to SelectOption format
    this.brandOptions = this.brands.map(brand => ({ 
      value: brand.id, 
      label: brand.name 
    }));

    this.categoryOptions = this.categories.map(category => ({ 
      value: category.id, 
      label: category.name 
    }));

    this.colorOptions = [
      { value: null, label: 'No Color' },
      ...this.colors.map(color => ({ 
        value: color.id, 
        label: color.name 
      }))
    ];

    this.materialOptions = this.materials.map(material => ({ 
      value: material.id, 
      label: material.name 
    }));
  }

  private loadProduct() {
    // Mock product data for editing
    const mockProduct = {
      name: 'Industrial Motor',
      modelNumber: 'IM-001',
      description: 'High-performance industrial motor',
      minimumBuyingQuantity: 5,
      isActive: true,
      brandId: 1,
      categoryId: 2,
      colorId: 1,
      materialIds: [1, 2]
    };

    this.basicInfoForm.patchValue(mockProduct);
    this.categoriesForm.patchValue(mockProduct);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    this.processFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(files);
    }
  }

  private processFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        console.log('Only image files are allowed');
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        console.log('File size must be less than 5MB');
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productImages.push({
          file: file,
          url: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    this.productImages.splice(index, 1);
  }

  setPrimaryImage(index: number) {
    if (index !== 0) {
      const primaryImage = this.productImages.splice(index, 1)[0];
      this.productImages.unshift(primaryImage);
    }
  }

  removeMaterial(materialId: number) {
    const current = this.categoriesForm.get('materialIds')?.value || [];
    this.categoriesForm.patchValue({
      materialIds: current.filter((id: number) => id !== materialId)
    });
  }

  getMaterialName(materialId: number): string {
    return this.materials.find(m => m.id === materialId)?.name || '';
  }

  isFormValid(): boolean {
    return this.basicInfoForm.valid && this.categoriesForm.valid;
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.isLoading = true;
      
      const productData = {
        ...this.basicInfoForm.value,
        ...this.categoriesForm.value,
        imageUrls: this.productImages.map(img => img.url)
      };

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        const message = this.isEditMode ? 'Product updated successfully!' : 'Product created successfully!';
        console.log(message);
        this.router.navigate(['/products']);
      }, 2000);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  nextStep(): void {
    this.currentStepIndex++;
  }

  previousStep(): void {
    this.currentStepIndex--;
  }

  getFieldError(fieldName: string, form: FormGroup): string {
    const field = form.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.hasError('required')) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.hasError('min')) {
        const min = field.getError('min').min;
        return `${this.getFieldDisplayName(fieldName)} must be at least ${min}`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Product name',
      modelNumber: 'Model number',
      description: 'Description',
      minimumBuyingQuantity: 'Minimum buying quantity',
      brandId: 'Brand',
      categoryId: 'Category'
    };
    return displayNames[fieldName] || fieldName;
  }
}
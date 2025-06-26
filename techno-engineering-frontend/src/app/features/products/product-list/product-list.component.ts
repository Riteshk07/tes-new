import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Import shared components
import { 
  SearchInputComponent,
  ButtonComponent,
  CardComponent,
  SelectComponent,
  ChipComponent,
  TableComponent
} from '../../../shared/components';

interface ProductFilter {
  pageNumber: number;
  take: number;
  search: string;
  brandIds: number[];
  categoryIds: number[];
  colorIds: number[];
}

@Component({
  selector: 'app-product-list',
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
    <div class="product-list-container">
      <div class="header">
        <h1>Products</h1>
        <div class="header-actions">
          <app-button variant="primary" routerLink="/products/create">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Product
          </app-button>
          <app-button 
            variant="outline"
            [class.active]="viewMode === 'table'"
            (click)="viewMode = 'table'"
            title="Table View"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/>
            </svg>
          </app-button>
          <app-button 
            variant="outline"
            [class.active]="viewMode === 'grid'"
            (click)="viewMode = 'grid'"
            title="Grid View"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/>
            </svg>
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
      <app-card title="Product Filters" class="filters-card">
        <div class="filters-row">
          <app-search-input
            placeholder="Search products by name, model, or description"
            (search)="onSearch($event)"
            width="400px"
          ></app-search-input>

          <app-select
            placeholder="Select brands"
            [options]="brandOptions"
            [multiple]="true"
            [formControl]="brandControl"
            width="200px"
          ></app-select>

          <app-select
            placeholder="Select categories"
            [options]="categoryOptions"
            [multiple]="true"
            [formControl]="categoryControl"
            width="200px"
          ></app-select>

          <app-select
            placeholder="Select colors"
            [options]="colorOptions"
            [multiple]="true"
            [formControl]="colorControl"
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
              *ngFor="let brandId of getSelectedBrands()" 
              (remove)="removeBrandFilter(brandId)"
              [removable]="true"
            >
              {{getBrandName(brandId)}}
            </app-chip>
            <app-chip 
              *ngFor="let categoryId of getSelectedCategories()" 
              (remove)="removeCategoryFilter(categoryId)"
              [removable]="true"
            >
              {{getCategoryName(categoryId)}}
            </app-chip>
            <app-chip 
              *ngFor="let colorId of getSelectedColors()" 
              (remove)="removeColorFilter(colorId)"
              [removable]="true"
            >
              {{getColorName(colorId)}}
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
                <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{totalProducts}}</div>
                <div class="stat-label">Total Products</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon active" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getActiveProducts()}}</div>
                <div class="stat-label">Active</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon inactive" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getInactiveProducts()}}</div>
                <div class="stat-label">Inactive</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon brands" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,7L13.09,10.26L16.5,11L13.09,11.74L12,15L10.91,11.74L7.5,11L10.91,10.26L12,7M12,2L14.39,8.26L22,9L14.39,9.74L12,16L9.61,9.74L2,9L9.61,8.26L12,2Z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getTotalBrands()}}</div>
                <div class="stat-label">Brands</div>
              </div>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Table View -->
      <app-card *ngIf="viewMode === 'table'">
        <app-table
          [data]="filteredProducts"
          [columns]="tableColumns"
          [searchable]="false"
          [sortable]="true"
        >
          <ng-template #imageTemplate let-product>
            <div class="product-image">
              <img [src]="getProductImage(product)" [alt]="product.name" 
                   onerror="this.src='assets/images/no-image.png'">
            </div>
          </ng-template>

          <ng-template #nameTemplate let-product>
            <div class="product-info">
              <div class="product-name">{{product.name}}</div>
              <div class="product-model">{{product.modelNumber}}</div>
            </div>
          </ng-template>

          <ng-template #colorTemplate let-product>
            <span class="color-display" *ngIf="product.color">
              <span class="color-dot" [style.background-color]="getColorHex(product.colorId)"></span>
              {{product.color}}
            </span>
            <span *ngIf="!product.color">-</span>
          </ng-template>

          <ng-template #statusTemplate let-product>
            <span class="status-badge" [class.active]="product.isActive" [class.inactive]="!product.isActive">
              {{product.isActive ? 'Active' : 'Inactive'}}
            </span>
          </ng-template>

          <ng-template #actionsTemplate let-product>
            <div class="action-buttons">
              <app-button 
                variant="outline" 
                size="small"
                [routerLink]="['/products/view', product.id]"
                title="View Product"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </app-button>
              <app-button 
                variant="outline" 
                size="small"
                [routerLink]="['/products/edit', product.id]"
                title="Edit Product"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </app-button>
              <app-button 
                variant="outline" 
                size="small"
                (click)="deleteProduct(product.id)"
                title="Delete Product"
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
            Page {{currentPage}} of {{totalPages}} ({{filteredProducts.length}} products)
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

      <!-- Grid View -->
      <div class="products-grid" *ngIf="viewMode === 'grid'">
        <app-card *ngFor="let product of filteredProducts" class="product-card">
          <div class="product-image-container">
            <img [src]="getProductImage(product)" [alt]="product.name"
                 onerror="this.src='assets/images/no-image.png'">
            <div class="product-status" [class.active]="product.isActive" [class.inactive]="!product.isActive">
              {{product.isActive ? 'Active' : 'Inactive'}}
            </div>
          </div>
          
          <div class="product-header">
            <h3 class="product-title">{{product.name}}</h3>
            <p class="product-subtitle">{{product.modelNumber}}</p>
          </div>
          
          <div class="product-content">
            <div class="product-details">
              <div class="detail-item">
                <strong>Brand:</strong> {{product.brand}}
              </div>
              <div class="detail-item">
                <strong>Category:</strong> {{product.category}}
              </div>
              <div class="detail-item" *ngIf="product.color">
                <strong>Color:</strong>
                <span class="color-display">
                  <span class="color-dot" [style.background-color]="getColorHex(product.colorId)"></span>
                  {{product.color}}
                </span>
              </div>
              <div class="detail-item">
                <strong>Min Quantity:</strong> {{product.minimumBuyingQuantity}}
              </div>
            </div>
          </div>
          
          <div class="product-actions">
            <app-button 
              variant="outline" 
              size="small"
              [routerLink]="['/products/view', product.id]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              View
            </app-button>
            <app-button 
              variant="outline" 
              size="small"
              [routerLink]="['/products/edit', product.id]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Edit
            </app-button>
          </div>
        </app-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="filteredProducts.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <p>No products found</p>
        <p class="hint">Try adjusting your search criteria or add some products</p>
      </div>
    </div>
  `,
  styles: [`
    .product-list-container {
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
      margin-bottom: 16px;
    }

    .clear-filters {
      white-space: nowrap;
    }

    .active-filters {
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

    .header-actions .active {
      background-color: #2653a6;
      color: white;
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

    .stat-icon.active { color: #4caf50; }
    .stat-icon.inactive { color: #f44336; }
    .stat-icon.brands { color: #ff9800; }

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

    .color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid #ccc;
      display: inline-block;
    }

    .color-display {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .delete-button {
      color: #ea3b26 !important;
    }

    .product-image {
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.active {
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
      color: #2e7d32;
      border: 1px solid rgba(76, 175, 80, 0.3);
    }

    .status-badge.inactive {
      background: linear-gradient(135deg, rgba(234, 59, 38, 0.1) 0%, rgba(234, 59, 38, 0.05) 100%);
      color: #ea3b26;
      border: 1px solid rgba(234, 59, 38, 0.3);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .product-card {
      position: relative;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(38, 83, 166, 0.15);
    }

    .product-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
      border-radius: 12px 12px 0 0;
    }

    .product-image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-header {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
    }

    .product-title {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .product-subtitle {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
    }

    .product-content {
      padding: 16px;
    }

    .product-actions {
      padding: 16px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .product-status {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .product-status.active {
      background: #10b981;
      color: white;
    }

    .product-status.inactive {
      background: #ea3b26;
      color: white;
    }

    .product-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
    }

    .detail-item strong {
      color: #2653a6;
      min-width: 80px;
      font-weight: 600;
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

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: #9ca3af;
      text-align: center;
    }

    .empty-state svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 4px 0;
      font-size: 16px;
    }

    .empty-state .hint {
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

      .products-grid {
        grid-template-columns: 1fr;
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
        width: 36px;
        height: 36px;
      }

      .stat-number {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  @ViewChild('imageTemplate', { static: true }) imageTemplate!: TemplateRef<any>;
  @ViewChild('nameTemplate', { static: true }) nameTemplate!: TemplateRef<any>;
  @ViewChild('colorTemplate', { static: true }) colorTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  viewMode: 'table' | 'grid' = 'table';
  
  searchControl = new FormControl('');
  brandControl = new FormControl<number[]>([]);
  categoryControl = new FormControl<number[]>([]);
  colorControl = new FormControl<number[]>([]);

  tableColumns: any[] = [];
  
  products: any[] = [];
  filteredProducts: any[] = [];
  brands: any[] = [];
  categories: any[] = [];
  colors: any[] = [];
  totalProducts = 0;
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  brandOptions: any[] = [];
  categoryOptions: any[] = [];
  colorOptions: any[] = [];

  ngOnInit() {
    this.loadMockData();
    this.setupFilters();
    this.filteredProducts = [...this.products];
    
    // Initialize table columns
    this.tableColumns = [
      { key: 'image', title: 'Image', label: 'Image', template: this.imageTemplate },
      { key: 'name', title: 'Product', label: 'Product', template: this.nameTemplate },
      { key: 'brand', title: 'Brand', label: 'Brand' },
      { key: 'category', title: 'Category', label: 'Category' },
      { key: 'color', title: 'Color', label: 'Color', template: this.colorTemplate },
      { key: 'minimumBuyingQuantity', title: 'Min Qty', label: 'Min Qty' },
      { key: 'isActive', title: 'Status', label: 'Status', template: this.statusTemplate },
      { key: 'actions', title: 'Actions', label: 'Actions', template: this.actionsTemplate }
    ];
  }

  private setupFilters() {
    this.brandControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });

    this.categoryControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });

    this.colorControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  private loadMockData() {
    // Load brands
    this.brands = [
      { id: 1, name: 'Brand A' },
      { id: 2, name: 'Brand B' },
      { id: 3, name: 'Brand C' }
    ];

    this.brandOptions = this.brands.map(brand => ({
      value: brand.id,
      label: brand.name
    }));

    // Load categories
    this.categories = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Machinery' },
      { id: 3, name: 'Tools' }
    ];

    this.categoryOptions = this.categories.map(category => ({
      value: category.id,
      label: category.name
    }));

    // Load colors
    this.colors = [
      { id: 1, name: 'Red', hex: '#f44336' },
      { id: 2, name: 'Blue', hex: '#2196f3' },
      { id: 3, name: 'Green', hex: '#4caf50' },
      { id: 4, name: 'Black', hex: '#000000' }
    ];

    this.colorOptions = this.colors.map(color => ({
      value: color.id,
      label: color.name
    }));

    // Load products
    this.products = [
      {
        id: 1,
        name: 'Industrial Motor',
        modelNumber: 'IM-001',
        description: 'High-performance industrial motor',
        brand: 'Brand A',
        brandId: 1,
        category: 'Machinery',
        categoryId: 2,
        color: 'Red',
        colorId: 1,
        minimumBuyingQuantity: 5,
        isActive: true,
        imageUrls: []
      },
      {
        id: 2,
        name: 'Electronic Controller',
        modelNumber: 'EC-002',
        description: 'Advanced electronic controller',
        brand: 'Brand B',
        brandId: 2,
        category: 'Electronics',
        categoryId: 1,
        color: 'Blue',
        colorId: 2,
        minimumBuyingQuantity: 10,
        isActive: true,
        imageUrls: []
      },
      {
        id: 3,
        name: 'Precision Tool',
        modelNumber: 'PT-003',
        description: 'High-precision manufacturing tool',
        brand: 'Brand C',
        brandId: 3,
        category: 'Tools',
        categoryId: 3,
        color: 'Black',
        colorId: 4,
        minimumBuyingQuantity: 2,
        isActive: false,
        imageUrls: []
      }
    ];

    this.totalProducts = this.products.length;
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(this.searchTerm) ||
        product.modelNumber.toLowerCase().includes(this.searchTerm) ||
        product.description.toLowerCase().includes(this.searchTerm)
      );
    }

    // Apply brand filter
    const selectedBrands = this.brandControl.value || [];
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brandId));
    }

    // Apply category filter
    const selectedCategories = this.categoryControl.value || [];
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.categoryId));
    }

    // Apply color filter
    const selectedColors = this.colorControl.value || [];
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => selectedColors.includes(product.colorId));
    }

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredProducts = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.brandControl.setValue([]);
    this.categoryControl.setValue([]);
    this.colorControl.setValue([]);
    this.searchTerm = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.brandControl.value?.length || this.categoryControl.value?.length || this.colorControl.value?.length);
  }

  getSelectedBrands(): number[] {
    return this.brandControl.value || [];
  }

  getSelectedCategories(): number[] {
    return this.categoryControl.value || [];
  }

  getSelectedColors(): number[] {
    return this.colorControl.value || [];
  }

  removeBrandFilter(brandId: number) {
    const current = this.brandControl.value || [];
    this.brandControl.setValue(current.filter(id => id !== brandId));
  }

  removeCategoryFilter(categoryId: number) {
    const current = this.categoryControl.value || [];
    this.categoryControl.setValue(current.filter(id => id !== categoryId));
  }

  removeColorFilter(colorId: number) {
    const current = this.colorControl.value || [];
    this.colorControl.setValue(current.filter(id => id !== colorId));
  }

  getBrandName(brandId: number): string {
    return this.brands.find(b => b.id === brandId)?.name || '';
  }

  getCategoryName(categoryId: number): string {
    return this.categories.find(c => c.id === categoryId)?.name || '';
  }

  getColorName(colorId: number): string {
    return this.colors.find(c => c.id === colorId)?.name || '';
  }

  getColorHex(colorId: number): string {
    return this.colors.find(c => c.id === colorId)?.hex || '#ccc';
  }

  getProductImage(product: any): string {
    return product.imageUrls && product.imageUrls.length > 0 
      ? product.imageUrls[0] 
      : 'assets/images/no-image.png';
  }

  getActiveProducts(): number {
    return this.products.filter(p => p.isActive).length;
  }

  getInactiveProducts(): number {
    return this.products.filter(p => !p.isActive).length;
  }

  getTotalBrands(): number {
    return this.brands.length;
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.products = this.products.filter(p => p.id !== productId);
      this.applyFilters();
      console.log('Product deleted:', productId);
    }
  }

  refreshData() {
    this.loadMockData();
    this.filteredProducts = [...this.products];
    console.log('Data refreshed');
  }
}
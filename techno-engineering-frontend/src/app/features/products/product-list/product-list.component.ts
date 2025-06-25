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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
    MatCheckboxModule
  ],
  template: `
    <div class="product-list-container">
      <div class="header">
        <h1>Products</h1>
        <div class="header-actions">
          <button mat-raised-button color="primary" routerLink="/products/create">
            <mat-icon>add</mat-icon>
            Add Product
          </button>
          <button mat-icon-button [matMenuTriggerFor]="viewMenu">
            <mat-icon>view_module</mat-icon>
          </button>
          <mat-menu #viewMenu="matMenu">
            <button mat-menu-item (click)="viewMode = 'table'" [class.active]="viewMode === 'table'">
              <mat-icon>table_rows</mat-icon>
              Table View
            </button>
            <button mat-menu-item (click)="viewMode = 'grid'" [class.active]="viewMode === 'grid'">
              <mat-icon>grid_view</mat-icon>
              Grid View
            </button>
          </mat-menu>
        </div>
      </div>

      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search products</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Enter product name, model, or description">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Brand</mat-label>
              <mat-select [formControl]="brandControl" multiple>
                <mat-option *ngFor="let brand of brands" [value]="brand.id">
                  {{brand.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Category</mat-label>
              <mat-select [formControl]="categoryControl" multiple>
                <mat-option *ngFor="let category of categories" [value]="category.id">
                  {{category.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Color</mat-label>
              <mat-select [formControl]="colorControl" multiple>
                <mat-option *ngFor="let color of colors" [value]="color.id">
                  <span class="color-option">
                    <span class="color-dot" [style.background-color]="color.hex"></span>
                    {{color.name}}
                  </span>
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
              <mat-chip *ngFor="let brandId of filter.brandIds" (removed)="removeBrandFilter(brandId)">
                {{getBrandName(brandId)}}
                <mat-icon matChipRemove>cancel</mat-icon>
              </mat-chip>
              <mat-chip *ngFor="let categoryId of filter.categoryIds" (removed)="removeCategoryFilter(categoryId)">
                {{getCategoryName(categoryId)}}
                <mat-icon matChipRemove>cancel</mat-icon>
              </mat-chip>
              <mat-chip *ngFor="let colorId of filter.colorIds" (removed)="removeColorFilter(colorId)">
                {{getColorName(colorId)}}
                <mat-icon matChipRemove>cancel</mat-icon>
              </mat-chip>
            </mat-chip-set>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Table View -->
      <mat-card *ngIf="viewMode === 'table'">
        <div class="table-container">
          <table mat-table [dataSource]="products" class="products-table">
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let product">
                <div class="product-image">
                  <img [src]="getProductImage(product)" [alt]="product.name" 
                       onerror="this.src='assets/images/no-image.png'">
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Product</th>
              <td mat-cell *matCellDef="let product">
                <div class="product-info">
                  <div class="product-name">{{product.name}}</div>
                  <div class="product-model">{{product.modelNumber}}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="brand">
              <th mat-header-cell *matHeaderCellDef>Brand</th>
              <td mat-cell *matCellDef="let product">{{product.brand}}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let product">{{product.category}}</td>
            </ng-container>

            <ng-container matColumnDef="color">
              <th mat-header-cell *matHeaderCellDef>Color</th>
              <td mat-cell *matCellDef="let product">
                <span class="color-display" *ngIf="product.color">
                  <span class="color-dot" [style.background-color]="getColorHex(product.colorId)"></span>
                  {{product.color}}
                </span>
                <span *ngIf="!product.color">-</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="minQuantity">
              <th mat-header-cell *matHeaderCellDef>Min Qty</th>
              <td mat-cell *matCellDef="let product">{{product.minimumBuyingQuantity}}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let product">
                <span class="status-badge" [class.active]="product.isActive" [class.inactive]="!product.isActive">
                  {{product.isActive ? 'Active' : 'Inactive'}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let product">
                <button mat-icon-button [routerLink]="['/products/view', product.id]" color="primary">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button [routerLink]="['/products/edit', product.id]" color="accent">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteProduct(product.id)" color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </mat-card>

      <!-- Grid View -->
      <div class="products-grid" *ngIf="viewMode === 'grid'">
        <mat-card *ngFor="let product of products" class="product-card">
          <div class="product-image-container">
            <img mat-card-image [src]="getProductImage(product)" [alt]="product.name"
                 onerror="this.src='assets/images/no-image.png'">
            <div class="product-status" [class.active]="product.isActive" [class.inactive]="!product.isActive">
              {{product.isActive ? 'Active' : 'Inactive'}}
            </div>
          </div>
          
          <mat-card-header>
            <mat-card-title>{{product.name}}</mat-card-title>
            <mat-card-subtitle>{{product.modelNumber}}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
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
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button [routerLink]="['/products/view', product.id]" color="primary">
              <mat-icon>visibility</mat-icon>
              View
            </button>
            <button mat-button [routerLink]="['/products/edit', product.id]" color="accent">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <mat-paginator 
        [length]="totalProducts"
        [pageSize]="filter.take"
        [pageSizeOptions]="[12, 24, 48, 96]"
        (page)="onPageChange($event)"
        showFirstLastButtons>
      </mat-paginator>
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
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%);
      border: 1px solid rgba(38, 83, 166, 0.1);
      box-shadow: 0 4px 12px rgba(38, 83, 166, 0.08);
      backdrop-filter: blur(10px);
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #2653a6 0%, #ea3b26 100%);
        border-radius: 16px 16px 0 0;
      }
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
      background: linear-gradient(135deg, #2653a6 0%, #ea3b26 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .color-option {
      display: flex;
      align-items: center;
      gap: 8px;
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

    .table-container {
      overflow-x: auto;
    }

    .products-table {
      width: 100%;
    }

    .product-image {
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 4px;
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
      border: 1px solid rgba(75, 73, 76, 0.1);
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #2653a6 0%, #ea3b26 100%);
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }
      
      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 32px rgba(38, 83, 166, 0.15);
        border-color: rgba(38, 83, 166, 0.2);
      }
      
      &:hover::before {
        transform: scaleX(1);
      }
    }

    .product-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .product-image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(46, 125, 50, 0.95) 100%);
      color: white;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .product-status.inactive {
      background: linear-gradient(135deg, rgba(234, 59, 38, 0.95) 0%, rgba(198, 40, 40, 0.95) 100%);
      color: white;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
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

    .mat-mdc-row:hover {
      background-color: #f5f5f5;
    }

    @media (max-width: 768px) {
      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        min-width: auto;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  viewMode: 'table' | 'grid' = 'table';
  displayedColumns: string[] = ['image', 'name', 'brand', 'category', 'color', 'minQuantity', 'status', 'actions'];
  
  searchControl = new FormControl('');
  brandControl = new FormControl<number[]>([]);
  categoryControl = new FormControl<number[]>([]);
  colorControl = new FormControl<number[]>([]);

  filter: ProductFilter = {
    pageNumber: 1,
    take: 12,
    search: '',
    brandIds: [],
    categoryIds: [],
    colorIds: []
  };

  products: any[] = [];
  brands: any[] = [];
  categories: any[] = [];
  colors: any[] = [];
  totalProducts = 0;

  ngOnInit() {
    this.loadMockData();
    this.setupFilters();
    this.loadProducts();
  }

  private setupFilters() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => {
        this.filter.search = value || '';
        this.filter.pageNumber = 1;
        this.loadProducts();
      });

    this.brandControl.valueChanges.subscribe(value => {
      this.filter.brandIds = value || [];
      this.filter.pageNumber = 1;
      this.loadProducts();
    });

    this.categoryControl.valueChanges.subscribe(value => {
      this.filter.categoryIds = value || [];
      this.filter.pageNumber = 1;
      this.loadProducts();
    });

    this.colorControl.valueChanges.subscribe(value => {
      this.filter.colorIds = value || [];
      this.filter.pageNumber = 1;
      this.loadProducts();
    });
  }

  private loadMockData() {
    // Mock data
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

  private loadProducts() {
    // Filter products based on current filters
    let filteredProducts = [...this.products];

    if (this.filter.search) {
      const search = this.filter.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.modelNumber.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    if (this.filter.brandIds.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        this.filter.brandIds.includes(p.brandId)
      );
    }

    if (this.filter.categoryIds.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        this.filter.categoryIds.includes(p.categoryId)
      );
    }

    if (this.filter.colorIds.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        this.filter.colorIds.includes(p.colorId)
      );
    }

    this.totalProducts = filteredProducts.length;
    
    // Apply pagination
    const startIndex = (this.filter.pageNumber - 1) * this.filter.take;
    this.products = filteredProducts.slice(startIndex, startIndex + this.filter.take);
  }

  onPageChange(event: PageEvent) {
    this.filter.pageNumber = event.pageIndex + 1;
    this.filter.take = event.pageSize;
    this.loadProducts();
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.brandControl.setValue([]);
    this.categoryControl.setValue([]);
    this.colorControl.setValue([]);
  }

  hasActiveFilters(): boolean {
    return this.filter.brandIds.length > 0 || 
           this.filter.categoryIds.length > 0 || 
           this.filter.colorIds.length > 0;
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

  deleteProduct(productId: number) {
    // Implement delete functionality
    console.log('Delete product:', productId);
  }
}
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-category-list',
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
    MatSnackBarModule
  ],
  template: `
    <div class="category-list-container">
      <div class="header">
        <h1>Category Management</h1>
        <button mat-raised-button color="primary" routerLink="/categories/create">
          <mat-icon>add</mat-icon>
          Add Category
        </button>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Product Categories</mat-card-title>
          <mat-card-subtitle>Organize products into logical categories</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search categories</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Enter category name">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="categories" class="categories-table">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let category">{{category.id}}</td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Category Name</th>
                <td mat-cell *matCellDef="let category">
                  <div class="category-info">
                    <div class="category-name">
                      <mat-icon class="category-icon">{{getCategoryIcon(category.name)}}</mat-icon>
                      {{category.name}}
                    </div>
                    <div class="product-count">{{getProductCount(category.id)}} products</div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let category">
                  <span class="description-text">{{category.description || 'No description'}}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let category">
                  <span class="status-badge" [class.active]="category.isActive" [class.inactive]="!category.isActive">
                    {{category.isActive ? 'Active' : 'Inactive'}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Created</th>
                <td mat-cell *matCellDef="let category">{{category.createdAt | date:'short'}}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let category">
                  <button mat-icon-button [routerLink]="['/categories/edit', category.id]" color="primary">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteCategory(category.id)" color="warn" 
                          [disabled]="getProductCount(category.id) > 0">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator 
            [length]="totalCategories"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>

      <!-- Category Statistics -->
      <div class="stats-section">
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">category</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{totalCategories}}</div>
                  <div class="stat-label">Total Categories</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon active">check_circle</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{getActiveCategoriesCount()}}</div>
                  <div class="stat-label">Active Categories</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon inactive">pause_circle</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{getInactiveCategoriesCount()}}</div>
                  <div class="stat-label">Inactive Categories</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">inventory</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{getTotalProductsCount()}}</div>
                  <div class="stat-label">Total Products</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Popular Categories -->
      <mat-card class="popular-categories">
        <mat-card-header>
          <mat-card-title>Most Popular Categories</mat-card-title>
          <mat-card-subtitle>Categories with the most products</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="popular-list">
            <div *ngFor="let category of getPopularCategories(); let i = index" class="popular-item">
              <div class="rank-badge">{{i + 1}}</div>
              <mat-icon class="category-icon">{{getCategoryIcon(category.name)}}</mat-icon>
              <div class="category-details">
                <div class="category-name">{{category.name}}</div>
                <div class="category-stats">{{category.productCount}} products</div>
              </div>
              <div class="category-progress">
                <div class="progress-bar" 
                     [style.width.%]="(category.productCount / getMaxProductCount()) * 100">
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .category-list-container {
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

    .filters {
      margin-bottom: 24px;
    }

    .search-field {
      min-width: 300px;
    }

    .table-container {
      overflow-x: auto;
      margin-bottom: 16px;
    }

    .categories-table {
      width: 100%;
    }

    .category-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .category-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .category-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #1976d2;
    }

    .product-count {
      font-size: 0.85rem;
      color: #666;
    }

    .description-text {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.inactive {
      background-color: #ffebee;
      color: #c62828;
    }

    .stats-section {
      margin: 32px 0;
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

    .stat-icon.active {
      color: #4caf50;
    }

    .stat-icon.inactive {
      color: #f44336;
    }

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

    .popular-categories {
      margin-top: 32px;
    }

    .popular-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .popular-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background-color: #f9f9f9;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }

    .popular-item:hover {
      background-color: #f0f0f0;
    }

    .rank-badge {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #1976d2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .category-details {
      flex: 1;
    }

    .category-name {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .category-stats {
      font-size: 0.85rem;
      color: #666;
    }

    .category-progress {
      width: 100px;
      height: 6px;
      background-color: #e0e0e0;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background-color: #1976d2;
      transition: width 0.3s ease;
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

      .search-field {
        min-width: auto;
        width: 100%;
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

      .popular-item {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .category-progress {
        width: 100%;
      }
    }
  `]
})
export class CategoryListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'status', 'createdAt', 'actions'];
  searchControl = new FormControl('');
  
  allCategories: any[] = [];
  filteredCategories: any[] = [];
  totalCategories = 0;
  pageSize = 10;
  currentPage = 0;

  private categoryIcons: { [key: string]: string } = {
    'Electronics': 'electrical_services',
    'Machinery': 'precision_manufacturing',
    'Tools': 'build',
    'Components': 'memory',
    'Materials': 'science',
    'Safety': 'security',
    'Industrial': 'factory'
  };

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadMockData();
    this.setupSearch();
    this.applyFilters();
  }

  private setupSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 0;
        this.applyFilters();
      });
  }

  private loadMockData() {
    this.allCategories = [
      {
        id: 1,
        name: 'Electronics',
        description: 'Electronic components and devices',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        productCount: 45
      },
      {
        id: 2,
        name: 'Machinery',
        description: 'Industrial machinery and equipment',
        isActive: true,
        createdAt: '2024-01-02T00:00:00Z',
        productCount: 32
      },
      {
        id: 3,
        name: 'Tools',
        description: 'Hand tools and power tools',
        isActive: true,
        createdAt: '2024-01-03T00:00:00Z',
        productCount: 28
      },
      {
        id: 4,
        name: 'Components',
        description: 'Mechanical and electrical components',
        isActive: false,
        createdAt: '2024-01-04T00:00:00Z',
        productCount: 15
      },
      {
        id: 5,
        name: 'Materials',
        description: 'Raw materials and supplies',
        isActive: true,
        createdAt: '2024-01-05T00:00:00Z',
        productCount: 18
      },
      {
        id: 6,
        name: 'Safety',
        description: 'Safety equipment and protective gear',
        isActive: true,
        createdAt: '2024-01-06T00:00:00Z',
        productCount: 22
      }
    ];

    this.totalCategories = this.allCategories.length;
  }

  private applyFilters() {
    let filtered = [...this.allCategories];

    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(category => 
        category.name.toLowerCase().includes(searchTerm) ||
        category.description?.toLowerCase().includes(searchTerm)
      );
    }

    this.totalCategories = filtered.length;
    
    // Apply pagination
    const startIndex = this.currentPage * this.pageSize;
    this.filteredCategories = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  getCategoryIcon(categoryName: string): string {
    return this.categoryIcons[categoryName] || 'category';
  }

  getProductCount(categoryId: number): number {
    const category = this.allCategories.find(c => c.id === categoryId);
    return category?.productCount || 0;
  }

  getActiveCategoriesCount(): number {
    return this.allCategories.filter(category => category.isActive).length;
  }

  getInactiveCategoriesCount(): number {
    return this.allCategories.filter(category => !category.isActive).length;
  }

  getTotalProductsCount(): number {
    return this.allCategories.reduce((total, category) => total + (category.productCount || 0), 0);
  }

  getPopularCategories(): any[] {
    return [...this.allCategories]
      .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
      .slice(0, 5);
  }

  getMaxProductCount(): number {
    return Math.max(...this.allCategories.map(c => c.productCount || 0));
  }

  get categories() {
    return this.filteredCategories;
  }

  set categories(value: any[]) {
    this.filteredCategories = value;
  }

  deleteCategory(categoryId: number) {
    const category = this.allCategories.find(c => c.id === categoryId);
    if (category && this.getProductCount(categoryId) > 0) {
      this.snackBar.open('Cannot delete category with associated products', 'Close', { duration: 5000 });
      return;
    }

    if (confirm('Are you sure you want to delete this category?')) {
      // Simulate API call
      this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
      // Remove from local array for demo
      this.allCategories = this.allCategories.filter(c => c.id !== categoryId);
      this.applyFilters();
    }
  }
}
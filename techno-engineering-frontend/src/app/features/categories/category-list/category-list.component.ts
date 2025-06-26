import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Import shared components
import { 
  SearchInputComponent,
  ButtonComponent,
  CardComponent
} from '../../../shared/components';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SearchInputComponent,
    ButtonComponent,
    CardComponent
  ],
  template: `
    <div class="category-list-container">
      <div class="header">
        <h1>Category Management</h1>
        <app-button 
          variant="primary"
          routerLink="/categories/create"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add Category
        </app-button>
      </div>

      <app-card title="Product Categories" subtitle="Organize products into logical categories">
        <div class="filters">
          <app-search-input
            placeholder="Search categories by name or description"
            (search)="onSearch($event)"
            width="400px"
          ></app-search-input>
        </div>

        <div class="table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let category of paginatedCategories; trackBy: trackByCategory" class="table-row">
                <td>{{category.id}}</td>
                <td>
                  <div class="category-info">
                    <div class="category-name">
                      <svg class="category-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path [attr.d]="getCategoryIconPath(category.name)"/>
                      </svg>
                      {{category.name}}
                    </div>
                    <div class="product-count">{{getProductCount(category.id)}} products</div>
                  </div>
                </td>
                <td>
                  <span class="description-text">{{category.description || 'No description'}}</span>
                </td>
                <td>
                  <span class="status-badge" [class.active]="category.isActive" [class.inactive]="!category.isActive">
                    {{category.isActive ? 'Active' : 'Inactive'}}
                  </span>
                </td>
                <td>{{category.createdAt | date:'short'}}</td>
                <td>
                  <div class="action-buttons">
                    <app-button 
                      variant="outline" 
                      size="small"
                      [routerLink]="['/categories/edit', category.id]"
                      title="Edit Category"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </app-button>
                    <app-button 
                      variant="outline" 
                      size="small"
                      (click)="deleteCategory(category.id)"
                      [disabled]="getProductCount(category.id) > 0"
                      title="Delete Category"
                      class="delete-button"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </app-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="filteredCategories.length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <p>No categories found</p>
            <p class="hint">Try adjusting your search criteria</p>
          </div>

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
              Page {{currentPage}} of {{totalPages}} ({{filteredCategories.length}} categories)
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
        </div>
      </app-card>

      <!-- Category Statistics -->
      <div class="stats-section">
        <div class="stats-grid">
          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{allCategories.length}}</div>
                <div class="stat-label">Total Categories</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon active" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getActiveCategoriesCount()}}</div>
                <div class="stat-label">Active Categories</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon inactive" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getInactiveCategoriesCount()}}</div>
                <div class="stat-label">Inactive Categories</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zM15 14H9v-2h6v2zm0-4H9V8h6v2z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getTotalProductsCount()}}</div>
                <div class="stat-label">Total Products</div>
              </div>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Popular Categories -->
      <app-card title="Most Popular Categories" subtitle="Categories with the most products" class="popular-categories">
        <div class="popular-list">
          <div *ngFor="let category of getPopularCategories(); let i = index" class="popular-item">
            <div class="rank-badge">{{i + 1}}</div>
            <svg class="category-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path [attr.d]="getCategoryIconPath(category.name)"/>
            </svg>
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
      </app-card>
    </div>
  `,
  styles: [`
    .category-list-container {
      padding: 24px;
      max-width: 1400px;
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

    .filters {
      margin-bottom: 24px;
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .table-wrapper {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .custom-table {
      width: 100%;
      border-collapse: collapse;
    }

    .custom-table thead {
      background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    }

    .custom-table th {
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
      font-size: 14px;
    }

    .custom-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #f3f4f6;
      color: #6b7280;
      font-size: 14px;
    }

    .table-row {
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: #f9fafb;
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
      color: #1f2937;
      font-weight: 600;
    }

    .category-icon {
      color: #2653a6;
    }

    .product-count {
      font-size: 12px;
      color: #6b7280;
      font-style: italic;
    }

    .description-text {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.active {
      background-color: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .delete-button {
      color: #ea3b26 !important;
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

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .page-info {
      font-size: 14px;
      color: #6b7280;
    }

    .stats-section {
      margin: 32px 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
    }

    .stat-icon {
      color: #2653a6;
      flex-shrink: 0;
    }

    .stat-icon.active {
      color: #10b981;
    }

    .stat-icon.inactive {
      color: #ea3b26;
    }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .stat-label {
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
    }

    .popular-categories {
      margin-top: 32px;
    }

    .popular-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
    }

    .popular-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background-color: #f9fafb;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .popular-item:hover {
      background-color: #f3f4f6;
      transform: translateY(-2px);
    }

    .rank-badge {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2653a6 0%, #ea3b26 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }

    .category-details {
      flex: 1;
    }

    .category-details .category-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .category-stats {
      font-size: 12px;
      color: #6b7280;
    }

    .category-progress {
      width: 100px;
      height: 8px;
      background-color: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #2653a6 0%, #ea3b26 100%);
      transition: width 0.3s ease;
    }

    @media (max-width: 768px) {
      .category-list-container {
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

      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .custom-table {
        font-size: 12px;
      }

      .custom-table th,
      .custom-table td {
        padding: 8px 12px;
      }

      .action-buttons {
        flex-direction: column;
        gap: 2px;
      }

      .pagination {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .stat-content {
        flex-direction: column;
        text-align: center;
        gap: 12px;
        padding: 16px;
      }

      .stat-number {
        font-size: 20px;
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
  allCategories: any[] = [];
  filteredCategories: any[] = [];
  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  
  get totalPages(): number {
    return Math.ceil(this.filteredCategories.length / this.pageSize);
  }
  
  get paginatedCategories(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredCategories.slice(startIndex, startIndex + this.pageSize);
  }
  
  trackByCategory(index: number, category: any): number {
    return category.id;
  }


  constructor() {}

  ngOnInit() {
    this.loadMockData();
    this.filteredCategories = [...this.allCategories];
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

  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    this.currentPage = 1; // Reset to first page when searching
    
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.allCategories];
      return;
    }

    this.filteredCategories = this.allCategories.filter(category => 
      category.name.toLowerCase().includes(this.searchTerm) ||
      (category.description && category.description.toLowerCase().includes(this.searchTerm))
    );
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getCategoryIconPath(categoryName: string): string {
    const iconPaths: { [key: string]: string } = {
      'Electronics': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      'Machinery': 'M9.5 3A6.5 6.5 0 003 9.5c0 1.61.59 3.09 1.56 4.23l.71.71-1.27 1.27-.71-.71A8.5 8.5 0 109.5 1.5V3z',
      'Tools': 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
      'Components': 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z',
      'Materials': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      'Safety': 'M18 8h-1c0-2.76-2.24-5-5-5S7 5.24 7 8H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9c.4-1.25 1.6-2.1 3.1-2.1s2.7.85 3.1 2.1z',
      'Industrial': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
    };
    return iconPaths[categoryName] || 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
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


  deleteCategory(categoryId: number) {
    const category = this.allCategories.find(c => c.id === categoryId);
    if (category && this.getProductCount(categoryId) > 0) {
      alert('Cannot delete category with associated products');
      return;
    }

    if (confirm('Are you sure you want to delete this category?')) {
      // Remove from local array for demo
      this.allCategories = this.allCategories.filter(c => c.id !== categoryId);
      this.filteredCategories = this.filteredCategories.filter(c => c.id !== categoryId);
      
      // Adjust current page if necessary
      if (this.paginatedCategories.length === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
      
      alert('Category deleted successfully');
    }
  }
}
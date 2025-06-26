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
  selector: 'app-brand-list',
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
    <div class="brand-list-container">
      <div class="header">
        <h1>Brand Management</h1>
        <app-button 
          variant="primary"
          routerLink="/brands/create"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add Brand
        </app-button>
      </div>

      <app-card title="Brand Management" subtitle="Manage product brands and manufacturers">
        <div class="filters">
          <app-search-input
            placeholder="Search brands by name"
            (search)="onSearch($event)"
            width="400px"
          ></app-search-input>
        </div>

        <div class="table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Brand Name</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let brand of paginatedBrands; trackBy: trackByBrand" class="table-row">
                <td>{{brand.id}}</td>
                <td>
                  <div class="brand-info">
                    <div class="brand-name">{{brand.name}}</div>
                    <div class="product-count">{{getProductCount(brand.id)}} products</div>
                  </div>
                </td>
                <td>
                  <span class="status-badge" [class.active]="brand.isActive" [class.inactive]="!brand.isActive">
                    {{brand.isActive ? 'Active' : 'Inactive'}}
                  </span>
                </td>
                <td>{{brand.createdAt | date:'short'}}</td>
                <td>
                  <div class="action-buttons">
                    <app-button 
                      variant="outline" 
                      size="small"
                      [routerLink]="['/brands/edit', brand.id]"
                      title="Edit Brand"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </app-button>
                    <app-button 
                      variant="outline" 
                      size="small"
                      (click)="deleteBrand(brand.id)"
                      [disabled]="getProductCount(brand.id) > 0"
                      title="Delete Brand"
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

          <div *ngIf="filteredBrands.length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <p>No brands found</p>
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
              Page {{currentPage}} of {{totalPages}} ({{filteredBrands.length}} brands)
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

      <!-- Brand Statistics -->
      <div class="stats-section">
        <div class="stats-grid">
          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{allBrands.length}}</div>
                <div class="stat-label">Total Brands</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon active" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getActiveBrandsCount()}}</div>
                <div class="stat-label">Active Brands</div>
              </div>
            </div>
          </app-card>

          <app-card class="stat-card">
            <div class="stat-content">
              <svg class="stat-icon inactive" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
              </svg>
              <div class="stat-info">
                <div class="stat-number">{{getInactiveBrandsCount()}}</div>
                <div class="stat-label">Inactive Brands</div>
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
    </div>
  `,
  styles: [`
    .brand-list-container {
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

    .brand-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .brand-name {
      color: #1f2937;
      font-weight: 600;
    }

    .product-count {
      font-size: 12px;
      color: #6b7280;
      font-style: italic;
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
      margin-top: 32px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
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

    @media (max-width: 768px) {
      .brand-list-container {
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
    }
  `]
})
export class BrandListComponent implements OnInit {
  allBrands: any[] = [];
  filteredBrands: any[] = [];
  searchTerm: string = '';
  totalBrands: number = 0;
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  get totalPages(): number {
    return Math.ceil(this.filteredBrands.length / this.pageSize);
  }

  get paginatedBrands(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredBrands.slice(startIndex, startIndex + this.pageSize);
  }

  constructor() {}

  ngOnInit() {
    this.loadMockData();
    this.filteredBrands = [...this.allBrands];
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    this.currentPage = 1; // Reset to first page when searching
    
    if (!this.searchTerm.trim()) {
      this.filteredBrands = [...this.allBrands];
      return;
    }

    this.filteredBrands = this.allBrands.filter(brand => 
      brand.name.toLowerCase().includes(this.searchTerm)
    );
  }

  private loadMockData() {
    this.allBrands = [
      {
        id: 1,
        name: 'Brand A',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        productCount: 15
      },
      {
        id: 2,
        name: 'Brand B',
        isActive: true,
        createdAt: '2024-01-05T00:00:00Z',
        productCount: 8
      },
      {
        id: 3,
        name: 'Brand C',
        isActive: false,
        createdAt: '2024-01-10T00:00:00Z',
        productCount: 3
      },
      {
        id: 4,
        name: 'Premium Tech',
        isActive: true,
        createdAt: '2024-01-12T00:00:00Z',
        productCount: 22
      },
      {
        id: 5,
        name: 'Industrial Solutions',
        isActive: true,
        createdAt: '2024-01-15T00:00:00Z',
        productCount: 12
      }
    ];

    this.totalBrands = this.allBrands.length;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  trackByBrand(index: number, brand: any): number {
    return brand.id;
  }

  getProductCount(brandId: number): number {
    const brand = this.allBrands.find(b => b.id === brandId);
    return brand?.productCount || 0;
  }

  getActiveBrandsCount(): number {
    return this.allBrands.filter(brand => brand.isActive).length;
  }

  getInactiveBrandsCount(): number {
    return this.allBrands.filter(brand => !brand.isActive).length;
  }

  getTotalProductsCount(): number {
    return this.allBrands.reduce((total, brand) => total + (brand.productCount || 0), 0);
  }

  deleteBrand(brandId: number) {
    const brand = this.allBrands.find(b => b.id === brandId);
    if (brand && this.getProductCount(brandId) > 0) {
      alert('Cannot delete brand with associated products');
      return;
    }

    if (confirm('Are you sure you want to delete this brand?')) {
      // Remove from local array for demo
      this.allBrands = this.allBrands.filter(b => b.id !== brandId);
      this.filteredBrands = this.filteredBrands.filter(b => b.id !== brandId);
      
      // Adjust current page if necessary
      if (this.paginatedBrands.length === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
      
      alert('Brand deleted successfully');
    }
  }
}
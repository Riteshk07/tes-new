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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-brand-list',
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
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="brand-list-container">
      <div class="header">
        <h1>Brand Management</h1>
        <button mat-raised-button color="primary" routerLink="/brands/create">
          <mat-icon>add</mat-icon>
          Add Brand
        </button>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Brands</mat-card-title>
          <mat-card-subtitle>Manage product brands and manufacturers</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search brands</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Enter brand name">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="brands" class="brands-table">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let brand">{{brand.id}}</td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Brand Name</th>
                <td mat-cell *matCellDef="let brand">
                  <div class="brand-info">
                    <div class="brand-name">{{brand.name}}</div>
                    <div class="product-count">{{getProductCount(brand.id)}} products</div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let brand">
                  <span class="status-badge" [class.active]="brand.isActive" [class.inactive]="!brand.isActive">
                    {{brand.isActive ? 'Active' : 'Inactive'}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Created</th>
                <td mat-cell *matCellDef="let brand">{{brand.createdAt | date:'short'}}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let brand">
                  <button mat-icon-button [routerLink]="['/brands/edit', brand.id]" color="primary">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteBrand(brand.id)" color="warn" 
                          [disabled]="getProductCount(brand.id) > 0">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator 
            [length]="totalBrands"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>

      <!-- Brand Statistics -->
      <div class="stats-section">
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">business</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{totalBrands}}</div>
                  <div class="stat-label">Total Brands</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon active">check_circle</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{getActiveBrandsCount()}}</div>
                  <div class="stat-label">Active Brands</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon inactive">pause_circle</mat-icon>
                <div class="stat-info">
                  <div class="stat-number">{{getInactiveBrandsCount()}}</div>
                  <div class="stat-label">Inactive Brands</div>
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
    </div>
  `,
  styles: [`
    .brand-list-container {
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

    .brands-table {
      width: 100%;
    }

    .brand-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .brand-name {
      font-weight: 500;
    }

    .product-count {
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

    .stats-section {
      margin-top: 32px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .stat-card {
      transition: all 0.3s ease;
      border: 1px solid rgba(75, 73, 76, 0.1);
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #2653a6 0%, #ea3b26 100%);
    }

    .stat-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(38, 83, 166, 0.15);
      border-color: rgba(38, 83, 166, 0.2);
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
      color: #2653a6;
    }

    .stat-icon.active {
      color: #4caf50;
    }

    .stat-icon.inactive {
      color: #ea3b26;
    }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      font-size: 2.2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #2653a6 0%, #ea3b26 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      color: #4b494c;
      font-size: 0.95rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
    }
  `]
})
export class BrandListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'status', 'createdAt', 'actions'];
  searchControl = new FormControl('');
  
  allBrands: any[] = [];
  filteredBrands: any[] = [];
  totalBrands = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

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

  private applyFilters() {
    let filtered = [...this.allBrands];

    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(brand => 
        brand.name.toLowerCase().includes(searchTerm)
      );
    }

    this.totalBrands = filtered.length;
    
    // Apply pagination
    const startIndex = this.currentPage * this.pageSize;
    this.filteredBrands = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
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

  get brands() {
    return this.filteredBrands;
  }

  set brands(value: any[]) {
    this.filteredBrands = value;
  }

  deleteBrand(brandId: number) {
    const brand = this.allBrands.find(b => b.id === brandId);
    if (brand && this.getProductCount(brandId) > 0) {
      this.snackBar.open('Cannot delete brand with associated products', 'Close', { duration: 5000 });
      return;
    }

    if (confirm('Are you sure you want to delete this brand?')) {
      // Simulate API call
      this.snackBar.open('Brand deleted successfully', 'Close', { duration: 3000 });
      // Remove from local array for demo
      this.allBrands = this.allBrands.filter(b => b.id !== brandId);
      this.applyFilters();
    }
  }
}
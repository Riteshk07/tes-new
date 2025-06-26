import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatBadgeModule,
    MatExpansionModule
  ],
  template: `
    <div class="product-detail-container">
      <div class="header">
        <h1>Product Details</h1>
        <div class="header-actions">
          <button mat-button routerLink="/products">
            <mat-icon>arrow_back</mat-icon>
            Back to Products
          </button>
          <button mat-raised-button color="primary" [routerLink]="['/products/edit', productId]">
            <mat-icon>edit</mat-icon>
            Edit Product
          </button>
        </div>
      </div>

      <div class="product-content" *ngIf="product">
        <div class="product-overview">
          <div class="product-images">
            <div class="main-image">
              <img [src]="selectedImage" [alt]="product.name" 
                   onerror="this.src='assets/images/no-image.png'">
              <div class="image-status" [class.active]="product.isActive" [class.inactive]="!product.isActive">
                {{product.isActive ? 'Active' : 'Inactive'}}
              </div>
            </div>
            
            <div class="image-thumbnails" *ngIf="product.imageUrls && product.imageUrls.length > 1">
              <div *ngFor="let imageUrl of product.imageUrls; let i = index" 
                   class="thumbnail" 
                   [class.selected]="selectedImage === imageUrl"
                   (click)="selectImage(imageUrl)">
                <img [src]="imageUrl" [alt]="'Product image ' + (i + 1)">
              </div>
            </div>
          </div>

          <div class="product-info">
            <mat-card>
              <mat-card-header>
                <mat-card-title>{{product.name}}</mat-card-title>
                <mat-card-subtitle>Model: {{product.modelNumber}}</mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <div class="info-grid">
                  <div class="info-item">
                    <mat-icon>business</mat-icon>
                    <div>
                      <strong>Brand</strong>
                      <span>{{product.brand}}</span>
                    </div>
                  </div>

                  <div class="info-item">
                    <mat-icon>category</mat-icon>
                    <div>
                      <strong>Category</strong>
                      <span>{{product.category}}</span>
                    </div>
                  </div>

                  <div class="info-item" *ngIf="product.color">
                    <mat-icon>palette</mat-icon>
                    <div>
                      <strong>Color</strong>
                      <span class="color-display">
                        <span class="color-dot" [style.background-color]="getColorHex()"></span>
                        {{product.color}}
                      </span>
                    </div>
                  </div>

                  <div class="info-item">
                    <mat-icon>shopping_cart</mat-icon>
                    <div>
                      <strong>Minimum Order</strong>
                      <span>{{product.minimumBuyingQuantity}} units</span>
                    </div>
                  </div>
                </div>

                <div class="materials-section" *ngIf="materials && materials.length > 0">
                  <h4>Materials</h4>
                  <mat-chip-set>
                    <mat-chip *ngFor="let material of materials">
                      {{material.name}}
                    </mat-chip>
                  </mat-chip-set>
                </div>

                <div class="description-section" *ngIf="product.description">
                  <h4>Description</h4>
                  <p>{{product.description}}</p>
                </div>
              </mat-card-content>
              
              <mat-card-actions>
                <button mat-raised-button color="primary">
                  <mat-icon>add_shopping_cart</mat-icon>
                  Add to Enquiry
                </button>
                <button mat-button color="accent">
                  <mat-icon>share</mat-icon>
                  Share Product
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>

        <mat-tab-group class="details-tabs">
          <mat-tab label="Specifications">
            <div class="tab-content">
              <div class="specifications">
                <mat-expansion-panel class="spec-panel">
                  <mat-expansion-panel-header>
                    <mat-panel-title>Technical Specifications</mat-panel-title>
                  </mat-expansion-panel-header>
                  <div class="spec-grid">
                    <div class="spec-item">
                      <strong>Model Number:</strong>
                      <span>{{product.modelNumber}}</span>
                    </div>
                    <div class="spec-item">
                      <strong>Brand:</strong>
                      <span>{{product.brand}}</span>
                    </div>
                    <div class="spec-item">
                      <strong>Category:</strong>
                      <span>{{product.category}}</span>
                    </div>
                    <div class="spec-item" *ngIf="product.color">
                      <strong>Color:</strong>
                      <span>{{product.color}}</span>
                    </div>
                    <div class="spec-item">
                      <strong>Minimum Order Quantity:</strong>
                      <span>{{product.minimumBuyingQuantity}} units</span>
                    </div>
                  </div>
                </mat-expansion-panel>

                <mat-expansion-panel class="spec-panel" *ngIf="materials && materials.length > 0">
                  <mat-expansion-panel-header>
                    <mat-panel-title>Materials & Composition</mat-panel-title>
                  </mat-expansion-panel-header>
                  <div class="materials-list">
                    <div *ngFor="let material of materials" class="material-item">
                      <mat-icon>build</mat-icon>
                      <span>{{material.name}}</span>
                    </div>
                  </div>
                </mat-expansion-panel>

                <mat-expansion-panel class="spec-panel">
                  <mat-expansion-panel-header>
                    <mat-panel-title>Additional Information</mat-panel-title>
                  </mat-expansion-panel-header>
                  <div class="additional-info">
                    <p><strong>Product ID:</strong> {{product.id}}</p>
                    <p><strong>Status:</strong> 
                      <span class="status-badge" [class.active]="product.isActive" [class.inactive]="!product.isActive">
                        {{product.isActive ? 'Active' : 'Inactive'}}
                      </span>
                    </p>
                    <p><strong>Created:</strong> {{product.createdAt | date:'medium'}}</p>
                    <p *ngIf="product.updatedAt"><strong>Last Updated:</strong> {{product.updatedAt | date:'medium'}}</p>
                  </div>
                </mat-expansion-panel>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Related Enquiries" [disabled]="relatedEnquiries.length === 0">
            <div class="tab-content">
              <div class="enquiries-section" *ngIf="relatedEnquiries.length > 0; else noEnquiries">
                <mat-card *ngFor="let enquiry of relatedEnquiries" class="enquiry-card">
                  <mat-card-header>
                    <mat-card-title>Enquiry #{{enquiry.id}}</mat-card-title>
                    <mat-card-subtitle>{{enquiry.customerName}} - {{enquiry.date | date:'short'}}</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="enquiry-details">
                      <p><strong>Quantity:</strong> {{enquiry.quantity}} units</p>
                      <p><strong>Status:</strong> 
                        <span class="status-badge status-{{enquiry.status.toLowerCase()}}">{{enquiry.status}}</span>
                      </p>
                      <p *ngIf="enquiry.notes"><strong>Notes:</strong> {{enquiry.notes}}</p>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button color="primary" [routerLink]="['/enquiries', enquiry.id]">
                      View Enquiry
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
              <ng-template #noEnquiries>
                <div class="no-data">
                  <mat-icon>help_outline</mat-icon>
                  <p>No enquiries found for this product</p>
                </div>
              </ng-template>
            </div>
          </mat-tab>

          <mat-tab label="Similar Products">
            <div class="tab-content">
              <div class="similar-products" *ngIf="similarProducts.length > 0; else noSimilar">
                <div class="products-grid">
                  <mat-card *ngFor="let similar of similarProducts" class="similar-product-card">
                    <div class="product-image">
                      <img [src]="getSimilarProductImage(similar)" [alt]="similar.name">
                    </div>
                    <mat-card-header>
                      <mat-card-title>{{similar.name}}</mat-card-title>
                      <mat-card-subtitle>{{similar.modelNumber}}</mat-card-subtitle>
                    </mat-card-header>
                    <mat-card-content>
                      <p><strong>Brand:</strong> {{similar.brand}}</p>
                      <p><strong>Category:</strong> {{similar.category}}</p>
                    </mat-card-content>
                    <mat-card-actions>
                      <button mat-button [routerLink]="['/products/view', similar.id]" color="primary">
                        View Details
                      </button>
                    </mat-card-actions>
                  </mat-card>
                </div>
              </div>
              <ng-template #noSimilar>
                <div class="no-data">
                  <mat-icon>inventory</mat-icon>
                  <p>No similar products found</p>
                </div>
              </ng-template>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-container {
      padding: 24px;
      max-width: 1400px;
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

    .header-actions {
      display: flex;
      gap: 16px;
    }

    .product-overview {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 32px;
    }

    .product-images {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .main-image {
      position: relative;
      width: 100%;
      height: 400px;
      border-radius: 8px;
      overflow: hidden;
      background: #f5f5f5;
    }

    .main-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-status {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 8px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .image-status.active {
      background-color: rgba(46, 125, 50, 0.9);
      color: white;
    }

    .image-status.inactive {
      background-color: rgba(198, 40, 40, 0.9);
      color: white;
    }

    .image-thumbnails {
      display: flex;
      gap: 8px;
      overflow-x: auto;
    }

    .thumbnail {
      width: 80px;
      height: 80px;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.2s ease;
    }

    .thumbnail:hover,
    .thumbnail.selected {
      border-color: #1976d2;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .info-item mat-icon {
      color: #666;
      margin-top: 4px;
    }

    .info-item div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item strong {
      color: #666;
      font-size: 0.9rem;
    }

    .color-display {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .color-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid #ccc;
    }

    .materials-section,
    .description-section {
      margin-top: 24px;
    }

    .materials-section h4,
    .description-section h4 {
      margin-bottom: 12px;
      color: #333;
    }

    .details-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tab-content {
      padding: 24px;
      min-height: 400px;
    }

    .spec-panel {
      margin-bottom: 16px;
    }

    .spec-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .spec-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .materials-list {
      margin-top: 16px;
    }

    .material-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .material-item mat-icon {
      color: #666;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .additional-info p {
      margin-bottom: 12px;
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

    .status-badge.status-pending {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .status-badge.status-processed {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .enquiry-card {
      margin-bottom: 16px;
    }

    .enquiry-details p {
      margin-bottom: 8px;
    }

    .similar-product-card {
      max-width: 280px;
    }

    .similar-product-card .product-image {
      height: 150px;
      overflow: hidden;
    }

    .similar-product-card .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #999;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .no-data p {
      margin: 0;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .product-overview {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .header-actions {
        width: 100%;
        justify-content: flex-end;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  productId: number | null = null;
  product: any = null;
  materials: any[] = [];
  selectedImage: string = '';
  relatedEnquiries: any[] = [];
  similarProducts: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loadProductDetails();
    });
  }

  private loadProductDetails() {
    // Mock product data
    this.product = {
      id: this.productId,
      name: 'Industrial Motor',
      modelNumber: 'IM-001',
      description: 'High-performance industrial motor designed for heavy-duty applications. Features advanced engineering and reliable performance in demanding environments.',
      brand: 'Brand A',
      brandId: 1,
      category: 'Machinery',
      categoryId: 2,
      color: 'Red',
      colorId: 1,
      minimumBuyingQuantity: 5,
      isActive: true,
      imageUrls: [
        'assets/images/product-1.jpg',
        'assets/images/product-2.jpg',
        'assets/images/product-3.jpg'
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    };

    this.selectedImage = this.product.imageUrls?.[0] || 'assets/images/no-image.png';

    // Mock materials
    this.materials = [
      { id: 1, name: 'Steel' },
      { id: 2, name: 'Aluminum' },
      { id: 4, name: 'Copper' }
    ];

    // Mock related enquiries
    this.relatedEnquiries = [
      {
        id: 1001,
        customerName: 'ABC Corporation',
        date: '2024-01-20T00:00:00Z',
        quantity: 10,
        status: 'Pending',
        notes: 'Urgent requirement for factory expansion'
      },
      {
        id: 1002,
        customerName: 'XYZ Industries',
        date: '2024-01-18T00:00:00Z',
        quantity: 25,
        status: 'Processed',
        notes: 'Regular monthly order'
      }
    ];

    // Mock similar products
    this.similarProducts = [
      {
        id: 2,
        name: 'Electronic Controller',
        modelNumber: 'EC-002',
        brand: 'Brand B',
        category: 'Electronics',
        imageUrls: ['assets/images/product-4.jpg']
      },
      {
        id: 4,
        name: 'Advanced Motor',
        modelNumber: 'AM-004',
        brand: 'Brand A',
        category: 'Machinery',
        imageUrls: ['assets/images/product-5.jpg']
      }
    ];
  }

  selectImage(imageUrl: string) {
    this.selectedImage = imageUrl;
  }

  getColorHex(): string {
    // Mock color mapping
    const colorMap: { [key: string]: string } = {
      'Red': '#f44336',
      'Blue': '#2196f3',
      'Green': '#4caf50',
      'Black': '#000000'
    };
    return colorMap[this.product?.color] || '#ccc';
  }

  getSimilarProductImage(product: any): string {
    return product.imageUrls?.[0] || 'assets/images/no-image.png';
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import shared components
import { 
  SearchInputComponent,
  ButtonComponent,
  CardComponent
} from '../../../shared/components';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  organizationName: string | null;
  email: string;
  contactNumber: string;
  gstin: string | null;
  isActive: boolean;
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SearchInputComponent,
    ButtonComponent,
    CardComponent
  ],
  template: `
    <div class="customer-list-container">
      <div class="header">
        <h1>Customers</h1>
        <app-button 
          variant="primary"
          routerLink="/customers/create"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add Customer
        </app-button>
      </div>

      <app-card title="Customer Management">
        <div class="filters">
          <app-search-input
            placeholder="Search by name, organization, or email"
            (search)="onSearch($event)"
            width="400px"
          ></app-search-input>
        </div>

        <div class="table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Organization</th>
                <th>Email</th>
                <th>Contact</th>
                <th>GSTIN</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let customer of paginatedCustomers; trackBy: trackByCustomer" class="table-row">
                <td>
                  <div class="customer-name">
                    <strong>{{customer.firstName}} {{customer.lastName}}</strong>
                  </div>
                </td>
                <td>{{customer.organizationName || 'N/A'}}</td>
                <td>{{customer.email}}</td>
                <td>{{customer.contactNumber}}</td>
                <td>{{customer.gstin || 'N/A'}}</td>
                <td>
                  <span class="status-badge" [class.active]="customer.isActive" [class.inactive]="!customer.isActive">
                    {{customer.isActive ? 'Active' : 'Inactive'}}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <app-button 
                      variant="outline" 
                      size="small"
                      (click)="viewCustomer(customer.id)"
                      title="View Customer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    </app-button>
                    <app-button 
                      variant="outline" 
                      size="small"
                      (click)="editCustomer(customer.id)"
                      title="Edit Customer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </app-button>
                    <app-button 
                      variant="outline" 
                      size="small"
                      (click)="exportCustomer(customer.id)"
                      title="Export Customer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                      </svg>
                    </app-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="filteredCustomers.length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V9H21ZM19 19H5V3H13V9H19V19Z"/>
            </svg>
            <p>No customers found</p>
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
              Page {{currentPage}} of {{totalPages}} ({{filteredCustomers.length}} customers)
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
    </div>
  `,
  styles: [`
    .customer-list-container {
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

    .customer-name strong {
      color: #1f2937;
      font-weight: 600;
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

    // Mobile responsive
    @media (max-width: 768px) {
      .customer-list-container {
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
    }
  `]
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Johnson',
      organizationName: 'ABC Corporation',
      email: 'alice@abccorp.com',
      contactNumber: '+1234567890',
      gstin: '29ABCDE1234F1Z5',
      isActive: true
    },
    {
      id: 2,
      firstName: 'Bob',
      lastName: 'Smith',
      organizationName: 'XYZ Industries',
      email: 'bob@xyzind.com',
      contactNumber: '+1234567891',
      gstin: '29FGHIJ5678K2Z6',
      isActive: true
    },
    {
      id: 3,
      firstName: 'Carol',
      lastName: 'Davis',
      organizationName: null,
      email: 'carol.davis@email.com',
      contactNumber: '+1234567892',
      gstin: null,
      isActive: true
    },
    {
      id: 4,
      firstName: 'David',
      lastName: 'Wilson',
      organizationName: 'Tech Solutions Inc',
      email: 'david@techsol.com',
      contactNumber: '+1234567893',
      gstin: '29KLMNO9012P3Z7',
      isActive: false
    },
    {
      id: 5,
      firstName: 'Emma',
      lastName: 'Thompson',
      organizationName: 'Global Manufacturing',
      email: 'emma@globalmfg.com',
      contactNumber: '+1234567894',
      gstin: '29QRSTU3456V4Z8',
      isActive: true
    }
  ];

  filteredCustomers: Customer[] = [...this.customers];
  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  get totalPages(): number {
    return Math.ceil(this.filteredCustomers.length / this.pageSize);
  }

  get paginatedCustomers(): Customer[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredCustomers.slice(startIndex, startIndex + this.pageSize);
  }

  ngOnInit() {
    // Load customers from service
    this.filteredCustomers = [...this.customers];
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    this.currentPage = 1; // Reset to first page when searching
    
    if (!this.searchTerm.trim()) {
      this.filteredCustomers = [...this.customers];
      return;
    }

    this.filteredCustomers = this.customers.filter(customer => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      const organization = (customer.organizationName || '').toLowerCase();
      const email = customer.email.toLowerCase();
      const contact = customer.contactNumber.toLowerCase();
      
      return fullName.includes(this.searchTerm) ||
             organization.includes(this.searchTerm) ||
             email.includes(this.searchTerm) ||
             contact.includes(this.searchTerm);
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  trackByCustomer(index: number, customer: Customer): number {
    return customer.id;
  }

  viewCustomer(customerId: number): void {
    // Navigate to customer detail view
    console.log('View customer:', customerId);
    // this.router.navigate(['/customers/view', customerId]);
  }

  editCustomer(customerId: number): void {
    // Navigate to customer edit form
    console.log('Edit customer:', customerId);
    // this.router.navigate(['/customers/edit', customerId]);
  }

  exportCustomer(customerId: number): void {
    // Implement export functionality
    const customer = this.customers.find(c => c.id === customerId);
    if (customer) {
      console.log('Exporting customer:', customer);
      // Implement actual export logic here
      alert(`Exporting data for ${customer.firstName} ${customer.lastName}`);
    }
  }
}
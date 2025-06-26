import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import shared components
import { 
  SearchInputComponent,
  ButtonComponent,
  CardComponent
} from '../../../shared/components';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  isActive: boolean;
  role?: string;
  department?: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SearchInputComponent,
    ButtonComponent,
    CardComponent
  ],
  template: `
    <div class="user-list-container">
      <div class="header">
        <h1>Users</h1>
        <app-button 
          variant="primary"
          routerLink="/users/create"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add User
        </app-button>
      </div>

      <app-card title="User Management">
        <div class="filters">
          <app-search-input
            placeholder="Search by name or email"
            (search)="onSearch($event)"
            width="400px"
          ></app-search-input>
        </div>

        <div class="table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of paginatedUsers; trackBy: trackByUser" class="table-row">
                <td>
                  <div class="user-name">
                    <strong>{{user.firstName}} {{user.lastName}}</strong>
                    <span *ngIf="user.department" class="department">{{user.department}}</span>
                  </div>
                </td>
                <td>
                  <div class="email-cell">
                    {{user.email}}
                  </div>
                </td>
                <td>{{user.contactNumber}}</td>
                <td>
                  <span class="role-badge" [class]="getRoleClass(user.role)">
                    {{user.role || 'User'}}
                  </span>
                </td>
                <td>
                  <span class="status-badge" [class.active]="user.isActive" [class.inactive]="!user.isActive">
                    {{user.isActive ? 'Active' : 'Inactive'}}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <app-button 
                      variant="outline" 
                      size="small"
                      [routerLink]="['/users/edit', user.id]"
                      title="Edit User"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </app-button>
                    <app-button 
                      variant="outline" 
                      size="small"
                      (click)="confirmDeleteUser(user)"
                      title="Delete User"
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

          <div *ngIf="filteredUsers.length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V9H21ZM19 19H5V3H13V9H19V19Z"/>
            </svg>
            <p>No users found</p>
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
              Page {{currentPage}} of {{totalPages}} ({{filteredUsers.length}} users)
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
    .user-list-container {
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

    .user-name {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-name strong {
      color: #1f2937;
      font-weight: 600;
    }

    .department {
      font-size: 12px;
      color: #6b7280;
      font-style: italic;
    }

    .email-cell {
      font-family: monospace;
      font-size: 13px;
    }

    .role-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .role-badge.admin {
      background-color: #fef3c7;
      color: #92400e;
    }

    .role-badge.manager {
      background-color: #e0e7ff;
      color: #3730a3;
    }

    .role-badge.user {
      background-color: #f3f4f6;
      color: #374151;
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

    // Mobile responsive
    @media (max-width: 768px) {
      .user-list-container {
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
export class UserListComponent implements OnInit {
  users: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      contactNumber: '+1234567890',
      isActive: true,
      role: 'Admin',
      department: 'IT'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      contactNumber: '+1234567891',
      isActive: true,
      role: 'Manager',
      department: 'Sales'
    },
    {
      id: 3,
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      contactNumber: '+1234567892',
      isActive: false,
      role: 'User',
      department: 'Support'
    },
    {
      id: 4,
      firstName: 'Alice',
      lastName: 'Williams',
      email: 'alice.williams@example.com',
      contactNumber: '+1234567893',
      isActive: true,
      role: 'Manager',
      department: 'Operations'
    },
    {
      id: 5,
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.brown@example.com',
      contactNumber: '+1234567894',
      isActive: true,
      role: 'User',
      department: 'Finance'
    }
  ];

  filteredUsers: User[] = [...this.users];
  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  ngOnInit() {
    // Load users from service
    this.filteredUsers = [...this.users];
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    this.currentPage = 1; // Reset to first page when searching
    
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const role = (user.role || '').toLowerCase();
      const department = (user.department || '').toLowerCase();
      
      return fullName.includes(this.searchTerm) ||
             email.includes(this.searchTerm) ||
             role.includes(this.searchTerm) ||
             department.includes(this.searchTerm);
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  trackByUser(index: number, user: User): number {
    return user.id;
  }

  getRoleClass(role?: string): string {
    if (!role) return 'user';
    return role.toLowerCase();
  }

  confirmDeleteUser(user: User): void {
    const confirmed = confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`);
    if (confirmed) {
      this.deleteUser(user.id);
    }
  }

  deleteUser(userId: number): void {
    // Implement delete functionality
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      const user = this.users[userIndex];
      this.users.splice(userIndex, 1);
      this.filteredUsers = this.filteredUsers.filter(u => u.id !== userId);
      
      console.log('User deleted:', user);
      alert(`User ${user.firstName} ${user.lastName} has been deleted.`);
      
      // Adjust current page if necessary
      if (this.paginatedUsers.length === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
}
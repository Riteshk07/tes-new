import { Component, Input, Output, EventEmitter, TemplateRef, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  template?: TemplateRef<any>;
  type?: 'text' | 'number' | 'date' | 'custom';
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'warn' | 'accent';
  disabled?: (item: any) => boolean;
  action: (item: any, index: number) => void;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-container" [style.width]="width">
      <div class="table-header" *ngIf="title || searchable">
        <h3 *ngIf="title" class="table-title">{{ title }}</h3>
        <div class="table-actions">
          <div *ngIf="searchable" class="search-container">
            <input 
              type="text" 
              placeholder="Search..." 
              class="search-input"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearch($event)"
            />
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <button 
            *ngIf="addButtonLabel" 
            class="add-button"
            (click)="onAdd()"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            {{ addButtonLabel }}
          </button>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th 
                *ngFor="let column of columns; trackBy: trackByColumn"
                [style.width]="column.width"
                [class.sortable]="column.sortable"
                (click)="column.sortable && sort(column.key)"
              >
                <div class="header-content">
                  <span>{{ column.label }}</span>
                  <div *ngIf="column.sortable" class="sort-arrows">
                    <svg 
                      class="sort-arrow up"
                      [class.active]="sortColumn === column.key && sortDirection === 'asc'"
                      width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
                    >
                      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                    </svg>
                    <svg 
                      class="sort-arrow down"
                      [class.active]="sortColumn === column.key && sortDirection === 'desc'"
                      width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
                    >
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                    </svg>
                  </div>
                </div>
              </th>
              <th *ngIf="actions && actions.length > 0" class="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredAndSortedData; let i = index; trackBy: trackByItem" class="data-row">
              <td *ngFor="let column of columns; trackBy: trackByColumn" [class]="'column-' + column.key">
                <ng-container [ngSwitch]="column.type || 'text'">
                  <span *ngSwitchCase="'text'">{{ getNestedProperty(item, column.key) }}</span>
                  <span *ngSwitchCase="'number'">{{ getNestedProperty(item, column.key) | number }}</span>
                  <span *ngSwitchCase="'date'">{{ getNestedProperty(item, column.key) | date:'short' }}</span>
                  <ng-container *ngSwitchCase="'custom'">
                    <ng-container 
                      *ngTemplateOutlet="column.template || null; context: { $implicit: item, index: i }"
                    ></ng-container>
                  </ng-container>
                </ng-container>
              </td>
              <td *ngIf="actions && actions.length > 0" class="actions-cell">
                <div class="action-buttons">
                  <button
                    *ngFor="let action of actions; trackBy: trackByAction"
                    [class]="'action-button ' + (action.color || 'primary')"
                    [disabled]="action.disabled ? action.disabled(item) : false"
                    (click)="action.action(item, i)"
                    [title]="action.label"
                  >
                    <svg *ngIf="action.icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <ng-container [ngSwitch]="action.icon">
                        <path *ngSwitchCase="'edit'" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        <path *ngSwitchCase="'delete'" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        <path *ngSwitchCase="'view'" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        <path *ngSwitchDefault d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </ng-container>
                    </svg>
                    <span *ngIf="!action.icon">{{ action.label }}</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredAndSortedData.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
          <p>{{ emptyMessage || 'No data available' }}</p>
        </div>
      </div>

      <div *ngIf="pagination && totalItems > pageSize" class="pagination">
        <div class="pagination-info">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalItems) }} of {{ totalItems }} entries
        </div>
        <div class="pagination-controls">
          <button 
            class="page-button"
            [disabled]="currentPage === 1"
            (click)="goToPage(currentPage - 1)"
          >
            Previous
          </button>
          <button
            *ngFor="let page of visiblePages; trackBy: trackByPage"
            class="page-button"
            [class.active]="page === currentPage"
            (click)="goToPage(page)"
          >
            {{ page }}
          </button>
          <button 
            class="page-button"
            [disabled]="currentPage === totalPages"
            (click)="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterContentInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() width: string = '100%';
  @Input() title: string = '';
  @Input() searchable: boolean = false;
  @Input() sortable: boolean = false;
  @Input() addButtonLabel: string = '';
  @Input() emptyMessage: string = '';
  @Input() pagination: boolean = false;
  @Input() pageSize: number = 10;
  @Input() trackByFn: (index: number, item: any) => any = (index, item) => index;

  @Output() search = new EventEmitter<string>();
  @Output() add = new EventEmitter<void>();
  @Output() sortChange = new EventEmitter<{column: string, direction: 'asc' | 'desc'}>();

  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;

  ngAfterContentInit(): void {
    // Component initialized
  }

  get filteredAndSortedData(): any[] {
    let result = [...this.data];

    // Apply search filter
    if (this.searchTerm && this.searchable) {
      result = result.filter(item => 
        this.columns.some(column => {
          const value = this.getNestedProperty(item, column.key);
          return value && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (this.sortColumn) {
      result.sort((a, b) => {
        const aValue = this.getNestedProperty(a, this.sortColumn);
        const bValue = this.getNestedProperty(b, this.sortColumn);
        
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    if (this.pagination) {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      result = result.slice(startIndex, startIndex + this.pageSize);
    }

    return result;
  }

  get totalItems(): number {
    let result = [...this.data];

    if (this.searchTerm && this.searchable) {
      result = result.filter(item => 
        this.columns.some(column => {
          const value = this.getNestedProperty(item, column.key);
          return value && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
        })
      );
    }

    return result.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get visiblePages(): number[] {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1; // Reset to first page when searching
    this.search.emit(term);
  }

  onAdd(): void {
    this.add.emit();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.sortChange.emit({ column, direction: this.sortDirection });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // TrackBy functions
  trackByColumn(index: number, column: TableColumn): string {
    return column.key;
  }

  trackByItem(index: number, item: any): any {
    return this.trackByFn(index, item);
  }

  trackByAction(index: number, action: TableAction): string {
    return action.label;
  }

  trackByPage(index: number, page: number): number {
    return page;
  }

  // Math reference for template
  Math = Math;
}
import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown" [class.open]="isOpen">
      <button 
        type="button" 
        class="dropdown-trigger" 
        (click)="toggle()"
        [attr.aria-expanded]="isOpen"
        [attr.aria-haspopup]="true"
      >
        <ng-content select="[slot=trigger]"></ng-content>
        <svg class="dropdown-arrow" [class.rotated]="isOpen" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>
      
      <div 
        class="dropdown-menu" 
        [class.visible]="isOpen"
        role="menu"
        [attr.aria-hidden]="!isOpen"
      >
        <ng-container *ngFor="let item of items; trackBy: trackByItem">
          <hr *ngIf="item.separator" class="dropdown-separator">
          <button
            *ngIf="!item.separator"
            type="button"
            class="dropdown-item"
            [class.disabled]="item.disabled"
            [disabled]="item.disabled"
            (click)="selectItem(item)"
            role="menuitem"
          >
            <svg *ngIf="item.icon" class="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path [attr.d]="getIconPath(item.icon)"/>
            </svg>
            <span>{{ item.label }}</span>
          </button>
        </ng-container>
        
        <ng-content select="[slot=content]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .dropdown {
      position: relative;
      display: inline-block;
    }

    .dropdown-trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: none;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      color: inherit;
      font-size: inherit;
      transition: all 0.2s ease;
      outline: none;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      &:focus {
        outline: 2px solid rgba(38, 83, 166, 0.5);
        outline-offset: 2px;
      }
    }

    .dropdown-arrow {
      transition: transform 0.2s ease;
      opacity: 0.7;

      &.rotated {
        transform: rotate(180deg);
      }
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      min-width: 200px;
      padding: 8px 0;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px);
      transition: all 0.2s ease;
      z-index: 1000;

      &.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 16px;
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      color: #4b4b4b;
      font-size: 14px;
      transition: all 0.2s ease;
      outline: none;

      &:hover:not(.disabled) {
        background-color: #f5f5f5;
        color: #2653a6;
      }

      &:focus:not(.disabled) {
        background-color: #f0f4ff;
        color: #2653a6;
        outline: 2px solid rgba(38, 83, 166, 0.3);
        outline-offset: -2px;
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .dropdown-icon {
      flex-shrink: 0;
      opacity: 0.7;
    }

    .dropdown-separator {
      margin: 8px 0;
      border: none;
      border-top: 1px solid #e0e0e0;
    }

    // Dark theme support
    .dark-theme .dropdown-menu {
      background: #2d2d2d;
      border-color: #404040;
      color: #e0e0e0;
    }

    .dark-theme .dropdown-item {
      color: #e0e0e0;

      &:hover:not(.disabled) {
        background-color: #404040;
        color: #4285f4;
      }

      &:focus:not(.disabled) {
        background-color: rgba(66, 133, 244, 0.1);
        color: #4285f4;
      }
    }

    .dark-theme .dropdown-separator {
      border-color: #404040;
    }

    .dark-theme .dropdown-trigger:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }

    // Mobile responsive
    @media (max-width: 768px) {
      .dropdown-menu {
        min-width: 160px;
        right: 0;
        left: auto;
      }
    }
  `]
})
export class DropdownComponent {
  @Input() items: DropdownItem[] = [];
  @Output() itemSelected = new EventEmitter<DropdownItem>();

  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  toggle() {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: DropdownItem) {
    if (!item.disabled) {
      this.itemSelected.emit(item);
      this.isOpen = false;
    }
  }

  trackByItem(index: number, item: DropdownItem): string {
    return item.id;
  }

  getIconPath(icon: string): string {
    const iconPaths: { [key: string]: string } = {
      'logout': 'M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H5v16h9v-2h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h9z',
      'person': 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z',
      'settings': 'M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z'
    };
    return iconPaths[icon] || iconPaths['person'];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('keydown.escape')
  onEscapeKey() {
    this.isOpen = false;
  }
}
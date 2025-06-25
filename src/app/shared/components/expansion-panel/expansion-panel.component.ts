import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expansion-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="expansion-panel" [class.expanded]="isExpanded">
      <div 
        class="panel-header"
        (click)="toggle()"
        [attr.aria-expanded]="isExpanded"
        role="button"
        tabindex="0"
        (keydown.enter)="toggle()"
        (keydown.space)="toggle()"
      >
        <div class="header-content">
          <div class="panel-title">
            <ng-content select="[slot=title]"></ng-content>
            <span *ngIf="title">{{ title }}</span>
          </div>
          <div class="panel-description" *ngIf="description || hasDescriptionContent">
            <ng-content select="[slot=description]"></ng-content>
            <span *ngIf="description">{{ description }}</span>
          </div>
        </div>
        <div class="expand-icon" [class.rotated]="isExpanded">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
          </svg>
        </div>
      </div>
      
      <div class="panel-body" [class.expanded]="isExpanded">
        <div class="panel-content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() expanded: boolean = false;
  @Input() disabled: boolean = false;
  
  @Output() expandedChange = new EventEmitter<boolean>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  get isExpanded(): boolean {
    return this.expanded;
  }

  get hasDescriptionContent(): boolean {
    // Simple check - in a real implementation you might use ViewChild/ContentChildren
    return true;
  }

  toggle(): void {
    if (this.disabled) return;
    
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
    
    if (this.expanded) {
      this.opened.emit();
    } else {
      this.closed.emit();
    }
  }

  expand(): void {
    if (!this.expanded && !this.disabled) {
      this.expanded = true;
      this.expandedChange.emit(true);
      this.opened.emit();
    }
  }

  collapse(): void {
    if (this.expanded && !this.disabled) {
      this.expanded = false;
      this.expandedChange.emit(false);
      this.closed.emit();
    }
  }
}
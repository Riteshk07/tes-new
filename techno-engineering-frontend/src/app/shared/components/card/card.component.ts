import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class]="cardClass" [style.width]="width">
      <div *ngIf="title || subtitle" class="card-header">
        <h3 *ngIf="title" class="card-title">{{ title }}</h3>
        <p *ngIf="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </div>
      
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      
      <div *ngIf="hasActionsContent" class="card-actions">
        <ng-content select="[slot=actions]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() width: string = '100%';
  @Input() cardClass: string = '';
  
  // Check if actions content is projected
  get hasActionsContent(): boolean {
    // This is a simple approach - in a more complex implementation,
    // you might use ViewChild and ContentChildren to detect projected content
    return true; // We'll assume actions might be present
  }
}
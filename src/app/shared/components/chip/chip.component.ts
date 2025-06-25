import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChipVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  @Input() label: string = '';
  @Input() variant: ChipVariant = 'default';
  @Input() removable: boolean = false;
  @Input() disabled: boolean = false;
  @Input() icon: string = '';
  @Input() selected: boolean = false;
  
  @Output() removed = new EventEmitter<void>();
  @Output() clicked = new EventEmitter<void>();

  onRemove(event: Event): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.removed.emit();
    }
  }

  onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}

@Component({
  selector: 'app-chip-set',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chip-set" [class.disabled]="disabled">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    .chip-set.disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    @media (max-width: 480px) {
      .chip-set {
        gap: 6px;
      }
    }
  `]
})
export class ChipSetComponent {
  @Input() disabled: boolean = false;
}
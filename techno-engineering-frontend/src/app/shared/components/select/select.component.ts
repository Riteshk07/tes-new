import { Component, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() options: SelectOption[] = [];
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() width: string = '240px';
  @Input() multiple: boolean = false;
  @Input() searchable: boolean = false;
  
  @Output() selectionChange = new EventEmitter<any>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  value: any = null;
  isOpen: boolean = false;
  isFocused: boolean = false;
  searchTerm: string = '';
  filteredOptions: SelectOption[] = [];

  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    this.filteredOptions = [...this.options];
  }

  ngOnChanges(): void {
    this.filteredOptions = this.getFilteredOptions();
  }

  onToggle(): void {
    if (this.disabled) return;
    
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.onFocus();
      if (this.searchable) {
        setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
      }
    } else {
      this.onBlur();
    }
  }

  onSelectOption(option: SelectOption): void {
    if (option.disabled) return;

    if (this.multiple) {
      const currentValues = Array.isArray(this.value) ? [...this.value] : [];
      const index = currentValues.findIndex(v => v === option.value);
      
      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(option.value);
      }
      
      this.value = currentValues;
    } else {
      this.value = option.value;
      this.isOpen = false;
    }

    this.onChange(this.value);
    this.selectionChange.emit(this.value);
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.filteredOptions = this.getFilteredOptions();
  }

  onFocus(): void {
    this.isFocused = true;
    this.focus.emit();
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
    this.blur.emit();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.onToggle();
        break;
      case 'Escape':
        this.isOpen = false;
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.isOpen = true;
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen) {
          this.isOpen = true;
        }
        break;
    }
  }

  private getFilteredOptions(): SelectOption[] {
    if (!this.searchable || !this.searchTerm) {
      return [...this.options];
    }

    return this.options.filter(option =>
      option.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getDisplayValue(): string {
    if (this.multiple && Array.isArray(this.value)) {
      if (this.value.length === 0) return this.placeholder;
      const selectedOptions = this.options.filter(opt => this.value.includes(opt.value));
      return selectedOptions.map(opt => opt.label).join(', ');
    }

    const selectedOption = this.options.find(opt => opt.value === this.value);
    return selectedOption ? selectedOption.label : this.placeholder;
  }

  isSelected(option: SelectOption): boolean {
    if (this.multiple && Array.isArray(this.value)) {
      return this.value.includes(option.value);
    }
    return this.value === option.value;
  }

  get hasValue(): boolean {
    if (this.multiple && Array.isArray(this.value)) {
      return this.value.length > 0;
    }
    return this.value != null && this.value !== '';
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  trackByValue(index: number, option: SelectOption): any {
    return option.value;
  }
}
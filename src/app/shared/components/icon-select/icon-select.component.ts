import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface IconOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-icon-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-select.component.html',
  styleUrls: ['./icon-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconSelectComponent),
      multi: true
    }
  ]
})
export class IconSelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select an icon';
  @Input() options: IconOption[] = [];
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() width: string = '100%';
  @Input() hint: string = '';
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  value: string = '';
  isOpen: boolean = false;
  isFocused: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get selectedOption(): IconOption | undefined {
    return this.options.find(option => option.value === this.value);
  }

  get displayValue(): string {
    const selected = this.selectedOption;
    return selected ? selected.label : this.placeholder;
  }

  onToggleDropdown(): void {
    if (this.disabled) return;
    
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.onFocus();
    } else {
      this.onBlur();
    }
  }

  onSelectOption(option: IconOption): void {
    this.value = option.value;
    this.isOpen = false;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.onBlur();
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
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.onToggleDropdown();
        break;
      case 'Escape':
        this.isOpen = false;
        this.onBlur();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateOptions(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateOptions(-1);
        break;
    }
  }

  private navigateOptions(direction: number): void {
    if (!this.isOpen) {
      this.isOpen = true;
      return;
    }

    const currentIndex = this.options.findIndex(option => option.value === this.value);
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) newIndex = this.options.length - 1;
    if (newIndex >= this.options.length) newIndex = 0;
    
    if (this.options[newIndex]) {
      this.onSelectOption(this.options[newIndex]);
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
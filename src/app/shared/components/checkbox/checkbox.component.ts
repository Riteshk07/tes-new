import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() indeterminate: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  
  @Output() change = new EventEmitter<boolean>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  value: boolean = false;
  isFocused: boolean = false;

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  onToggle(): void {
    if (this.disabled) return;
    
    this.value = !this.value;
    this.onChange(this.value);
    this.change.emit(this.value);
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
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.onToggle();
    }
  }

  get checkboxClasses(): string {
    const classes = [
      'checkbox',
      `checkbox-${this.size}`,
      this.value ? 'checked' : '',
      this.disabled ? 'disabled' : '',
      this.isFocused ? 'focused' : '',
      this.indeterminate ? 'indeterminate' : ''
    ];
    
    return classes.filter(Boolean).join(' ');
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.value = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
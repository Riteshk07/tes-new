import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true
    }
  ]
})
export class DateInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select date';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() width: string = '100%';
  @Input() min: string = '';
  @Input() max: string = '';
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  value: string = '';
  isFocused: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
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

  get hasValue(): boolean {
    return this.value != null && this.value.length > 0;
  }

  get showFloatingLabel(): boolean {
    return this.isFocused || this.hasValue;
  }
}
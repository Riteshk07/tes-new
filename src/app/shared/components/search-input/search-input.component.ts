import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true
    }
  ]
})
export class SearchInputComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Search...';
  @Input() disabled: boolean = false;
  @Input() width: string = '320px';
  @Input() debounceTime: number = 300;
  @Input() clearButton: boolean = true;
  @Input() loading: boolean = false;
  
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  value: string = '';
  isFocused: boolean = false;
  
  private searchSubject = new Subject<string>();
  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor() {
    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(searchTerm => {
      this.search.emit(searchTerm);
    });
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.searchSubject.next(this.value);
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

  onClear(): void {
    this.value = '';
    this.onChange(this.value);
    this.searchSubject.next(this.value);
    this.clear.emit();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onClear();
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

  get hasValue(): boolean {
    return this.value !=null && this.value.length > 0;
  }
}
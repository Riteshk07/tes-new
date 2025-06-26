import { Component, Input, Output, EventEmitter, forwardRef, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, map, startWith, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

export interface AutocompleteOption {
  value: any;
  label: string;
  subtitle?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ]
})
export class AutocompleteComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() label: string = '';
  @Input() placeholder: string = 'Search...';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() width: string = '100%';
  @Input() options: AutocompleteOption[] = [];
  @Input() displayProperty: string = 'label';
  @Input() subtitleProperty: string = 'subtitle';
  @Input() valueProperty: string = 'value';
  @Input() debounceTime: number = 300;
  @Input() minLength: number = 0;
  @Input() maxResults: number = 10;
  @Input() hint: string = '';

  @Output() optionSelected = new EventEmitter<AutocompleteOption>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  @ViewChild('input', { static: true }) inputElement!: ElementRef<HTMLInputElement>;

  searchControl = new FormControl('');
  filteredOptions: AutocompleteOption[] = [];
  isOpen = false;
  activeIndex = -1;
  isFocused = false;
  
  private destroy$ = new Subject<void>();
  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.filterOptions(searchTerm || '');
      this.searchChange.emit(searchTerm || '');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private filterOptions(searchTerm: string): void {
    if (searchTerm.length < this.minLength) {
      this.filteredOptions = [];
      this.isOpen = false;
      return;
    }

    const filtered = this.options.filter(option => {
      const label = this.getPropertyValue(option, this.displayProperty);
      const subtitle = this.getPropertyValue(option, this.subtitleProperty);
      const searchValue = searchTerm.toLowerCase();
      
      return !option.disabled && (
        label.toLowerCase().includes(searchValue) ||
        (subtitle && subtitle.toLowerCase().includes(searchValue))
      );
    }).slice(0, this.maxResults);

    this.filteredOptions = filtered;
    this.isOpen = filtered.length > 0;
    this.activeIndex = -1;
  }

  public getPropertyValue(obj: any, property: string): string {
    return obj[property] || '';
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchControl.setValue(target.value);
  }

  onFocus(): void {
    this.isFocused = true;
    this.focus.emit();
    if (this.searchControl.value && this.searchControl.value.length >= this.minLength) {
      this.filterOptions(this.searchControl.value);
    }
  }

  onBlur(): void {
    // Delay blur to allow for option selection
    setTimeout(() => {
      this.isFocused = false;
      this.isOpen = false;
      this.activeIndex = -1;
      this.onTouched();
      this.blur.emit();
    }, 150);
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') {
        event.preventDefault();
        if (this.searchControl.value && this.searchControl.value.length >= this.minLength) {
          this.filterOptions(this.searchControl.value);
        }
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex = Math.min(this.activeIndex + 1, this.filteredOptions.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.activeIndex >= 0 && this.activeIndex < this.filteredOptions.length) {
          this.selectOption(this.filteredOptions[this.activeIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.isOpen = false;
        this.activeIndex = -1;
        break;
    }
  }

  selectOption(option: AutocompleteOption): void {
    const value = this.getPropertyValue(option, this.valueProperty) || option.value;
    const displayValue = this.getPropertyValue(option, this.displayProperty);
    
    this.searchControl.setValue(displayValue);
    this.onChange(value);
    this.optionSelected.emit(option);
    this.isOpen = false;
    this.activeIndex = -1;
  }

  clearSelection(): void {
    this.searchControl.setValue('');
    this.onChange(null);
    this.filteredOptions = [];
    this.isOpen = false;
    this.activeIndex = -1;
    this.inputElement.nativeElement.focus();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value) {
      // Find the option that matches the value
      const option = this.options.find(opt => 
        this.getPropertyValue(opt, this.valueProperty) === value || opt.value === value
      );
      if (option) {
        const displayValue = this.getPropertyValue(option, this.displayProperty);
        this.searchControl.setValue(displayValue);
      } else {
        this.searchControl.setValue(value);
      }
    } else {
      this.searchControl.setValue('');
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }

  get hasValue(): boolean {
    return this.searchControl.value != null && this.searchControl.value.length > 0;
  }

  get showFloatingLabel(): boolean {
    return this.isFocused || this.hasValue;
  }

  trackByIndex(index: number, item: AutocompleteOption): any {
    return index;
  }
}
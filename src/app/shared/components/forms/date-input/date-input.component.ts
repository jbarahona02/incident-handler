// date-input.component.ts
import { Component, Optional, Self, Input, ElementRef, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html'
})
export class DateInputComponent extends BaseInputComponent {
  
  @Input() minDate: string = '';
  @Input() maxDate: string = '';
  
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  constructor(@Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  openDatePicker(): void {
    if (this.dateInput && !this.disabled) {
      this.dateInput.nativeElement.showPicker();
    }
  }

  handleDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
    this.onTouched();
  }

  get dateValue(): string {
    if (!this.value) return '';
    
    if (this.value instanceof Date) {
      return this.value.toISOString().split('T')[0];
    }
    
    if (typeof this.value === 'string') {
      return this.value;
    }
    
    return '';
  }
}
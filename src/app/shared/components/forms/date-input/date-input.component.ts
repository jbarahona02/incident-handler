// date-input.component.ts
import { Component, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html'
})
export class DateInputComponent extends BaseInputComponent {
  @Input() minDate: string = '';
  @Input() maxDate: string = '';

  constructor(@Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
    this.onTouched();
  }

  formatToIsoDate(date: string): string {
    if (!date) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [day, month, year] = date.split('/');
      return `${year}-${month}-${day}`;
    }
    return date;
  }

  formatToDisplayDate(date: string): string {
    if (!date) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    }
    return date;
  }
}
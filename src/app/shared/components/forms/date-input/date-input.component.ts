import { Component, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html'
})
export class DateInputComponent extends BaseInputComponent {
  
  constructor(@Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  // Método específico para date input
  handleDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value; // Guardamos como string (formato YYYY-MM-DD)
    this.onChange(this.value);
    this.onTouched();
  }

  // Convertir a formato ISO para el input date
  get dateValue(): string {
    if (!this.value) return '';
    
    // Si es una fecha, convertir a formato YYYY-MM-DD
    if (this.value instanceof Date) {
      return this.value.toISOString().split('T')[0];
    }
    
    // Si ya es string en formato YYYY-MM-DD
    if (typeof this.value === 'string') {
      return this.value;
    }
    
    return '';
  }
}
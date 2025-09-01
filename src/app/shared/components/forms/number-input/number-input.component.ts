// number-input.component.ts
import { Component, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html'
})
export class NumberInputComponent extends BaseInputComponent {
  
  constructor(@Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  // Método específico para number input
  handleNumberChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const numericValue = inputElement.valueAsNumber;
    
    // Guardar como número (no como string)
    this.value = isNaN(numericValue) ? null : numericValue;
    this.onChange(this.value);
    this.onTouched();
  }

  // Getter para el valor del input (convertir a string para el input)
  get numberValue(): string {
    if (this.value === null || this.value === undefined) return '';
    return this.value.toString();
  }
}
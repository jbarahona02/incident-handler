// base-input.component.ts
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, AbstractControl } from '@angular/forms';

@Component({
  template: '' // Componente abstracto
})
export abstract class BaseInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() minLength: number | null = null;
  @Input() maxLength: number | null = null;
  @Input() pattern: string | null = null;
  @Input() step: number | null = null;
  @Input() options: any[] = [];
  
  private _value: any;
  onChange: (value: any) => void = () => {};
  onTouched: any = () => {};
  
  get value(): any {
    return this._value;
  }
  
  set value(val: any) {
    if (val !== this._value) {
      this._value = val;
      // IMPORTANTE: Llamar a onChange con el nuevo valor
      this.onChange(val);
    }
  }

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  get control(): AbstractControl | null {
    return this.ngControl?.control as AbstractControl;
  }

  writeValue(value: any): void {
    // Solo actualizar si el valor es diferente
    if (value !== this._value) {
      this._value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getErrorMessage(): string {
    if (!this.control || !this.control.errors || !this.control.touched) return '';
    
    const errors = this.control.errors;
    
    if (errors['required']) {
      return this.errorMessages['required'] || 'Este campo es obligatorio';
    }
    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      return this.errorMessages['maxlength'] || `Máximo ${requiredLength} caracteres permitidos`;
    }
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return this.errorMessages['minlength'] || `Mínimo ${requiredLength} caracteres requeridos`;
    }
    if (errors['email']) {
      return this.errorMessages['email'] || 'Formato de email inválido';
    }
    if (errors['min']) {
      const minValue = errors['min'].min;
      return this.errorMessages['min'] || `El valor mínimo permitido es ${minValue}`;
    }
    if (errors['max']) {
      const maxValue = errors['max'].max;
      return this.errorMessages['max'] || `El valor máximo permitido es ${maxValue}`;
    }
    if (errors['pattern']) {
      return this.errorMessages['pattern'] || 'El formato no es válido';
    }
    
    return this.errorMessages['default'] || 'Error de validación';
  }

  // Método genérico para manejar cambios de input
  handleInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
    this.onTouched();
  }

  // Método genérico para manejar cambios de textarea
  handleTextareaChange(event: Event): void {
    const textareaElement = event.target as HTMLTextAreaElement;
    this.value = textareaElement.value;
    this.onChange(this.value);
    this.onTouched();
  }

  // Método para manejar el blur
  handleBlur(): void {
    this.onTouched();
  }
}
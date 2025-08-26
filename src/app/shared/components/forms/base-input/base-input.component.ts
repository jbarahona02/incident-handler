// base-input.component.ts
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl } from '@angular/forms';

@Component({
  template: '' // Componente abstracto
})
export abstract class BaseInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() errorMessages: { [key: string]: string } = {};
  
  value: any;
  onChange: any = () => {};
  onTouched: any = () => {};
  
  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  get control(): FormControl | null {
    return this.ngControl?.control as FormControl;
  }

  writeValue(value: any): void {
    this.value = value;
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
    
    const firstError = Object.keys(this.control.errors)[0];
    return this.errorMessages[firstError] || this.getDefaultErrorMessage(firstError);
  }

  private getDefaultErrorMessage(errorType: string): string {
    const errorMessages: { [key: string]: string } = {
      'required': 'Este campo es obligatorio',
      'email': 'Formato de email inválido',
      'minlength': 'El texto es demasiado corto',
      'maxlength': 'El texto es demasiado largo',
      'min': 'El valor es demasiado bajo',
      'max': 'El valor es demasiado alto',
      'pattern': 'El formato no es válido'
    };
    
    return errorMessages[errorType] || 'Error de validación';
  }
}
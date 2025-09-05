import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox-input',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './checkbox-input.component.html',
  styleUrl: './checkbox-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxInputComponent),
      multi: true
    }
  ]
})
export class CheckboxInputComponent implements ControlValueAccessor  {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
  }
  @Input() control?: FormControl;
  @Input() errorMessages: { [key: string]: string } = {};
  
  value: boolean = false;
  isDisabled: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};
  
  writeValue(value: any): void {
    this.value = value;
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  
  onCheckboxChange(event: Event): void {
    if (this.isDisabled) return;
    
    const checked = (event.target as HTMLInputElement).checked;
    this.value = checked;
    this.onChange(checked);
    this.onTouched();
  }
  
  getErrorMessage(): string {
    if (!this.control?.errors) return '';
    
    const firstError = Object.keys(this.control.errors)[0];
    return this.errorMessages[firstError] || 'Campo inválido';
  }
}

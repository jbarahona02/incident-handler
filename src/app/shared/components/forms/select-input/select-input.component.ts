// select-input.component.ts
import { Component, Input, Optional, Self, ElementRef, AfterViewInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html'
})
export class SelectInputComponent extends BaseInputComponent implements AfterViewInit {
  @Input() optionValue: string = 'id';
  @Input() optionLabel: string = 'name';

  private selectElement!: HTMLSelectElement;

  constructor(
    @Optional() @Self() ngControl: NgControl,
    private elementRef: ElementRef
  ) {
    super(ngControl);
  }

  ngAfterViewInit(): void {
    this.selectElement = this.elementRef.nativeElement.querySelector('select');
    
    if (this.control) {
      this.control.valueChanges.subscribe(value => {
        this.updateSelectValue(value);
      });
      
      // Establecer valor inicial después de que la vista se renderice
      setTimeout(() => {
        this.updateSelectValue(this.control?.value);
      });
    }
  }

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    
    const selectedOption = this.options.find(option => 
      this.getOptionValue(option).toString() === selectedValue
    );
    
    if (selectedOption) {
      const newValue = this.getOptionValue(selectedOption);
      
      // Establecer el valor y forzar la detección de cambios
      this.value = newValue;
    } else {
      this.value = selectedValue === '' ? null : selectedValue;
    }
    
    // Marcar como touched
    this.onTouched();
    
    // Forzar validación inmediata
    if (this.control) {
      this.control.updateValueAndValidity();
    }
  }

  private updateSelectValue(value: any): void {
    if (this.selectElement) {
      if (value === null || value === undefined || value === '') {
        this.selectElement.value = '';
      } else {
        const stringValue = value.toString();
        this.selectElement.value = stringValue;
      }
    }
  }

  getOptionValue(option: any): any {
    return this.optionValue ? option[this.optionValue] : option;
  }

  getOptionLabel(option: any): string {
    return this.optionLabel ? option[this.optionLabel] : String(option);
  }
}
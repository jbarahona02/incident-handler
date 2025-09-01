// select-input.component.ts
import { Component, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html'
})
export class SelectInputComponent extends BaseInputComponent {
  @Input() optionValue: string = 'id';
  @Input() optionLabel: string = 'name';

  constructor(@Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.value = selectElement.value;
    this.onChange(this.value);
    this.onTouched();
  }

  getOptionValue(option: any): any {
    return this.optionValue ? option[this.optionValue] : option;
  }

  getOptionLabel(option: any): string {
    return this.optionLabel ? option[this.optionLabel] : String(option);
  }
}
// email-input.component.ts
import { Component, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-email-input',
  templateUrl: './email-input.component.html'
})
export class EmailInputComponent extends BaseInputComponent {
  constructor(@Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
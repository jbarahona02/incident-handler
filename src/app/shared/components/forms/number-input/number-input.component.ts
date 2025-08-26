// number-input.component.ts
import { Component, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html'
})
export class NumberInputComponent extends BaseInputComponent {
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() step: number = 1;

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
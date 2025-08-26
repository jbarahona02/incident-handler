// text-input.component.ts
import { Component, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html'
})
export class TextInputComponent extends BaseInputComponent {
  @Input() minLength: number | null = null;
  @Input() maxLength: number | null = null;
  @Input() pattern: string | null = null;

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
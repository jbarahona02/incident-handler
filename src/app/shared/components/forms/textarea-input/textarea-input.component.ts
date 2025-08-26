// textarea-input.component.ts
import { Component, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-textarea-input',
  templateUrl: './textarea-input.component.html'
})
export class TextareaInputComponent extends BaseInputComponent {
  @Input() rows: number = 3;
  @Input() cols: number = 20;

  constructor(@Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  onInputChange(event: Event): void {
    const textareaElement = event.target as HTMLTextAreaElement;
    this.value = textareaElement.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
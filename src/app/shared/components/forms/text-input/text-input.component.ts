// text-input.component.ts
import { Component, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html'
})
export class TextInputComponent extends BaseInputComponent {

  @Input() inputType: string = "text";

  constructor(@Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }
}
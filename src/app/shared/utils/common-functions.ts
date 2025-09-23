import { AbstractControl, ValidationErrors } from "@angular/forms";

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
        return { 'whitespace': true };
    }

    const regex = /^(?!\s*$).+/;
    const isValid = regex.test(control.value);

    return isValid ? null : { 'whitespace': true };
}
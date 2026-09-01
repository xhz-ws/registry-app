import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function arabicOnlyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    return /^[\u0600-\u06FF\s]+$/.test(control.value)
      ? null
      : { arabicOnly: true };
  };
}

export function englishOnlyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    return /^[A-Za-z\s]+$/.test(control.value)
      ? null
      : { englishOnly: true };
  };
}

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    return new Date(control.value) >= new Date()
      ? null
      : { past: true };
  };
}
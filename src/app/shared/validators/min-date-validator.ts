import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minDateValidator(minDate: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: Date = control.value;

    if (!value) {
      return null;
    }

    const selectedDate = new Date(value);
    if (selectedDate < minDate) {
      return { minDate: { requiredDate: minDate.toISOString(), actualDate: selectedDate.toISOString() } };
    }
    return null;
  };
}

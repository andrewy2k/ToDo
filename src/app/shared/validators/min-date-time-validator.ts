import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { EToDoKey } from '../../models/todo';
import { ITime } from '../../models/time';
import { timeStringToObject } from '../utils/date-time';

export function minDateTimeValidator(minDateTime: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const expirationDate: string = control.get(EToDoKey.ExpirationDate)?.value;
    const expirationTime: string = control.get(EToDoKey.ExpirationTime)?.value;

    if (!expirationDate || !expirationTime) {
      return null;
    }

    const expirationDateTime = new Date(expirationDate);
    const time: ITime = timeStringToObject(expirationTime)
    expirationDateTime.setHours(time.hours, time.minutes);

    if (expirationDateTime.getTime() < minDateTime.getTime()) {
      control.get(EToDoKey.ExpirationTime)?.setErrors({ minDateTime: { requiredDate: minDateTime }});
      return { minDateTime: { requiredDate: minDateTime } };
    }
    control.get(EToDoKey.ExpirationTime)?.setErrors(null);
    return null;
  };
}

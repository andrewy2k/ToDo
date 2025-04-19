import { FormControl } from '@angular/forms';

export class IsoDateFormControl extends FormControl {
  override setValue(value: Date | string | null, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }): void {
    if (value instanceof Date) {
      super.setValue(value.toISOString(), options);
    } else {
      super.setValue(value, options);
    }
  }
}

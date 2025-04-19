import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatInput, MatInputModule } from '@angular/material/input';
import { EToDoKey, ITodo, TAddTodoFormControls } from '../../models/todo';
import { TodoService } from '../../services/todo.service';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { ERoute } from '../../models/route';
import { IsoDateFormControl } from '../../shared/controls/iso-date-form-control';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs';
import { minDateValidator } from '../../shared/validators/min-date-validator';
import { DatePipe } from '@angular/common';
import { minDateTimeValidator } from '../../shared/validators/min-date-time-validator';

@Component({
  selector: 'app-edit-todo',
  standalone: true,
  imports: [
    MatIconButton,
    MatFormField,
    ReactiveFormsModule,
    MatIcon,
    MatDatepickerToggle,
    MatDatepicker,
    NgxMaterialTimepickerModule,
    MatInput,
    MatButton,
    MatDatepickerInput,
    MatInputModule,
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatCardModule,
    DatePipe,
  ],
  templateUrl: './edit-todo.component.html',
  styleUrl: './edit-todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTodoComponent implements OnInit {
  protected submitted: boolean = false;
  protected form!: FormGroup<TAddTodoFormControls>;

  protected readonly EToDoKey: typeof EToDoKey = EToDoKey;
  protected readonly isSaving: WritableSignal<boolean> = signal(false);

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly todoService: TodoService = inject(TodoService);
  private readonly router: Router = inject(Router);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.createForm();
  }

  protected createOrUpdatedTodo(): void {
    this.submitted = true;
    this.form.markAsDirty();
    this.form.markAsTouched();

    if (this.form?.valid) {
      this.isSaving.set(true);
      const formValue: Omit<ITodo, EToDoKey.Id | EToDoKey.CreatedAt | EToDoKey.Favorite> = this.form.getRawValue();

      this.todoService.addTodo({
        [EToDoKey.Id]: uuidv4(),
        [EToDoKey.CreatedAt]: new Date().toISOString(),
        [EToDoKey.Favorite]: false,
        ...formValue,
      })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.isSaving.set(false)),
        )
        .subscribe(() => this.router.navigate([ERoute.List]));
    }
  }

  protected back(): void {
    this.router.navigate([ERoute.List]);
  }

  private createForm(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.form = this.fb.group<TAddTodoFormControls>({
        [EToDoKey.Title]: this.fb.control('', {
          validators: [Validators.required, Validators.maxLength(100)],
          nonNullable: true
        }),
        [EToDoKey.ExpirationDate]: new IsoDateFormControl('', {
          validators: [Validators.required, minDateValidator(today)],
          nonNullable: true
        }),
        [EToDoKey.ExpirationTime]: this.fb.control('', { nonNullable: true }),
      },
      {
        validators: [
          minDateTimeValidator(new Date())
        ],
      }
    );
  }

}

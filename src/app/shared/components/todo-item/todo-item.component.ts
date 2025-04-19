import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { EToDoKey, ITodo } from '../../../models/todo';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { finalize } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TimerService } from '../../../services/timer.service';
import { ITime } from '../../../models/time';
import { timeStringToObject } from '../../utils/date-time';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    MatIcon,
    DatePipe,
    MatTooltip,
    MatIconButton,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TodoItemComponent {
  @Input() public todo!: ITodo;
  @Input() public column!: EToDoKey;

  protected readonly EToDoKey: typeof EToDoKey = EToDoKey;
  protected readonly isTogglingFavorite: WritableSignal<boolean> = signal(false);
  protected readonly isDeleting: WritableSignal<boolean> = signal(false);

  private readonly timerService: TimerService = inject(TimerService);
  private readonly todoService: TodoService = inject(TodoService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  private readonly nowSignal: Signal<Date> = toSignal(this.timerService.now$, { initialValue: new Date() });

  protected readonly timer = computed(() => {
    if (this.isToday() && this.column === EToDoKey.TimeLeft) {
      const now = this.nowSignal();
      return now ? this.updateTimeLeft(now) : undefined;
    }
    return undefined;
  });

  protected isToday(): boolean {
    let result: boolean = false;
    if (this.todo) {
      const today = new Date();
      const exp = new Date(this.todo.expirationDate);
      result = today.toDateString() === exp.toDateString();
    }
    return result;
  }

  private updateTimeLeft(now: Date): string {
    let timeLeft: string = '';

    if (this.todo.expirationDate) {
      const expiration = new Date(this.todo.expirationDate);
      const time: ITime = this.todo.expirationTime ?
        timeStringToObject(this.todo.expirationTime) :
        { hours: 23, minutes: 59 };

      expiration.setHours(expiration.getHours() + time.hours);
      expiration.setMinutes(expiration.getMinutes() + time.minutes);

      const diffMs = expiration.getTime() - now.getTime();

      if (diffMs <= 0) {
        timeLeft = 'Expired';
      } else {
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        timeLeft = `${hours}h ${minutes}m ${seconds}s`;
      }
    }
    return timeLeft;
  }

  protected toggleFavorite(id: string): void {
    this.isTogglingFavorite.set(true);
    this.todoService.toggleFavorite(id).pipe(
      finalize(() => this.isTogglingFavorite.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  protected remove(): void {
    this.isDeleting.set(true);
    this.todoService.deleteTodo(this.todo.id)
      .pipe(
        finalize(() => this.isDeleting.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

}

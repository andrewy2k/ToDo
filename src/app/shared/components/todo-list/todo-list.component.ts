import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  OnInit,
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import { ITableHeader } from '../../../models/table';
import { EToDoKey, ITodo } from '../../../models/todo';
import { Observable } from 'rxjs';
import { MatSort, MatSortHeader, MatSortModule, Sort } from '@angular/material/sort';
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableModule
} from '@angular/material/table';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    MatSort,
    MatTable,
    MatColumnDef,
    MatSortHeader,
    MatHeaderRow,
    MatRow,
    MatHeaderCell,
    MatCell,
    MatTableModule,
    TodoItemComponent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatSortModule,
    MatGridList,
    MatGridTile,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit {
  @Input() public isTodayTodo: boolean = false;
  @Input() public todos$!: Observable<ITodo[]>;
  @Input() public title!: string;

  protected tableHeader!: ITableHeader<EToDoKey>[];
  protected columns!: EToDoKey[];
  protected todos: WritableSignal<ITodo[]> = signal<ITodo[]>([]);

  protected readonly sortedTodos: Signal<ITodo[]> = computed((): ITodo[] => {
    const todos: ITodo[] = this.todos();
    if (!this.sortActive() || !this.sortDirection()) {
      return todos;
    }

    return [...todos].sort((a, b) => {
      const aValue = a[this.sortActive() as keyof ITodo];
      const bValue = b[this.sortActive() as keyof ITodo];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (this.sortActive() === EToDoKey.CreatedAt || this.sortActive() === EToDoKey.ExpirationDate) {
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        const comparison = dateA - dateB;
        return this.sortDirection() === 'asc' ? comparison : -comparison;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      const comparison = aStr.localeCompare(bStr, undefined, { numeric: true });
      return this.sortDirection() === 'asc' ? comparison : -comparison;
    });
  });

  private readonly sortActive: WritableSignal<EToDoKey | null> = signal<EToDoKey | null>(null);
  private readonly sortDirection: WritableSignal<'asc' | 'desc' | '' | null> = signal<'asc' | 'desc' | '' | null>(null);

  public ngOnInit(): void {
    this.initTableHeader();
    if (this.todos$) {
      this.todos$.subscribe(todos => this.todos.set(todos));
    }
  }

  protected trackById(index: number, row: any): string {
    return row.id;
  }

  protected sortData(sort: Sort): void {
    this.sortActive.set(sort.active as keyof ITodo);
    this.sortDirection.set(sort.direction);
  }

  private initTableHeader(): void {
    this.tableHeader = [
      {
        title: 'Title',
        key: EToDoKey.Title,
        sortable: true,
        cols: 4,
        rows: 1,
      },
      {
        title: 'Created At',
        key: EToDoKey.CreatedAt,
        sortable: true,
        maxWidth: '130px',
        cols: 1,
        rows: 1,
      },
      {
        title: this.isTodayTodo ? 'Time left' : 'Expiration',
        key: this.isTodayTodo ? EToDoKey.TimeLeft : EToDoKey.ExpirationDate,
        sortable: !this.isTodayTodo,
        maxWidth: '130px',
        cols: 1,
        rows: 1,
      },
      {
        title: '',
        key: EToDoKey.Favorite,
        sortable: true,
        maxWidth: '85px',
        cols: 1,
        rows: 1,
      },
      {
        title: '',
        key: EToDoKey.Action,
        sortable: false,
        maxWidth: '85px',
        cols: 1,
        rows: 1,
      },
    ];
    this.columns = this.tableHeader.map(m => m.key);
  }

  protected readonly EToDoKey = EToDoKey;
}

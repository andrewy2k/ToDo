import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { ITodo } from '../../models/todo';
import { ActivatedRoute } from '@angular/router';
import { ERoute } from '../../models/route';
import { map, Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { TodoListComponent } from '../../shared/components/todo-list/todo-list.component';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    MatCardModule,
    TodoListComponent,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit {
  protected todos$!: Observable<ITodo[]>;
  protected todayTodos$!: Observable<ITodo[]>;
  protected isFavorites = false;

  private readonly todoService: TodoService = inject(TodoService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.isFavorites = this.route.snapshot.routeConfig?.path === ERoute.Favorite;
    if (this.isFavorites) {
      this.todos$ = this.todoService.getTodos()
        .pipe(map(todos => todos.filter(t => t.favorite)));
    } else {
      this.todos$ = this.todoService.getTodos()
        .pipe(
          map(todos => todos.filter(todo => {
            const today = new Date();
            const exp = new Date(todo.expirationDate);
            return today.toDateString() !== exp.toDateString();
          }))
        );
      this.todayTodos$ = this.todoService.getTodos()
        .pipe(
          map(todos => todos.filter(todo => {
            const today = new Date();
            const exp = new Date(todo.expirationDate);
            return today.toDateString() === exp.toDateString();
          }))
        );
    }
  }

}

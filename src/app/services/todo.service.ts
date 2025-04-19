import { inject, Injectable } from '@angular/core';;
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { EToDoKey, ITodo } from '../models/todo';
import { TODO_SCHEMA, TODOS_KEY } from '../shared/const/todo';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly todos$: BehaviorSubject<ITodo[]> = new BehaviorSubject<ITodo[]>([]);

  private readonly storage: StorageService = inject(StorageService);

  constructor() {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.storage.get<ITodo[]>(TODOS_KEY, TODO_SCHEMA).subscribe(todos => {
      this.todos$.next(todos || []);
    });
  }

  public getTodos(): Observable<ITodo[]> {
    return this.todos$.asObservable().pipe(
      shareReplay(1)
    );
  }

  public addTodo(todo: ITodo): Observable<undefined> {
    const current: ITodo[] = this.todos$.value;
    const updated: ITodo[] = [...current, todo];
    return this.storage.set(TODOS_KEY, updated).pipe(
      tap(() => this.todos$.next(updated))
    );
  }

  public deleteTodo(id: string): Observable<undefined> {
    const updated: ITodo[] = this.todos$.value.filter(todo => todo.id !== id);
    return this.storage.set(TODOS_KEY, updated).pipe(
      tap(() => this.todos$.next(updated))
    );
  }

  public toggleFavorite(id: string): Observable<undefined> {
    const updated: ITodo[] = this.todos$.value.map(todo =>
      todo.id === id ? {
          ...todo,
          [EToDoKey.Favorite]: !todo[EToDoKey.Favorite],
          [EToDoKey.Id]: uuidv4()
        }
        : todo
    );
    return this.storage.set(TODOS_KEY, updated).pipe(
      tap(() => this.todos$.next(updated))
    );
  }
}

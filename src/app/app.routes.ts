import { Routes } from '@angular/router';
import { ERoute } from './models/route';

export const routes: Routes = [
  { path: '', redirectTo: ERoute.List, pathMatch: 'full' },
  {
    path: ERoute.Add,
    loadComponent: () => import('./pages/edit-todo/edit-todo.component').then(c => c.EditTodoComponent),
    data: { animation: 'AddPage' }
  },
  {
    path: ERoute.List,
    loadComponent: () => import('./pages/todos/todos.component').then(c => c.TodosComponent),
    data: { animation: 'ListPage' }
  },
  {
    path: ERoute.Favorite,
    loadComponent: () => import('./pages/todos/todos.component').then(c => c.TodosComponent),
    data: { animation: 'FavoritePage' }
  }
];

import { FormControl } from '@angular/forms';

export enum EToDoKey {
  Id = 'id',
  Title = 'title',
  ExpirationDate = 'expirationDate',
  ExpirationTime = 'expirationTime',
  CreatedAt = 'createdAt',
  Favorite = 'favorite',
  TimeLeft = 'timeLeft',
  Action = 'action'
}

export interface ITodo {
  [EToDoKey.Id]: string;
  [EToDoKey.Title]: string;
  [EToDoKey.ExpirationDate]: string;
  [EToDoKey.ExpirationTime]?: string;
  [EToDoKey.CreatedAt]: string;
  [EToDoKey.Favorite]: boolean;
}

export type TTodoFormControls = {
  [K in keyof ITodo]: FormControl<ITodo[K]>;
};

export type TAddTodoFormControls = Omit<TTodoFormControls, EToDoKey.Id | EToDoKey.CreatedAt | EToDoKey.Favorite>;

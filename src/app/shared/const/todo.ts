import { JSONSchema } from '@ngx-pwa/local-storage';
import { EToDoKey } from '../../models/todo';

export const TODO_SCHEMA: JSONSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      [EToDoKey.Id]: { type: 'string' },
      [EToDoKey.Title]: { type: 'string' },
      [EToDoKey.ExpirationDate]: { type: 'string' },
      [EToDoKey.ExpirationTime]: { type: 'string' },
      [EToDoKey.CreatedAt]: { type: 'string' },
      [EToDoKey.Favorite]: { type: 'boolean' },
    },
    required: [
      EToDoKey.Id,
      EToDoKey.Title,
      EToDoKey.ExpirationDate,
      EToDoKey.CreatedAt,
      EToDoKey.Favorite,
    ],
  }
};

export const TODOS_KEY = 'todos';

import { IMenu } from '../../models/menu';
import { ERoute } from '../../models/route';

export const MENU: IMenu[] = [
  {
    title: 'List',
    path: ERoute.List,
  },
  {
    title: 'Favorite TODO list',
    path: ERoute.Favorite,
  },
  {
    title: 'Add',
    path: ERoute.Add,
  }
];

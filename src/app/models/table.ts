export interface ITableHeader<T> {
  key: T;
  title: string;
  sortable: boolean;
  maxWidth?: string;
  cols: number;
  rows: number;
}

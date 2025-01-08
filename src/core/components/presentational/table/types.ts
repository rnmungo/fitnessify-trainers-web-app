export interface ColumnDefinition<T> {
  field: keyof T;
  headerName: string;
  width: number | string;
  align?: 'left' | 'right' | 'center';
  render?: (row: T, value: any) => React.ReactNode;
  defaultValue?: string;
};

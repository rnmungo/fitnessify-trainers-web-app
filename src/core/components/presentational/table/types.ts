export interface ColumnDefinition<T> {
  field: keyof T;
  headerName: string;
  width: number | string;
  align?: 'left' | 'right' | 'center';
  render?: (row: T, value: any, translate?: (text: string, data?: any) => string, locale?: string) => React.ReactNode;
  defaultValue?: string;
};

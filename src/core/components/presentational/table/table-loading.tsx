import MuiSkeleton from '@mui/material/Skeleton';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import { useTranslation } from '@/core/i18n/context';

import type { ColumnDefinition } from './types';

interface TableLoadingProps<T> {
  columns: Array<ColumnDefinition<T>>;
  rowsPerPage: number;
}

const TableLoading = <T,>({ columns, rowsPerPage }: TableLoadingProps<T>) => {
  const { t } = useTranslation();

  return (
    <MuiTable>
      <MuiTableHead>
        <MuiTableRow>
          {columns.map((column) => (
            <MuiTableCell
              key={column.field as string}
              align={column.align}
              padding="normal"
            >
              {t(column.headerName)}
            </MuiTableCell>
          ))}
          <MuiTableCell align="center" padding="normal">
            {t('common.table.actions')}
          </MuiTableCell>
        </MuiTableRow>
      </MuiTableHead>
      <MuiTableBody>
        {Array.from({ length: rowsPerPage }).map((_, index) => (
          <MuiTableRow key={index} style={{ height: 47 }}>
            {columns.map((column) => (
              <MuiTableCell key={column.field as string}>
                <MuiSkeleton variant="text" />
              </MuiTableCell>
            ))}
            <MuiTableCell align="center">
              <MuiSkeleton variant="text" />
            </MuiTableCell>
          </MuiTableRow>
        ))}
      </MuiTableBody>
    </MuiTable>
  );
};

export default TableLoading;

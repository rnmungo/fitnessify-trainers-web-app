import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiPaper from '@mui/material/Paper';
import MuiSkeleton from '@mui/material/Skeleton';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTablePagination from '@mui/material/TablePagination';
import MuiTableRow from '@mui/material/TableRow';
import MuiTextField from '@mui/material/TextField';
import MuiToolbar from '@mui/material/Toolbar';
import MuiTypography from '@mui/material/Typography';
import { useTranslation } from '@/core/i18n/context';
import Menu from '@/core/components/presentational/menu';
import { TableLoading } from '@/core/components/presentational/table';
import useQuerySearchUsers from '../../../hooks/useQuerySearchUsers';

import type { User } from '@/types/user';
import type { ColumnDefinition } from '@/core/components/presentational/table/types';

const columns: Array<ColumnDefinition<User>> = [
  { field: 'name', headerName: 'users-page.table-columns.name', width: 150 },
  { field: 'lastName', headerName: 'users-page.table-columns.last-name', width: 150 },
  { field: 'email', headerName: 'users-page.table-columns.email', defaultValue: '-', width: 'auto' },
];

const ROWS_LIMIT = 10;
const ROW_HEIGHT_LARGE = 47;

interface UsersTableProps {
  rowsPerPage?: number;
}

const BaseTable = ({ children }: { children: React.ReactNode; }) => {
  const { t } = useTranslation();

  return (
    <MuiTable
      sx={{ minWidth: 750 }}
      aria-labelledby={t('users-page.table.name')}
      size="small"
    >
      <MuiTableHead>
        <MuiTableRow>
          {columns.map(column => (
            <MuiTableCell
              key={column.field}
              align={column.align}
              padding="normal"
              sx={{ width: column.width }}
            >
              {t(column.headerName)}
            </MuiTableCell>
          ))}
          <MuiTableCell align="center" padding="normal" sx={{ width: 'auto' }}>
            {t('common.table.actions')}
          </MuiTableCell>
        </MuiTableRow>
      </MuiTableHead>
      <MuiTableBody>
        {children}
      </MuiTableBody>
    </MuiTable>
  );
};

const UsersTable = ({ rowsPerPage = ROWS_LIMIT }: UsersTableProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, status, refetch, filtersState, setFiltersState } = useQuerySearchUsers({ page: '1', pageSize: `${rowsPerPage}` });

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setFiltersState((prevState) => ({ ...prevState, page: `${newPage}` }));
  }, [setFiltersState]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltersState((prevState) => ({ ...prevState, email: event.target.value }));
  }, [setFiltersState]);

  const users = data?.results || [];
  const page = Number(filtersState?.page || 1) - 1;
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const renderTable = () => {
    if (status === 'pending') {
      return <TableLoading columns={columns} rowsPerPage={rowsPerPage} />;
    }

    if (status === 'error') {
      return (
        <BaseTable>
          <MuiTableRow
            style={{
              height: rowsPerPage * ROW_HEIGHT_LARGE,
            }}
          >
            <MuiTableCell colSpan={columns.length + 1} align="center">
              <MuiAlert severity="error" action={
                <MuiButton color="inherit" size="small" onClick={() => refetch()}>
                  {t('common.wordings.retry')}
                </MuiButton>
              }>
                {t('users-page.table.error.message')}
              </MuiAlert>
            </MuiTableCell>
          </MuiTableRow>
        </BaseTable>
      );
    }

    if (status === 'success' && users.length === 0) {
      return (
        <BaseTable>
          <MuiTableRow
            style={{
              height: rowsPerPage * ROW_HEIGHT_LARGE,
            }}
          >
            <MuiTableCell colSpan={columns.length + 1} align="center">
              <MuiTypography variant="h6">
                {t('users-page.table.empty.message')}
              </MuiTypography>
            </MuiTableCell>
          </MuiTableRow>
        </BaseTable>
      );
    }

    return (
      <BaseTable>
        {users &&
          users
            .map((row: User) => (
              <MuiTableRow
                key={row.id}
                hover
                tabIndex={-1}
              >
                {columns.map(column => {
                  const value = row[column.field] || column.defaultValue || '';

                  return (
                    <MuiTableCell
                      key={`${column.field}-${row[column.field]}`}
                      align={column.align || 'left'}
                      padding="normal"
                      sx={{ width: column.width }}
                    >
                      {column.render ? column.render(row, value) : value}
                    </MuiTableCell>
                  );
                })}
                <MuiTableCell align="center">
                  <Menu
                    aria-label={t('users-page.table-actions.menu-title', row)}
                    color="primary"
                    size="small"
                    options={[
                      {
                        label: t('users-page.table-actions.edit'),
                        onClick: () => {
                          router.push(`/users/${row.id}`);
                        },
                      },
                    ]}
                  />
                </MuiTableCell>
              </MuiTableRow>
            ))}
        {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, index) => (
          <MuiTableRow
            key={index}
            style={{
              height: ROW_HEIGHT_LARGE,
            }}
          >
            <MuiTableCell
              colSpan={columns.length + 1}
            />
          </MuiTableRow>
        ))}
      </BaseTable>
    );
  };

  const renderPagination = () => {
    if (status === 'pending') {
      return (
        <MuiSkeleton
          variant="rectangular"
          sx={{ minWidth: 750 }}
          height={53}
        />
      );
    }

    return (
      <MuiTablePagination
        component="div"
        count={data?.total || 0}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
        page={page}
        onPageChange={handleChangePage}
        labelDisplayedRows={({ from, to, count }) => {
          const total = count !== -1 ? count : t('common.table.more-pages', { to });

          return t('common.table.pagination', { from, to, total });
        }}
        labelRowsPerPage={t('common.table.rows-per-page')}
        slotProps={{
          actions: {
            previousButton: {
              'aria-label': t('common.table.previous-page'),
              title: t('common.table.previous-page')
            },
            nextButton: {
              'aria-label': t('common.table.next-page'),
              title: t('common.table.next-page')
            }
          }
        }}
      />
    );
  }

  return (
    <>
      <MuiBox sx={{ height: 400, width: '100%' }}>
        <MuiPaper sx={{ width: '100%' }}>
          <MuiToolbar
            sx={{ justifyContent: 'space-between' }}
            style={{
              paddingRight: '16px',
              paddingLeft: '16px'
            }}
            variant="regular"
          >
            <MuiTypography
              component="p"
              variant="h6"
              sx={{ fontWeight: 'normal' }}
            >
              {t('users-page.table.name')}
            </MuiTypography>
            <MuiTextField
              id="email-field"
              label={t('users-page.fields.email')}
              variant="standard"
              sx={{ minWidth: 200 }}
              onChange={handleChange}
            />
          </MuiToolbar>
          <MuiTableContainer>
            {renderTable()}
          </MuiTableContainer>
          {renderPagination()}
        </MuiPaper>
      </MuiBox>
    </>
  );
}

export default UsersTable;

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
import Menu from '@/core/components/presentational/menu';
import { TableLoading } from '@/core/components/presentational/table';
import useQuerySearchUsers from '../../../hooks/useQuerySearchUsers';

import type { User } from '@/types/user';
import type { ColumnDefinition } from '@/core/components/presentational/table/types';

const columns: Array<ColumnDefinition<User>> = [
  { field: 'name', headerName: 'Nombre', width: 150 },
  { field: 'lastName', headerName: 'Apellido', width: 150 },
  { field: 'email', headerName: 'Email', defaultValue: '-', width: 'auto' },
];

const ROWS_LIMIT = 10;
const ROW_HEIGHT_LARGE = 47;

interface UsersTableProps {
  rowsPerPage?: number;
}

const BaseTable = ({ children }: { children: React.ReactNode; }) => (
  <MuiTable
    sx={{ minWidth: 750 }}
    aria-labelledby="Usuarios"
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
            {column.headerName}
          </MuiTableCell>
        ))}
        <MuiTableCell align="center" padding="normal">
          Acciones
        </MuiTableCell>
      </MuiTableRow>
    </MuiTableHead>
    <MuiTableBody>
      {children}
    </MuiTableBody>
  </MuiTable>
);

const UsersTable = ({ rowsPerPage = ROWS_LIMIT }: UsersTableProps) => {
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
                  REINTENTAR
                </MuiButton>
              }>
                Hubo un error al cargar los usuarios. Por favor, pruebe con reintentar la búsqueda.
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
                No se encontraron usuarios.
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
                    aria-label={`Opciones para ${row.name} ${row.lastName}`}
                    color="primary"
                    size="small"
                    options={[
                      {
                        label: 'Editar',
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
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        labelRowsPerPage="Filas por página:"
        slotProps={{
          actions: {
            previousButton: {
              'aria-label': 'Ir a la página anterior',
              title: 'Ir a la página anterior'
            },
            nextButton: {
              'aria-label': 'Ir a la página siguiente',
              title: 'Ir a la página siguiente'
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
              Usuarios
            </MuiTypography>
            <MuiTextField
              id="email-field"
              label="Email"
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

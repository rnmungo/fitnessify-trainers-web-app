import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import MuiAddCircleIcon from '@mui/icons-material/AddCircle';
import MuiAlert from '@mui/material/Alert';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiIconButton from '@mui/material/IconButton';
import MuiPaper from '@mui/material/Paper';
import MuiSkeleton from '@mui/material/Skeleton';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTablePagination from '@mui/material/TablePagination';
import MuiTableRow from '@mui/material/TableRow';
import MuiToolbar from '@mui/material/Toolbar';
import MuiTooltip from '@mui/material/Tooltip';
import MuiTypography from '@mui/material/Typography';
import DeleteExerciseDialog from './delete-exercise-dialog';
import Menu from '../../../../components/presentational/menu';
import { TableLoading } from '../../../../components/presentational/table';
import { ChipCollapsed } from '../../../../components/presentational/chip';
import useQueryExercises from '../../../hooks/useQueryExercises';

import type { Exercise, MuscleGroup } from '@/types/exercise';
import type { ColumnDefinition } from '../../../../components/presentational/table/types';

const columns: Array<ColumnDefinition<Exercise>> = [
  { field: 'name', headerName: 'Nombre', width: 200 },
  { field: 'description', headerName: 'Descripción', defaultValue: '-', width: 'auto' },
  {
    field: 'muscleGroups',
    headerName: 'Grupos musculares',
    width: 200,
    render: (_, value): React.ReactNode => {
      const muscleGroups = value as Array<MuscleGroup>;
      return (
        <ChipCollapsed
          items={muscleGroups.map(muscleGroup => ({
            id: muscleGroup.id,
            label: muscleGroup.name,
          }))}
          maxVisibleItems={2}
        />
      );
    },
  },
];

const ROWS_LIMIT = 10;
const ROW_HEIGHT_LARGE = 47;

interface ExercisesTableProps {
  rowsPerPage?: number;
}

const BaseTable = ({ children }: { children: React.ReactNode; }) => (
  <MuiTable
    sx={{ minWidth: 750 }}
    aria-labelledby="Ejercicios"
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

const ExercisesTable = ({ rowsPerPage = ROWS_LIMIT }: ExercisesTableProps) => {
  const [pageState, setPageState] = useState(0);
  const [selectedExerciseState, setSelectedExerciseState] = useState<Exercise | null>();
  const [openState, setOpenState] = useState<boolean>(false);
  const router = useRouter();
  const { data, status, refetch } = useQueryExercises();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPageState(newPage);
  };

  const emptyRows =
    pageState > 0 ? Math.max(0, (1 + pageState) * rowsPerPage - (data?.length || 0)) : 0;

  const handleClose = useCallback((_?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason && ['backdropClick', 'escapeKeyDown'].includes(reason)) {
      return;
    }

    setOpenState(false);
    setSelectedExerciseState(null);
  }, []);

  const handleDelete = useCallback(() => {
    refetch();
  }, [refetch]);

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
                Hubo un error al cargar los ejercicios. Por favor, pruebe con reintentar la búsqueda.
              </MuiAlert>
            </MuiTableCell>
          </MuiTableRow>
        </BaseTable>
      );
    }

    if (status === 'success' && data.length === 0) {
      return (
        <BaseTable>
          <MuiTableRow
            style={{
              height: rowsPerPage * ROW_HEIGHT_LARGE,
            }}
          >
            <MuiTableCell colSpan={columns.length + 1} align="center">
              <MuiTypography variant="h6">
                No se encontraron ejercicios.
              </MuiTypography>
            </MuiTableCell>
          </MuiTableRow>
        </BaseTable>
      );
    }

    return (
      <BaseTable>
        {data &&
          data
            .slice(
              pageState * rowsPerPage,
              pageState * rowsPerPage + rowsPerPage
            )
            .map(row => (
              <MuiTableRow
                key={row.id}
                hover
                tabIndex={-1}
              >
                {columns.map(column => {
                  const value = row[column.field] || column.defaultValue || '';

                  if (Array.isArray(value)) {
                    if (column.render && column.field === 'muscleGroups') {
                      return (
                        <MuiTableCell
                          key={`${column.field}-${row[column.field]}`}
                          align={column.align || 'left'}
                          padding="normal"
                          sx={{ width: column.width }}
                        >
                          {column.render(row, value)}
                        </MuiTableCell>
                      );
                    }

                    return null;
                  }

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
                    aria-label={`Opciones para ${row.name}`}
                    color="primary"
                    size="small"
                    options={[
                      {
                        label: 'Editar',
                        onClick: () => {
                          router.push(`/exercises/${row.id}`);
                        },
                      },
                      {
                        label: 'Eliminar',
                        onClick: () => {
                          setSelectedExerciseState(row);
                          setOpenState(true);
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
        count={data?.length || 0}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
        page={pageState}
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
            sx={{ gap: 1 }}
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
              Ejercicios
            </MuiTypography>
            <MuiTooltip title="Nuevo ejercicio">
              <MuiIconButton
                size="small"
                color="primary"
                onClick={() => {
                  router.push('/exercises/new-exercise');
                }}
              >
                <MuiAddCircleIcon />
              </MuiIconButton>
            </MuiTooltip>
          </MuiToolbar>
          <MuiTableContainer>
            {renderTable()}
          </MuiTableContainer>
          {renderPagination()}
        </MuiPaper>
      </MuiBox>
      <DeleteExerciseDialog
        open={openState}
        onClose={handleClose}
        exercise={selectedExerciseState}
        onExerciseDeleted={handleDelete}
      />
    </>
  );
}

export default ExercisesTable;

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import MuiAddCircleIcon from '@mui/icons-material/AddCircle';
import MuiAlert from '@mui/material/Alert';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiChip from '@mui/material/Chip';
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
import { formatCompleteDate } from '@/utilities/dateUtils';
import {
  getEquipmentTranslation,
  getLevelIcon,
  getLevelTranslation,
  getStatusTranslation,
  getColorByLevel,
  getColorByStatus,
} from '../../../utilities/routineUtils';
import Menu from '../../../../components/presentational/menu';
import { TableLoading } from '../../../../components/presentational/table';
import useQueryRoutines from '../../../hooks/useQueryRoutines';
import ActivateRoutineDialog from './activate-routine-dialog';
import DeactivateRoutineDialog from './deactivate-routine-dialog';
import DeleteRoutineDialog from './delete-routine-dialog';

import type { Routine } from '@/types/routine';
import type { ColumnDefinition } from '../../../../components/presentational/table/types';

const columns: Array<ColumnDefinition<Routine>> = [
  {
    field: 'name',
    headerName: 'Nombre',
    width: 'auto',
    render: (row): React.ReactNode => (
      <>
        <MuiTypography variant="body2" gutterBottom>{row.name}</MuiTypography>
        <MuiTypography variant="caption" color="text.secondary">
          Duración: {row.duration}
        </MuiTypography>
      </>
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Fecha de creación',
    defaultValue: '-',
    width: 270,
    render: (row): React.ReactNode => {
      const formattedDate = formatCompleteDate(new Date(row.createdAt));
      const color = getColorByStatus(row.status);
      const statusTranslated = getStatusTranslation(row.status);

      return (
        <>
          <MuiTypography variant="body2" gutterBottom>{formattedDate}</MuiTypography>
          <MuiChip
            key={row.status}
            label={statusTranslated}
            size="small"
            variant="outlined"
            color={color}
          />
        </>
      );
    }
  },
  {
    field: 'equipment',
    headerName: 'Equipamiento',
    width: 200,
    render: (row): React.ReactNode => {
      const equipmentTranslated = getEquipmentTranslation(row.equipment);
      const levelTranslated = getLevelTranslation(row.level);
      const levelColor = getColorByLevel(row.level);
      const LevelIcon = getLevelIcon(row.level);

      return (
        <>
          <MuiTypography variant="body2" gutterBottom>{equipmentTranslated}</MuiTypography>
          <MuiChip
            key={levelTranslated}
            label={levelTranslated}
            icon={<LevelIcon />}
            size="small"
            variant="outlined"
            color={levelColor}
          />
        </>
      );
    },
  },
];

const ROWS_LIMIT = 10;
const ROW_HEIGHT_LARGE = 47;

interface RoutinesTableProps {
  rowsPerPage?: number;
}

const BaseTable = ({ children }: { children: React.ReactNode; }) => (
  <MuiTable
    sx={{ minWidth: 750 }}
    aria-labelledby="Rutinas"
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

const RoutinesTable = ({ rowsPerPage = ROWS_LIMIT }: RoutinesTableProps) => {
  const [pageState, setPageState] = useState(0);
  const [selectedRoutineState, setSelectedRoutineState] = useState<Routine | null>(null);
  const [openActivateState, setOpenActivateState] = useState<boolean>(false);
  const [openDeactivateState, setOpenDeactivateState] = useState<boolean>(false);
  const [openDeleteState, setOpenDeleteState] = useState<boolean>(false);
  const [openEditPlanState, setOpenEditPlanState] = useState<boolean>(false);
  const router = useRouter();
  const { data, status, refetch } = useQueryRoutines();

  const handleCloseActivate = useCallback((_?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason && ['backdropClick', 'escapeKeyDown'].includes(reason)) {
      return;
    }

    setOpenActivateState(false);
    setSelectedRoutineState(null);
  }, []);

  const handleCloseDeactivate = useCallback((_?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason && ['backdropClick', 'escapeKeyDown'].includes(reason)) {
      return;
    }

    setOpenDeactivateState(false);
    setSelectedRoutineState(null);
  }, []);

  const handleCloseDelete = useCallback((_?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason && ['backdropClick', 'escapeKeyDown'].includes(reason)) {
      return;
    }

    setOpenDeleteState(false);
    setSelectedRoutineState(null);
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPageState(newPage);
  };

  const emptyRows =
    pageState > 0 ? Math.max(0, (1 + pageState) * rowsPerPage - (data?.length || 0)) : 0;

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
                Hubo un error al cargar las rutinas. Por favor, pruebe con reintentar la búsqueda.
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
                No se encontraron rutinas.
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
            .map(row => {
              const menuItems = [
                {
                  label: 'Editar rutina',
                  onClick: () => {
                    router.push(`/routines/${row.id}`);
                  },
                },
              ];

              if (row.status === 'Draft') {
                menuItems.push({
                  label: 'Activar',
                  onClick: () => {
                    setSelectedRoutineState(row);
                    setOpenActivateState(true);
                  },
                });
              }

              if (row.status === 'Deployed') {
                menuItems.push({
                  label: 'Desactivar',
                  onClick: () => {
                    setSelectedRoutineState(row);
                    setOpenDeactivateState(true);
                  },
                });
              }

              menuItems.push({
                label: 'Editar planes',
                onClick: () => {
                  setSelectedRoutineState(row);
                  setOpenEditPlanState(true);
                },
              }, {
                label: 'Eliminar',
                onClick: () => {
                  setSelectedRoutineState(row);
                  setOpenDeleteState(true);
                },
              })

              return (
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
                      aria-label={`Opciones para ${row.name}`}
                      color="primary"
                      size="small"
                      options={menuItems}
                    />
                  </MuiTableCell>
                </MuiTableRow>
              );
            })}
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
              Rutinas
            </MuiTypography>
            <MuiTooltip title="Nueva rutina">
              <MuiIconButton
                size="small"
                color="primary"
                onClick={() => {
                  router.push('/routines/new-routine');
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
      <ActivateRoutineDialog
        routine={selectedRoutineState}
        open={openActivateState}
        onClose={handleCloseActivate}
        onRoutineActivated={refetch}
      />
      <DeactivateRoutineDialog
        routine={selectedRoutineState}
        open={openDeactivateState}
        onClose={handleCloseDeactivate}
        onRoutineDeactivated={refetch}
      />
      <DeleteRoutineDialog
        routine={selectedRoutineState}
        open={openDeleteState}
        onClose={handleCloseDelete}
        onRoutineDeleted={refetch}
      />
    </>
  );
}

export default RoutinesTable;

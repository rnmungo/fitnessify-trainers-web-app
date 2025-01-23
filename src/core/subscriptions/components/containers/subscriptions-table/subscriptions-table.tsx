import { useCallback, useState } from 'react';
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
import { useTranslation } from '@/core/i18n/context';
import { getDateLocale } from '@/core/i18n/utilities/localeUtils';
import Menu from '@/core/components/presentational/menu';
import { TableLoading } from '@/core/components/presentational/table';
import { formatCompleteDate } from '@/utilities/dateUtils';
import useQuerySubscriptions from '../../../hooks/useQuerySubscriptions';
import { getColorByStatus, getStatusTranslation } from '../../../utilities/subscriptionUtils';
import CreateSubscriptionDialog from './create-subscription-dialog';
import ActivateSubscriptionDialog from './activate-subscription-dialog';
import CancelSubscriptionDialog from './cancel-subscription-dialog';
import IncrementSubscriptionDateDialog from './increment-subscription-date-dialog';

import type { Subscription } from '@/types/subscription';
import type { ColumnDefinition } from '@/core/components/presentational/table/types';

const columns: Array<ColumnDefinition<Subscription>> = [
  { field: 'planName', headerName: 'subscriptions-page.table-columns.plan', width: 150 },
  {
    field: 'status',
    headerName: 'subscriptions-page.table-columns.status',
    width: 150,
    render: (_, value, translate): React.ReactNode => {
      const color = getColorByStatus(value);
      const statusKey = getStatusTranslation(value);
      const statusTranslated = translate ? translate(statusKey) : statusKey;

      return (
        <MuiChip
          key={value}
          label={statusTranslated}
          size="small"
          variant="outlined"
          color={color}
        />
      );
    },
  },
  {
    field: 'dueDate',
    headerName: 'subscriptions-page.table-columns.due-date',
    defaultValue: '-',
    width: 'auto',
    render: (_, value, translate, locale): React.ReactNode => {
      const dateFnsLocale = getDateLocale(locale || '');
      const formattedDate = formatCompleteDate(new Date(value), dateFnsLocale);

      return formattedDate;
    }
  },
];

const ROWS_LIMIT = 10;
const ROW_HEIGHT_LARGE = 47;

interface SubscriptionsTableProps {
  id?: string;
  rowsPerPage?: number;
}

const BaseTable = ({ children }: { children: React.ReactNode; }) => {
  const { t } = useTranslation();

  return (
    <MuiTable
      sx={{ minWidth: 750 }}
      aria-labelledby={t('subscriptions-page.table.name')}
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

const SubscriptionsTable = ({ id, rowsPerPage = ROWS_LIMIT }: SubscriptionsTableProps) => {
  const [pageState, setPageState] = useState(0);
  const [selectedSubscriptionState, setSelectedSubscriptionState] = useState<Subscription | null>();
  const [openActiveState, setOpenActiveState] = useState<boolean>(false);
  const [openCanceledState, setOpenCanceledState] = useState<boolean>(false);
  const [openIncrementState, setOpenIncrementState] = useState<boolean>(false);
  const [openCreateState, setOpenCreateState] = useState<boolean>(false);
  const { t, locale } = useTranslation();
  const { data, status, refetch } = useQuerySubscriptions(id);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPageState(newPage);
  };

  const emptyRows =
    pageState > 0 ? Math.max(0, (1 + pageState) * rowsPerPage - (data?.length || 0)) : 0;

  const handleCloseActive = useCallback((_?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason && ['backdropClick', 'escapeKeyDown'].includes(reason)) {
      return;
    }

    setOpenActiveState(false);
    setSelectedSubscriptionState(null);
  }, []);

  const handleCloseCanceled = useCallback((_?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason && ['backdropClick', 'escapeKeyDown'].includes(reason)) {
      return;
    }

    setOpenCanceledState(false);
    setSelectedSubscriptionState(null);
  }, []);

  const handleCloseIncrementDate = useCallback((_?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason && ['backdropClick', 'escapeKeyDown'].includes(reason)) {
      return;
    }

    setOpenIncrementState(false);
    setSelectedSubscriptionState(null);
  }, []);

  const handleCloseCreate = useCallback((_?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason && ['backdropClick', 'escapeKeyDown'].includes(reason)) {
      return;
    }

    setOpenCreateState(false);
  }, []);

  const handleOpenCreateSubscription = useCallback(() => {
    setOpenCreateState(true);
  }, []);

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
                {t('subscriptions-page.table.error.message')}
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
                {t('subscriptions-page.table.empty.message')}
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
              const menuItems = [];
              if (row.status !== 'Active') {
                menuItems.push({
                  label: t('subscriptions-page.table-actions.activate'),
                  onClick: () => {
                    setSelectedSubscriptionState(row);
                    setOpenActiveState(true);
                  },
                });
              }

              if (row.status !== 'Canceled') {
                menuItems.push({
                  label: t('subscriptions-page.table-actions.cancel'),
                  onClick: () => {
                    setSelectedSubscriptionState(row);
                    setOpenCanceledState(true);
                  },
                });
              }

              menuItems.push({
                label: t('subscriptions-page.table-actions.edit'),
                onClick: () => {
                  setSelectedSubscriptionState(row);
                  setOpenIncrementState(true);
                },
              });

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
                        {column.render ? column.render(row, value, t, locale) : value}
                      </MuiTableCell>
                    );
                  })}
                  <MuiTableCell align="center">
                    <Menu
                      aria-label={t('subscriptions-page.table-actions.menu-title', row)}
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
              {t('subscriptions-page.table.name')}
            </MuiTypography>
            <MuiTooltip title={t('subscriptions-page.table.tooltip')}>
              <MuiIconButton
                aria-label={t('subscriptions-page.table.tooltip')}
                size="small"
                color="primary"
                onClick={handleOpenCreateSubscription}
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
      <CreateSubscriptionDialog
        userTenantId={id}
        open={openCreateState}
        onClose={handleCloseCreate}
        onSubscriptionCreated={refetch}
      />
      <ActivateSubscriptionDialog
        subscription={selectedSubscriptionState}
        open={openActiveState}
        onClose={handleCloseActive}
        onSubscriptionActivated={refetch}
      />
      <CancelSubscriptionDialog
        subscription={selectedSubscriptionState}
        open={openCanceledState}
        onClose={handleCloseCanceled}
        onSubscriptionCanceled={refetch}
      />
      <IncrementSubscriptionDateDialog
        subscription={selectedSubscriptionState}
        open={openIncrementState}
        onClose={handleCloseIncrementDate}
        onSubscriptionUpdated={refetch}
      />
    </>
  );
}

export default SubscriptionsTable;

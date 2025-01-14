import { useEffect, useCallback, useState } from 'react';
import { AxiosError } from 'axios';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import MuiButton from '@mui/material/Button';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogContentText from '@mui/material/DialogContentText';
import MuiDialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import MuiStack from '@mui/material/Stack';
import { useSnackbar } from '@/core/context/snackbar';
import useMutationIncrementDueDateSubscription from '../../../../hooks/useMutationIncrementDueDateSubscription';
import type { Subscription } from '@/types/subscription';

interface IncrementSubscriptionDateDialogProps {
  subscription?: Subscription | null;
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  onSubscriptionUpdated?: () => void;
}

const IncrementSubscriptionDateDialog: React.FC<IncrementSubscriptionDateDialogProps> = ({
  subscription,
  open = false,
  onClose,
  onSubscriptionUpdated,
}) => {
  const [dateState, setDateState] = useState<Date | null>(null);
  const snackbar = useSnackbar();
  const incrementSubscriptionDate = useMutationIncrementDueDateSubscription();

  const calculateDaysDifference = useCallback((date: Date | null): number => {
    if (!date) return 0;

    const presetDate = subscription?.dueDate ? new Date(subscription.dueDate) : new Date();
    return differenceInDays(date, presetDate);
  }, [subscription?.dueDate]);

  const handleChange = (date: Date | null) => {
    setDateState(date);
  };

  useEffect(() => {
    if (!dateState && subscription?.dueDate) {
      setDateState(new Date(subscription.dueDate));
    }


    return () => {};
  }, [dateState, subscription]);

  useEffect(() => {
    if (incrementSubscriptionDate.status === 'success') {
      snackbar.success('La subscripción ha sido actualizada correctamente.');
      incrementSubscriptionDate.reset();

      if (onSubscriptionUpdated) {
        onSubscriptionUpdated();
        onClose();
      }
    }

    if (incrementSubscriptionDate.status === 'error') {
      const error = incrementSubscriptionDate.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      incrementSubscriptionDate.reset();
    }
  }, [incrementSubscriptionDate, snackbar, onSubscriptionUpdated, onClose]);

  const handleConfirm = useCallback(() => {
    if (!dateState) {
      snackbar.caution('Debe seleccionar una fecha');
      return;
    }

    const presetDate = subscription?.dueDate ? new Date(subscription.dueDate) : new Date();
    if (dateState < presetDate) {
      snackbar.caution('Debe seleccionar una fecha posterior al vencimiento');
      return;
    }

    if (subscription) {
      const days = calculateDaysDifference(dateState);
      incrementSubscriptionDate.mutate({ id: subscription.id, days });
    }
  }, [dateState, subscription, snackbar, calculateDaysDifference, incrementSubscriptionDate]);

  const isPending = incrementSubscriptionDate.status === 'pending';

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      keepMounted
      aria-labelledby="increment-subscription-date-dialog-title"
      aria-describedby="increment-subscription-date-dialog-description"
    >
      <MuiDialogTitle id="increment-subscription-date-dialog-title">
        Incrementar vencimiento
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="increment-subscription-date-dialog-description">
          Seleccione una fecha para actualizar el vencimiento de la subscripción
        </MuiDialogContentText>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <MuiStack spacing={3} alignItems="center" justifyContent="center" sx={{ mt: 5 }}>
            <DatePicker
              label="Fecha"
              shouldDisableDate={(date) => {
                const presetDate = subscription?.dueDate ? new Date(subscription.dueDate) : new Date();
                return date < presetDate;
              }}
              slotProps={{
                textField: {
                  helperText: 'Ingresá al fecha en formato DD/MM/YYYY',
                },
              }}
              value={dateState}
              onChange={handleChange}
            />
          </MuiStack>
        </LocalizationProvider>
      </MuiDialogContent>
      <MuiDialogActions>
        <MuiButton onClick={onClose} color="inherit" disabled={isPending}>
          Cancelar
        </MuiButton>
        <MuiLoadingButton
          color="info"
          loading={isPending}
          loadingIndicator="Guardando..."
          variant="contained"
          onClick={handleConfirm}
        >
          Guardar
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default IncrementSubscriptionDateDialog;

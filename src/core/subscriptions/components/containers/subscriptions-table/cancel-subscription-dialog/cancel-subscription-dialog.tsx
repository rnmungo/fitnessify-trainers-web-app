import { useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import MuiButton from '@mui/material/Button';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogContentText from '@mui/material/DialogContentText';
import MuiDialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from '@/core/context/snackbar';
import useMutationCancelSubscription from '../../../../hooks/useMutationCancelSubscription';
import type { Subscription } from '@/types/subscription';

interface CancelSubscriptionDialogProps {
  subscription?: Subscription | null;
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  onSubscriptionCanceled?: () => void;
}

const CancelSubscriptionDialog: React.FC<CancelSubscriptionDialogProps> = ({
  subscription,
  open = false,
  onClose,
  onSubscriptionCanceled,
}) => {
  const snackbar = useSnackbar();
  const cancelSubscription = useMutationCancelSubscription();

  useEffect(() => {
    if (cancelSubscription.status === 'success') {
      snackbar.success('La subscripción ha sido cancelada correctamente.');
      cancelSubscription.reset();

      if (onSubscriptionCanceled) {
        onSubscriptionCanceled();
        onClose();
      }
    }

    if (cancelSubscription.status === 'error') {
      const error = cancelSubscription.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      cancelSubscription.reset();
    }
  }, [cancelSubscription, snackbar, onSubscriptionCanceled, onClose]);

  const handleConfirm = useCallback(() => {
    if (subscription) {
      cancelSubscription.mutate({ id: subscription.id });
    }
  }, [subscription, cancelSubscription]);

  const isPending = cancelSubscription.status === 'pending';

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      keepMounted
      slotProps={{ backdrop: { onClick: (e) => e.stopPropagation() } }}
      aria-labelledby="cancel-subscription-dialog-title"
      aria-describedby="cancel-subscription-dialog-description"
    >
      <MuiDialogTitle id="cancel-subscription-dialog-title">
        Cancelar subscripción
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="cancel-subscription-dialog-description">
          ¿Estás seguro que deseas cancelar la subscripción del plan <strong>{subscription?.planName}</strong>?
        </MuiDialogContentText>
      </MuiDialogContent>
      <MuiDialogActions>
        <MuiButton onClick={onClose} color="inherit" disabled={isPending}>
          Cancelar
        </MuiButton>
        <MuiLoadingButton
          color="info"
          loading={isPending}
          loadingIndicator="Cancelando..."
          variant="contained"
          onClick={handleConfirm}
        >
          Confirmar
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default CancelSubscriptionDialog;

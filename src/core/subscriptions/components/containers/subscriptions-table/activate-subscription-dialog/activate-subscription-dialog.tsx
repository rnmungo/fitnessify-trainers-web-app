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
import useMutationActivateSubscription from '../../../../hooks/useMutationActivateSubscription';
import type { Subscription } from '@/types/subscription';

interface ActivateSubscriptionDialogProps {
  subscription?: Subscription | null;
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  onSubscriptionActivated?: () => void;
}

const ActivateSubscriptionDialog: React.FC<ActivateSubscriptionDialogProps> = ({
  subscription,
  open = false,
  onClose,
  onSubscriptionActivated,
}) => {
  const snackbar = useSnackbar();
  const activateSubscription = useMutationActivateSubscription();

  useEffect(() => {
    if (activateSubscription.status === 'success') {
      snackbar.success('La subscripción ha sido activada correctamente.');
      activateSubscription.reset();

      if (onSubscriptionActivated) {
        onSubscriptionActivated();
        onClose();
      }
    }

    if (activateSubscription.status === 'error') {
      const error = activateSubscription.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      activateSubscription.reset();
    }
  }, [activateSubscription, snackbar, onSubscriptionActivated, onClose]);

  const handleConfirm = useCallback(() => {
    if (subscription) {
      activateSubscription.mutate({ id: subscription.id });
    }
  }, [subscription, activateSubscription]);

  const isPending = activateSubscription.status === 'pending';

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      keepMounted
      aria-labelledby="activate-subscription-dialog-title"
      aria-describedby="activate-subscription-dialog-description"
    >
      <MuiDialogTitle id="activate-subscription-dialog-title">
        Activar subscripción
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="activate-subscription-dialog-description">
          ¿Estás seguro que deseas activar la subscripción del plan <strong>{subscription?.planName}</strong>?
        </MuiDialogContentText>
      </MuiDialogContent>
      <MuiDialogActions>
        <MuiButton onClick={onClose} color="inherit" disabled={isPending}>
          Cancelar
        </MuiButton>
        <MuiLoadingButton
          color="info"
          loading={isPending}
          loadingIndicator="Activando..."
          variant="contained"
          onClick={handleConfirm}
        >
          Confirmar
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default ActivateSubscriptionDialog;

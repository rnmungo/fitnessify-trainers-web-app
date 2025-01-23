import { useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import MuiButton from '@mui/material/Button';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogContentText from '@mui/material/DialogContentText';
import MuiDialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from '@/core/i18n/context';
import { useSnackbar } from '@/core/context/snackbar';
import useMutationActivateSubscription from '../../../../hooks/useMutationActivateSubscription';
import type { Subscription } from '@/types/subscription';

interface ActivateSubscriptionDialogProps {
  subscription?: Subscription | null;
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  onSubscriptionActivated?: () => void;
}

const ActivateSubscriptionDialog = ({
  subscription,
  open = false,
  onClose,
  onSubscriptionActivated,
}: ActivateSubscriptionDialogProps) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const activateSubscription = useMutationActivateSubscription();

  useEffect(() => {
    if (activateSubscription.status === 'success') {
      snackbar.success(t('subscriptions-page.actions.activate.mutation.success'));
      activateSubscription.reset();

      if (onSubscriptionActivated) {
        onSubscriptionActivated();
        onClose();
      }
    }

    if (activateSubscription.status === 'error') {
      const error = activateSubscription.error as AxiosError;
      const errorMessage = (error.response?.data as { message?: string })?.message || error.message;
      snackbar.error(t(errorMessage));
      activateSubscription.reset();
    }
  }, [activateSubscription, snackbar, onSubscriptionActivated, onClose, t]);

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
        {t('subscriptions-page.actions.activate.dialog-title')}
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="activate-subscription-dialog-description">
          {t('subscriptions-page.actions.activate.query')} <strong>{subscription?.planName}</strong>?
        </MuiDialogContentText>
      </MuiDialogContent>
      <MuiDialogActions>
        <MuiButton
          aria-label={t('common.wordings.cancel')}
          onClick={onClose}
          color="inherit"
          disabled={isPending}
        >
          {t('common.wordings.cancel')}
        </MuiButton>
        <MuiLoadingButton
          color="info"
          loading={isPending}
          loadingIndicator={t('common.wordings.activating')}
          variant="contained"
          onClick={handleConfirm}
        >
          {t('common.wordings.confirm')}
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default ActivateSubscriptionDialog;

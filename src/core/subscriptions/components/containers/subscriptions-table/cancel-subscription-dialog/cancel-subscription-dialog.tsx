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
import useMutationCancelSubscription from '../../../../hooks/useMutationCancelSubscription';
import type { Subscription } from '@/types/subscription';

interface CancelSubscriptionDialogProps {
  subscription?: Subscription | null;
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  onSubscriptionCanceled?: () => void;
}

const CancelSubscriptionDialog = ({
  subscription,
  open = false,
  onClose,
  onSubscriptionCanceled,
}: CancelSubscriptionDialogProps) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const cancelSubscription = useMutationCancelSubscription();

  useEffect(() => {
    if (cancelSubscription.status === 'success') {
      snackbar.success(t('subscriptions-page.actions.cancel.mutation.success'));
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
  }, [cancelSubscription, snackbar, onSubscriptionCanceled, onClose, t]);

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
        {t('subscriptions-page.actions.cancel.dialog-title')}
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="cancel-subscription-dialog-description">
          {t('subscriptions-page.actions.cancel.query')} <strong>{subscription?.planName}</strong>?
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
          loadingIndicator={t('common.wordings.canceling')}
          variant="contained"
          onClick={handleConfirm}
        >
          {t('common.wordings.confirm')}
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default CancelSubscriptionDialog;

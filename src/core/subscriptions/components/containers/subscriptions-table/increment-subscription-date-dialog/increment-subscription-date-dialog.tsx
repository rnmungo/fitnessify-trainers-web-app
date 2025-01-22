import { useEffect, useCallback, useState } from 'react';
import { AxiosError } from 'axios';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import MuiButton from '@mui/material/Button';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogContentText from '@mui/material/DialogContentText';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiStack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { differenceInDays } from 'date-fns';
import { getDateLocale } from '@/core/i18n/utilities/localeUtils';
import { useTranslation } from '@/core/i18n/context';
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
  const { t, locale } = useTranslation();
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
      snackbar.success(t('subscriptions-page.actions.update.mutation.success'));
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
  }, [incrementSubscriptionDate, snackbar, onSubscriptionUpdated, onClose, t]);

  const handleConfirm = useCallback(() => {
    if (!dateState) {
      snackbar.caution(t('subscriptions-page.validations.date-required'));
      return;
    }

    const presetDate = subscription?.dueDate ? new Date(subscription.dueDate) : new Date();
    if (dateState < presetDate) {
      snackbar.caution(t('subscriptions-page.validations.date-after-expiration'));
      return;
    }

    if (subscription) {
      const days = calculateDaysDifference(dateState);
      incrementSubscriptionDate.mutate({ id: subscription.id, days });
    }
  }, [dateState, subscription, snackbar, calculateDaysDifference, incrementSubscriptionDate, t]);

  const isPending = incrementSubscriptionDate.status === 'pending';

  const dateLocale = getDateLocale(locale);

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      keepMounted
      aria-labelledby="increment-subscription-date-dialog-title"
      aria-describedby="increment-subscription-date-dialog-description"
    >
      <MuiDialogTitle id="increment-subscription-date-dialog-title">
        {t('subscriptions-page.actions.update.dialog-title')}
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="increment-subscription-date-dialog-description">
          {t('subscriptions-page.actions.update.dialog-subtitle')}
        </MuiDialogContentText>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateLocale}>
          <MuiStack spacing={3} alignItems="center" justifyContent="center" sx={{ mt: 5 }}>
            <DatePicker
              label={t('subscriptions-page.fields.date')}
              shouldDisableDate={(date) => {
                const presetDate = subscription?.dueDate ? new Date(subscription.dueDate) : new Date();
                return date < presetDate;
              }}
              slotProps={{
                textField: {
                  helperText: t('subscriptions-page.actions.update.expire-date-helper'),
                },
              }}
              value={dateState}
              onChange={handleChange}
            />
          </MuiStack>
        </LocalizationProvider>
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
          loadingIndicator={t('common.wordings.saving')}
          variant="contained"
          onClick={handleConfirm}
        >
          {t('common.wordings.save')}
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default IncrementSubscriptionDateDialog;

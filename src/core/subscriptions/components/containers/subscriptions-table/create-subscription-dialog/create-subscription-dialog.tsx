import { MouseEvent, useEffect, useCallback, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import MuiButton from '@mui/material/Button';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogContentText from '@mui/material/DialogContentText';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiIconButton from '@mui/material/IconButton';
import MuiInputLabel from '@mui/material/InputLabel';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiFormControl from '@mui/material/FormControl';
import MuiFormHelperText from '@mui/material/FormHelperText';
import MuiSelect, { SelectChangeEvent as MuiSelectChangeEvent } from '@mui/material/Select';
import MuiRefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from '@/core/i18n/context';
import { useSnackbar } from '@/core/context/snackbar';
import useMutationCreateSubscription from '../../../../hooks/useMutationCreateSubscription';
import useQueryPlans from '../../../../hooks/useQueryPlans';
import type { Plan } from '@/types/plan';

interface CreateSubscriptionDialogProps {
  userTenantId?: string;
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  onSubscriptionCreated?: () => void;
}

const CreateSubscriptionDialog = ({
  userTenantId,
  open = false,
  onClose,
  onSubscriptionCreated,
}: CreateSubscriptionDialogProps) => {
  const [selectedPlanState, setSelectedPlanState] = useState<string>('');
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const createSubscription = useMutationCreateSubscription();
  const { data: plans, status, refetch } = useQueryPlans();

  const handleChange = useCallback((event: MuiSelectChangeEvent) => {
    setSelectedPlanState(event.target.value);
  }, []);

  const handleMouseDown = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }, []);

  const handleRefetch = () => {
    refetch();
  };

  useEffect(() => {
    if (createSubscription.status === 'success') {
      snackbar.success(t('subscriptions-page.actions.create.mutation.success'));
      createSubscription.reset();

      if (onSubscriptionCreated) {
        onSubscriptionCreated();
        onClose();
      }
    }

    if (createSubscription.status === 'error') {
      const error = createSubscription.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      createSubscription.reset();
    }
  }, [createSubscription, snackbar, onSubscriptionCreated, onClose, t]);

  const handleSave = useCallback(() => {
    if (!userTenantId) {
      snackbar.caution(t('subscriptions-page.validations.user-required'));
      return;
    }

    if (!selectedPlanState) {
      snackbar.caution(t('subscriptions-page.validations.plan-required'));
      return;
    }

    createSubscription.mutate({ userTenantId, planId: selectedPlanState });
  }, [userTenantId, selectedPlanState, createSubscription, snackbar, t]);

  const planItems = useMemo(() =>
    plans && plans.map((plan: Plan) => (
      <MuiMenuItem key={plan.id} value={plan.id}>
        {plan.name}
      </MuiMenuItem>
    )
  ), [plans]);

  const isPending = createSubscription.status === 'pending';

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      keepMounted
      aria-labelledby="create-subscription-dialog-title"
      aria-describedby="create-subscription-dialog-description"
    >
      <MuiDialogTitle id="create-subscription-dialog-title">
        {t('subscriptions-page.actions.create.dialog-title')}
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="create-subscription-dialog-description">
          {t('subscriptions-page.actions.create.dialog-subtitle')}
        </MuiDialogContentText>
        <MuiFormControl sx={{ my: 1 }} error={status === 'error'} fullWidth>
          <MuiInputLabel id="plan">
            {t('subscriptions-page.fields.plan')}
          </MuiInputLabel>
          <MuiSelect
            labelId="plan"
            id="plan"
            value={selectedPlanState}
            disabled={status === 'pending'}
            label={t('subscriptions-page.fields.plan')}
            onChange={handleChange}
          >
            <MuiMenuItem value="">
              <em>{status === 'pending' ? t('common.wordings.loading') : t('common.wordings.unselected')}</em>
            </MuiMenuItem>
            {planItems}
          </MuiSelect>
          {status === 'error' && (
            <MuiFormHelperText>
              {t('subscriptions-page.actions.create.label-retry')}
              <MuiIconButton
                size="small"
                aria-label={t('subscriptions-page.actions.create.icon-retry')}
                color="info"
                tabIndex={-1}
                sx={{ ml: 1 }}
                onMouseDown={handleMouseDown}
                onClick={handleRefetch}
              >
                <MuiRefreshIcon fontSize="small" />
              </MuiIconButton>
            </MuiFormHelperText>
          )}
        </MuiFormControl>
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
          onClick={handleSave}
        >
          {t('common.wordings.save')}
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default CreateSubscriptionDialog;

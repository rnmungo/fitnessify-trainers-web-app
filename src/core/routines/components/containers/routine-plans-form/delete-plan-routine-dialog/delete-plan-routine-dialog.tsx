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
import useMutationDeletePlanRoutine from '../../../../hooks/useMutationDeletePlanRoutine';

import type { RoutinePlan } from '@/types/routine';

interface DeletePlanRoutineDialogProps {
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  routineId: string;
  plan?: RoutinePlan | null;
  onPlanRoutineDeleted?: (planId: string) => void;
}

const DeletePlanRoutineDialog = ({
  open = false,
  onClose,
  routineId,
  plan = null,
  onPlanRoutineDeleted,
}: DeletePlanRoutineDialogProps) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const deletePlanRoutine = useMutationDeletePlanRoutine();

  useEffect(() => {
    if (deletePlanRoutine.status === 'success') {
      snackbar.success(t('routines-page.actions.remove-plan.mutation.success'));
      deletePlanRoutine.reset();

      if (onPlanRoutineDeleted && plan) {
        onPlanRoutineDeleted(plan.id);
        onClose();
      }
    }

    if (deletePlanRoutine.status === 'error') {
      const error = deletePlanRoutine.error as AxiosError;
      const errorMessage = (error.response?.data as { message?: string })?.message || error.message;
      snackbar.error(t(errorMessage));
      deletePlanRoutine.reset();
    }
  }, [deletePlanRoutine, snackbar, onPlanRoutineDeleted, onClose, plan, t]);

  const handleDelete = useCallback(() => {
    if (plan) {
      deletePlanRoutine.mutate({ planId: plan.id, routineId });
    }
  }, [plan, deletePlanRoutine, routineId]);

  const isPending = deletePlanRoutine.status === 'pending';

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-plan-routine-dialog-title"
      aria-describedby="delete-plan-routine-dialog-description"
    >
      <MuiDialogTitle id="delete-plan-routine-dialog-title">
        {t('common.wordings.wait')}
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="delete-plan-routine-dialog-description">
          {t('routines-page.actions.remove-plan.query')} <strong>{plan?.name}</strong>? {t('common.wordings.action-cannot-undone')}
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
          color="error"
          loading={isPending}
          loadingIndicator={t('common.wordings.deleting')}
          variant="contained"
          onClick={handleDelete}
        >
          {t('common.wordings.delete')}
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default DeletePlanRoutineDialog;

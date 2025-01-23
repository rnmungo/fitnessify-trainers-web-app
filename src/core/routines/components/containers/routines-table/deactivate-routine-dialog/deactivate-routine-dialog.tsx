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
import useMutationDeactivateRoutine from '../../../../hooks/useMutationDeactivateRoutine';
import type { Routine } from '@/types/routine';

interface DeactivateRoutineDialogProps {
  routine?: Routine | null;
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  onRoutineDeactivated?: () => void;
}

const DeactivateRoutineDialog = ({
  routine,
  open = false,
  onClose,
  onRoutineDeactivated,
}: DeactivateRoutineDialogProps) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const deactivateRoutine = useMutationDeactivateRoutine();

  useEffect(() => {
    if (deactivateRoutine.status === 'success') {
      snackbar.success(t('routines-page.actions.deactivate.mutation.success'));
      deactivateRoutine.reset();

      if (onRoutineDeactivated) {
        onRoutineDeactivated();
        onClose();
      }
    }

    if (deactivateRoutine.status === 'error') {
      const error = deactivateRoutine.error as AxiosError;
      const errorMessage = (error.response?.data as { message?: string })?.message || error.message;
      snackbar.error(t(errorMessage));
      deactivateRoutine.reset();
    }
  }, [deactivateRoutine, snackbar, onRoutineDeactivated, onClose, t]);

  const handleConfirm = useCallback(() => {
    if (routine) {
      deactivateRoutine.mutate({ id: routine.id });
    }
  }, [routine, deactivateRoutine]);

  const isPending = deactivateRoutine.status === 'pending';

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      keepMounted
      aria-labelledby="deactivate-routine-dialog-title"
      aria-describedby="deactivate-routine-dialog-description"
    >
      <MuiDialogTitle id="deactivate-routine-dialog-title">
        {t('routines-page.actions.deactivate.dialog-title')}
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="deactivate-routine-dialog-description">
          {t('routines-page.actions.deactivate.query')} <strong>{routine?.name}</strong>?
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
          loadingIndicator={t('common.wordings.deactivating')}
          variant="contained"
          onClick={handleConfirm}
        >
          {t('common.wordings.confirm')}
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default DeactivateRoutineDialog;

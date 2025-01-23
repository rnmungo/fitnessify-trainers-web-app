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
import useMutationActivateRoutine from '../../../../hooks/useMutationActivateRoutine';
import type { Routine } from '@/types/routine';

interface ActivateRoutineDialogProps {
  routine?: Routine | null;
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  onRoutineActivated?: () => void;
}

const ActivateRoutineDialog = ({
  routine,
  open = false,
  onClose,
  onRoutineActivated,
}: ActivateRoutineDialogProps) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const activateRoutine = useMutationActivateRoutine();

  useEffect(() => {
    if (activateRoutine.status === 'success') {
      snackbar.success(t('routines-page.actions.activate.mutation.success'));
      activateRoutine.reset();

      if (onRoutineActivated) {
        onRoutineActivated();
        onClose();
      }
    }

    if (activateRoutine.status === 'error') {
      const error = activateRoutine.error as AxiosError;
      const errorMessage = (error.response?.data as { message?: string })?.message || error.message;
      snackbar.error(t(errorMessage));
      activateRoutine.reset();
    }
  }, [activateRoutine, snackbar, onRoutineActivated, onClose, t]);

  const handleConfirm = useCallback(() => {
    if (routine) {
      activateRoutine.mutate({ id: routine.id });
    }
  }, [routine, activateRoutine]);

  const isPending = activateRoutine.status === 'pending';

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      keepMounted
      aria-labelledby="activate-routine-dialog-title"
      aria-describedby="activate-routine-dialog-description"
    >
      <MuiDialogTitle id="activate-routine-dialog-title">
        {t('routines-page.actions.activate.dialog-title')}
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="activate-routine-dialog-description">
          {t('routines-page.actions.activate.query')} <strong>{routine?.name}</strong>?
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

export default ActivateRoutineDialog;

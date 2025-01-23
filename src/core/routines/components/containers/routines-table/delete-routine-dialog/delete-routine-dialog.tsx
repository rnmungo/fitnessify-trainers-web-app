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
import useMutationDeleteRoutine from '../../../../hooks/useMutationDeleteRoutine';

import type { Routine } from '@/types/routine';

interface DeleteRoutineDialogProps {
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  routine?: Routine | null;
  onRoutineDeleted?: () => void;
}

const DeleteRoutineDialog = ({
  open = false,
  onClose,
  routine = null,
  onRoutineDeleted,
}: DeleteRoutineDialogProps) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const deleteRoutine = useMutationDeleteRoutine();

  useEffect(() => {
    if (deleteRoutine.status === 'success') {
      snackbar.success(t('routines-page.actions.remove.mutation.success'));
      deleteRoutine.reset();

      if (onRoutineDeleted) {
        onRoutineDeleted();
        onClose();
      }
    }

    if (deleteRoutine.status === 'error') {
      const error = deleteRoutine.error as AxiosError;
      const errorMessage = (error.response?.data as { message?: string })?.message || error.message;
      snackbar.error(t(errorMessage));
      deleteRoutine.reset();
    }
  }, [deleteRoutine, snackbar, onRoutineDeleted, onClose, t]);

  const handleDelete = useCallback(() => {
    if (routine) {
      deleteRoutine.mutate({ id: routine.id });
    }
  }, [routine, deleteRoutine]);

  const isPending = deleteRoutine.status === 'pending';

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-routine-dialog-title"
      aria-describedby="delete-routine-dialog-description"
    >
      <MuiDialogTitle id="delete-routine-dialog-title">
        {t('common.wordings.wait')}
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="delete-routine-dialog-description">
          {t('routines-page.actions.remove.query')} <strong>{routine?.name}</strong>? {t('common.wordings.action-cannot-undone')}
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

export default DeleteRoutineDialog;

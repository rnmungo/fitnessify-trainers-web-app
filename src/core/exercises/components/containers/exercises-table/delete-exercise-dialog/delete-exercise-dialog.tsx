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
import { useTranslation } from '@/core/i18n/context';
import useMutationDeleteExercise from '../../../../hooks/useMutationDeleteExercise';

import type { Exercise } from '@/types/exercise';

interface DeleteExerciseDialogProps {
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  exercise?: Exercise | null;
  onExerciseDeleted?: () => void;
}

const DeleteExerciseDialog = ({
  open = false,
  onClose,
  exercise = null,
  onExerciseDeleted,
}: DeleteExerciseDialogProps) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const deleteExercise = useMutationDeleteExercise();

  useEffect(() => {
    if (deleteExercise.status === 'success') {
      snackbar.success(t('exercises-page.actions.remove.mutation.success'));
      deleteExercise.reset();

      if (onExerciseDeleted) {
        onExerciseDeleted();
        onClose();
      }
    }

    if (deleteExercise.status === 'error') {
      const error = deleteExercise.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      deleteExercise.reset();
    }
  }, [deleteExercise, snackbar, onExerciseDeleted, onClose, t]);

  const handleDelete = useCallback(() => {
    if (exercise) {
      deleteExercise.mutate(exercise.id);
    }
  }, [exercise, deleteExercise]);

  const isPending = deleteExercise.status === 'pending';

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-exercise-dialog-title"
      aria-describedby="delete-exercise-dialog-description"
    >
      <MuiDialogTitle id="delete-exercise-dialog-title">
        {t('common.wordings.wait')}
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="delete-exercise-dialog-description">
          {t('exercises-page.actions.remove.query')} <strong>{exercise?.name}</strong>? {t('common.wordings.action-cannot-undone')}
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

export default DeleteExerciseDialog;

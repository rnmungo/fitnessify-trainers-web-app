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
import useMutationDeleteExercise from '../../../../hooks/useMutationDeleteExercise';

import type { Exercise } from '@/types/exercise';

interface DeleteExerciseDialogProps {
  open: boolean;
  onClose: () => void;
  exercise?: Exercise | null;
  onExerciseDeleted?: () => void;
}

const DeleteExerciseDialog: React.FC<DeleteExerciseDialogProps> = ({
  open = false,
  onClose,
  exercise = null,
  onExerciseDeleted,
}) => {
  const snackbar = useSnackbar();
  const deleteExercise = useMutationDeleteExercise();

  useEffect(() => {
    if (deleteExercise.status === 'success') {
      snackbar.success('El ejercicio ha sido eliminado correctamente.');
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
  }, [deleteExercise, snackbar, onExerciseDeleted, onClose]);

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
        Aguarde
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="delete-exercise-dialog-description">
          ¿Estás seguro que deseas eliminar el ejercicio <strong>{exercise?.name}</strong>? Esta acción no se puede deshacer.
        </MuiDialogContentText>
      </MuiDialogContent>
      <MuiDialogActions>
        <MuiButton onClick={onClose} color="inherit" disabled={isPending}>
          Cancelar
        </MuiButton>
        <MuiLoadingButton
          color="error"
          loading={isPending}
          loadingIndicator="Eliminando..."
          variant="contained"
          onClick={handleDelete}
        >
          Eliminar
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default DeleteExerciseDialog;

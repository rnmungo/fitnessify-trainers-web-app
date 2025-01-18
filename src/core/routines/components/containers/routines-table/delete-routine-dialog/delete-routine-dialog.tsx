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
import useMutationDeleteRoutine from '../../../../hooks/useMutationDeleteRoutine';

import type { Routine } from '@/types/routine';

interface DeleteRoutineDialogProps {
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  routine?: Routine | null;
  onRoutineDeleted?: () => void;
}

const DeleteRoutineDialog: React.FC<DeleteRoutineDialogProps> = ({
  open = false,
  onClose,
  routine = null,
  onRoutineDeleted,
}) => {
  const snackbar = useSnackbar();
  const deleteRoutine = useMutationDeleteRoutine();

  useEffect(() => {
    if (deleteRoutine.status === 'success') {
      snackbar.success('La rutina ha sido eliminada correctamente.');
      deleteRoutine.reset();

      if (onRoutineDeleted) {
        onRoutineDeleted();
        onClose();
      }
    }

    if (deleteRoutine.status === 'error') {
      const error = deleteRoutine.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      deleteRoutine.reset();
    }
  }, [deleteRoutine, snackbar, onRoutineDeleted, onClose]);

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
        Aguarde
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="delete-routine-dialog-description">
          ¿Estás seguro que deseas eliminar la rutina <strong>{routine?.name}</strong>? Esta acción no se puede deshacer.
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

export default DeleteRoutineDialog;

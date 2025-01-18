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
import useMutationDeactivateRoutine from '../../../../hooks/useMutationDeactivateRoutine';
import type { Routine } from '@/types/routine';

interface DeactivateRoutineDialogProps {
  routine?: Routine | null;
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  onRoutineDeactivated?: () => void;
}

const DeactivateRoutineDialog: React.FC<DeactivateRoutineDialogProps> = ({
  routine,
  open = false,
  onClose,
  onRoutineDeactivated,
}) => {
  const snackbar = useSnackbar();
  const deactivateRoutine = useMutationDeactivateRoutine();

  useEffect(() => {
    if (deactivateRoutine.status === 'success') {
      snackbar.success('La rutina ha sido desactivada correctamente.');
      deactivateRoutine.reset();

      if (onRoutineDeactivated) {
        onRoutineDeactivated();
        onClose();
      }
    }

    if (deactivateRoutine.status === 'error') {
      const error = deactivateRoutine.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      deactivateRoutine.reset();
    }
  }, [deactivateRoutine, snackbar, onRoutineDeactivated, onClose]);

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
        Desactivar rutina
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="deactivate-routine-dialog-description">
          ¿Estás seguro que deseas desactivar la rutina <strong>{routine?.name}</strong>?
        </MuiDialogContentText>
      </MuiDialogContent>
      <MuiDialogActions>
        <MuiButton onClick={onClose} color="inherit" disabled={isPending}>
          Cancelar
        </MuiButton>
        <MuiLoadingButton
          color="info"
          loading={isPending}
          loadingIndicator="Desactivando..."
          variant="contained"
          onClick={handleConfirm}
        >
          Confirmar
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default DeactivateRoutineDialog;

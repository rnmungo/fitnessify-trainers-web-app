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
import useMutationActivateRoutine from '../../../../hooks/useMutationActivateRoutine';
import type { Routine } from '@/types/routine';

interface ActivateRoutineDialogProps {
  routine?: Routine | null;
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  onRoutineActivated?: () => void;
}

const ActivateRoutineDialog: React.FC<ActivateRoutineDialogProps> = ({
  routine,
  open = false,
  onClose,
  onRoutineActivated,
}) => {
  const snackbar = useSnackbar();
  const activateRoutine = useMutationActivateRoutine();

  useEffect(() => {
    if (activateRoutine.status === 'success') {
      snackbar.success('La rutina ha sido activada correctamente.');
      activateRoutine.reset();

      if (onRoutineActivated) {
        onRoutineActivated();
        onClose();
      }
    }

    if (activateRoutine.status === 'error') {
      const error = activateRoutine.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      activateRoutine.reset();
    }
  }, [activateRoutine, snackbar, onRoutineActivated, onClose]);

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
        Activar rutina
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="activate-routine-dialog-description">
          ¿Estás seguro que deseas activar la rutina <strong>{routine?.name}</strong>?
        </MuiDialogContentText>
      </MuiDialogContent>
      <MuiDialogActions>
        <MuiButton onClick={onClose} color="inherit" disabled={isPending}>
          Cancelar
        </MuiButton>
        <MuiLoadingButton
          color="info"
          loading={isPending}
          loadingIndicator="Activando..."
          variant="contained"
          onClick={handleConfirm}
        >
          Confirmar
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default ActivateRoutineDialog;

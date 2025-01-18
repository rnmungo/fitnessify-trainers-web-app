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
  const snackbar = useSnackbar();
  const deletePlanRoutine = useMutationDeletePlanRoutine();

  useEffect(() => {
    if (deletePlanRoutine.status === 'success') {
      snackbar.success('La rutina ha sido eliminada del plan correctamente.');
      deletePlanRoutine.reset();

      if (onPlanRoutineDeleted && plan) {
        onPlanRoutineDeleted(plan.id);
        onClose();
      }
    }

    if (deletePlanRoutine.status === 'error') {
      const error = deletePlanRoutine.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      deletePlanRoutine.reset();
    }
  }, [deletePlanRoutine, snackbar, onPlanRoutineDeleted, onClose, plan]);

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
        Aguarde
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="delete-plan-routine-dialog-description">
          ¿Estás seguro que deseas eliminar la rutina del plan <strong>{plan?.name}</strong>? Esta acción no se puede deshacer.
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

export default DeletePlanRoutineDialog;

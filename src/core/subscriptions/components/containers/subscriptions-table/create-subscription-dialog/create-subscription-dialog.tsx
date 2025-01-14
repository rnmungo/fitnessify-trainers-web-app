import { MouseEvent, useEffect, useCallback, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import MuiLoadingButton from '@mui/lab/LoadingButton';
import MuiButton from '@mui/material/Button';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogContentText from '@mui/material/DialogContentText';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiIconButton from '@mui/material/IconButton';
import MuiInputLabel from '@mui/material/InputLabel';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiFormControl from '@mui/material/FormControl';
import MuiFormHelperText from '@mui/material/FormHelperText';
import MuiSelect, { SelectChangeEvent as MuiSelectChangeEvent } from '@mui/material/Select';
import MuiRefreshIcon from '@mui/icons-material/Refresh';
import { useSnackbar } from '@/core/context/snackbar';
import useMutationCreateSubscription from '../../../../hooks/useMutationCreateSubscription';
import useQueryPlans from '../../../../hooks/useQueryPlans';
import type { Plan } from '@/types/plan';

interface CreateSubscriptionDialogProps {
  userTenantId?: string;
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  onSubscriptionCreated?: () => void;
}

const CreateSubscriptionDialog: React.FC<CreateSubscriptionDialogProps> = ({
  userTenantId,
  open = false,
  onClose,
  onSubscriptionCreated,
}) => {
  const [selectedPlanState, setSelectedPlanState] = useState<string>('');
  const snackbar = useSnackbar();
  const createSubscription = useMutationCreateSubscription();
  const { data: plans, status, refetch } = useQueryPlans();

  const handleChange = useCallback((event: MuiSelectChangeEvent) => {
    setSelectedPlanState(event.target.value);
  }, []);

  const handleMouseDown = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }, []);

  const handleRefetch = () => {
    refetch();
  };

  useEffect(() => {
    if (createSubscription.status === 'success') {
      snackbar.success('La subscripción ha sido creada correctamente.');
      createSubscription.reset();

      if (onSubscriptionCreated) {
        onSubscriptionCreated();
        onClose();
      }
    }

    if (createSubscription.status === 'error') {
      const error = createSubscription.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      createSubscription.reset();
    }
  }, [createSubscription, snackbar, onSubscriptionCreated, onClose]);

  const handleSave = useCallback(() => {
    if (!userTenantId) {
      snackbar.caution('No se seleccionó el usuario');
      return;
    }

    if (!selectedPlanState) {
      snackbar.caution('Debe seleccionar un plan');
      return;
    }

    createSubscription.mutate({ userTenantId, planId: selectedPlanState });
  }, [userTenantId, selectedPlanState, createSubscription, snackbar]);

  const planItems = useMemo(() =>
    plans && plans.map((plan: Plan) => (
      <MuiMenuItem key={plan.id} value={plan.id}>
        {plan.name}
      </MuiMenuItem>
    )
  ), [plans]);

  const isPending = createSubscription.status === 'pending';

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      keepMounted
      aria-labelledby="create-subscription-dialog-title"
      aria-describedby="create-subscription-dialog-description"
    >
      <MuiDialogTitle id="create-subscription-dialog-title">
        Cargar subscripción
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText id="create-subscription-dialog-description">
          Seleccione un plan para su subscripción
        </MuiDialogContentText>
        <MuiFormControl sx={{ my: 1 }} error={status === 'error'} fullWidth>
          <MuiInputLabel id="plan">Plan</MuiInputLabel>
          <MuiSelect
            labelId="plan"
            id="plan"
            value={selectedPlanState}
            disabled={status === 'pending'}
            label="Plan"
            onChange={handleChange}
          >
            <MuiMenuItem value="">
              <em>{status === 'pending' ? 'Cargando...' : 'Sin seleccionar'}</em>
            </MuiMenuItem>
            {planItems}
          </MuiSelect>
          {status === 'error' && (
            <MuiFormHelperText>
              Intente cargar los planes nuevamente
              <MuiIconButton
                size="small"
                aria-label="Reintentar búsqueda"
                color="info"
                tabIndex={-1}
                sx={{ ml: 1 }}
                onMouseDown={handleMouseDown}
                onClick={handleRefetch}
              >
                <MuiRefreshIcon fontSize="small" />
              </MuiIconButton>
            </MuiFormHelperText>
          )}
        </MuiFormControl>
      </MuiDialogContent>
      <MuiDialogActions>
        <MuiButton onClick={onClose} color="inherit" disabled={isPending}>
          Cancelar
        </MuiButton>
        <MuiLoadingButton
          color="info"
          loading={isPending}
          loadingIndicator="Guardando..."
          variant="contained"
          onClick={handleSave}
        >
          Guardar
        </MuiLoadingButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};

export default CreateSubscriptionDialog;

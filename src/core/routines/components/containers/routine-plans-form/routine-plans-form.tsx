import { useCallback, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { SelectChangeEvent } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import MuiBox from '@mui/material/Box';
import MuiChip from '@mui/material/Chip';
import MuiCircularProgress from '@mui/material/CircularProgress';
import MuiFormControl from '@mui/material/FormControl';
import MuiIconButton from '@mui/material/IconButton';
import MuiInputLabel from '@mui/material/InputLabel';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiPaper from '@mui/material/Paper';
import MuiSelect from '@mui/material/Select';
import MuiStack from '@mui/material/Stack';
import MuiRefreshIcon from "@mui/icons-material/Refresh";
import { styled } from '@mui/system';
import { useSnackbar } from '@/core/context/snackbar';
import Spinner from '@/core/components/presentational/spinner';
import useQueryPlans from '@/core/subscriptions/hooks/useQueryPlans';
import useMutationAddPlanRoutine from '../../../hooks/useMutationAddPlanRoutine';
import DeletePlanRoutineDialog from './delete-plan-routine-dialog';

import type { Plan } from '@/types/plan';
import type { RoutinePlan } from '@/types/routine';

const StyledSelect = styled(MuiSelect)(() => ({
  minWidth: '250px',
}));

interface RoutinePlansFormProps {
  id: string
  routinePlans: Array<RoutinePlan>
}

const RoutinePlansForm = ({ id, routinePlans = [] }: RoutinePlansFormProps) => {
  const [subscribedPlansState, setSubscribedPlansState] = useState<Array<RoutinePlan>>(routinePlans);
  const [selectedPlanState, setSelectedPlanState] = useState<string>('');
  const [openDeleteState, setOpenDeleteState] = useState<boolean>(false);
  const [selectedPlanDeleteState, setSelectedPlanDeleteState] = useState<RoutinePlan | null>();
  const snackbar = useSnackbar();
  const addPlanRoutine = useMutationAddPlanRoutine();
  const { data: plans, status, refetch } = useQueryPlans();

  const planItems: Array<Plan> = useMemo(() =>
      (plans || [])
        .filter(plan =>
          !subscribedPlansState.find(subscribed => subscribed.id === plan.id)
        ), [plans, subscribedPlansState]);

  const handlePlanSelect = useCallback((event: SelectChangeEvent<unknown>) => {
    const planId = event.target.value as string;
    const plan = planItems.find((plan) => plan.id === planId);

    if (plan) {
      addPlanRoutine.mutate(
        { planId: plan.id, routineId: id },
        {
          onSuccess: () => {
            snackbar.success('La rutina fue agregada al plan correctamente');
            addPlanRoutine.reset();
            setSelectedPlanState('');
            setSubscribedPlansState((prevState) => [...prevState, { id: plan.id, name: plan.name }]);
          },
          onError: (mutationError: unknown) => {
            const error = mutationError as AxiosError;
            snackbar.error((error.response?.data as { message?: string })?.message || error.message);
            addPlanRoutine.reset();
          },
        }
      );
    }
  }, [planItems, addPlanRoutine, id, snackbar]);

  const handleCloseDeleteDialog = useCallback((_?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason && ['backdropClick', 'escapeKeyDown'].includes(reason)) {
      return;
    }

    setOpenDeleteState(false);
    setSelectedPlanDeleteState(null);
  }, []);

  const handleRemovePlan = (planToRemove: RoutinePlan) => {
    setSelectedPlanDeleteState(planToRemove);
    setOpenDeleteState(true);
  };

  const handlePlanRoutineDeleted = useCallback((planId: string) => {
    setSubscribedPlansState(prevState => prevState.filter(plan => plan.id !== planId));
  }, []);

  return (
    <>
      <Spinner loading={addPlanRoutine.status === 'pending'} label="Agregando rutina al plan" />
      <MuiPaper elevation={3} sx={{ p: 3 }}>
        <MuiStack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <MuiFormControl error={status === 'error'}>
            <MuiInputLabel id="plan">Plan de entrenamiento</MuiInputLabel>
            <StyledSelect
              labelId="plan"
              id="plan"
              value={selectedPlanState}
              disabled={status === 'pending'}
              label="Plan de entrenamiento"
              onChange={handlePlanSelect}
            >
              <MuiMenuItem value="">
                <em>Sin seleccionar</em>
              </MuiMenuItem>
              {planItems && planItems.map(plan => (
                <MuiMenuItem key={plan.id} value={plan.id}>
                  {plan.name}
                </MuiMenuItem>
              ))}
            </StyledSelect>
          </MuiFormControl>
          {status === 'pending' && <MuiCircularProgress size={24} />}
          {status === 'error' && (
            <MuiIconButton
              onClick={() => refetch()}
              sx={{ ml: 1 }}
              color="error"
            >
              <MuiRefreshIcon />
            </MuiIconButton>
          )}
        </MuiStack>
        {status === 'error' && (
          <MuiAlert severity="error">
            Ocurrió un error, reintente la búsqueda.
          </MuiAlert>
        )}
        {(status !== 'error' && subscribedPlansState.length === 0) && (
          <MuiAlert severity="info">
            No se han seleccionado planes de entrenamiento. Elija un plan del menú desplegable de arriba.
          </MuiAlert>
        )}
        {subscribedPlansState.length > 0 && (
          <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {subscribedPlansState.map((plan) => (
              <MuiChip
                key={plan.id}
                label={plan.name}
                onDelete={() => handleRemovePlan(plan)}
                color="primary"
                variant="outlined"
              />
            ))}
          </MuiBox>
        )}
      </MuiPaper>
      <DeletePlanRoutineDialog
        open={openDeleteState}
        onClose={handleCloseDeleteDialog}
        routineId={id}
        plan={selectedPlanDeleteState}
        onPlanRoutineDeleted={handlePlanRoutineDeleted}
      />
    </>
  );
};

export default RoutinePlansForm;

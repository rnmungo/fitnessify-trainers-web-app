import { useCallback, useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import MuiButton from '@mui/material/Button';
import MuiGrid from '@mui/material/Grid2';
import MuiStack from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import MuiVideoCallIcon from '@mui/icons-material/VideoCall';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Spinner from '@/core/components/presentational/spinner';
import { useSnackbar } from '@/core/context/snackbar';
import useMutationCreateExercise from '../../../hooks/useMutationCreateExercise';
import useMutationUpdateExercise from '../../../hooks/useMutationUpdateExercise';
import { VideosGalleryDialog } from '../videos-gallery';
import MuscleGroupsMultipleSelect from '../muscle-groups-multiple-select';

import type { ExerciseDetailed, Video } from '@/types/exercise';

type FormProps = {
  name: string;
  description: string;
  muscleGroups: Array<string>;
  video: Video | null;
};

const defaultFormState: FormProps = {
  name: '',
  description: '',
  muscleGroups: [],
  video: null,
};

interface ExerciseFormProps {
  defaultExercise?: ExerciseDetailed | null;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ defaultExercise = null }) => {
  const [formState, setFormState] = useState<FormProps>(
    defaultExercise
      ? {
          name: defaultExercise.name,
          description: defaultExercise.description,
          muscleGroups: defaultExercise.muscleGroups.map((muscleGroup) => muscleGroup.id),
          video: defaultExercise.video || null,
        }
      : defaultFormState
  );
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const createExercise = useMutationCreateExercise();
  const updateExercise = useMutationUpdateExercise();
  const snackbar = useSnackbar();

  const sxProps = isSmallScreen ? { width: '100%' } : { width: 500 };

  const handleConfirm = useCallback(() => {
    if (!formState.name) {
      snackbar.caution('El nombre del ejercicio es obligatorio');
      return;
    }

    if (!formState.muscleGroups.length) {
      snackbar.caution('Debes seleccionar al menos un grupo muscular');
      return;
    }

    if (!formState.video) {
      snackbar.caution('Debes seleccionar un video');
      return;
    }

    const exerciseForm = {
      name: formState.name,
      description: formState.description,
      muscleGroups: formState.muscleGroups,
      videoId: formState.video?.id,
    };

    if (defaultExercise) {
      updateExercise.mutate(
        { ...exerciseForm, id: defaultExercise.id },
        {
          onSuccess: () => {
            snackbar.success('Ejercicio actualizado correctamente');
            updateExercise.reset();
          },
          onError: (mutationError: unknown) => {
            const error = mutationError as AxiosError;
            snackbar.error((error.response?.data as { message?: string })?.message || error.message);
          },
        }
      );
    } else {
      createExercise.mutate(exerciseForm, {
        onSuccess: () => {
          setFormState(defaultFormState);
          snackbar.success('Ejercicio creado correctamente');
          createExercise.reset();
        },
        onError: (mutationError: unknown) => {
          const error = mutationError as AxiosError;
          snackbar.error((error.response?.data as { message?: string })?.message || error.message);
        },
      });
    }
  }, [createExercise, updateExercise, defaultExercise, formState, snackbar]);

  const isPending = [createExercise.status, updateExercise.status].includes('pending');

  return (
    <>
      <Spinner loading={isPending} label="Guardando ejercicio" />
      <MuiGrid
        container
        justifyContent="center"
      >
        <MuiGrid sx={sxProps}>
          <MuiTextField
            label="Nombre"
            value={formState.name}
            onChange={(e) => setFormState(prevState => ({ ...prevState, name: e.target.value }))}
            fullWidth
            margin="normal"
          />
          <MuiTextField
            label="Descripción"
            value={formState.description}
            onChange={(e) => setFormState(prevState => ({ ...prevState, description: e.target.value }))}
            fullWidth
            margin="normal"
          />
          <MuscleGroupsMultipleSelect
            id="muscle-groups-select"
            label="Selecciona grupos musculares"
            value={formState.muscleGroups}
            onChange={(value) => setFormState(prevState => ({ ...prevState, muscleGroups: value }))}
            sx={{ py: 2, width: '100%' }}
          />
          <MuiStack direction={isSmallScreen ? 'column' : 'row'} spacing={2}>
            <MuiButton
              sx={{ gap: 1 }}
              variant="text"
              color="primary"
              fullWidth={isSmallScreen}
              disabled={isPending}
              onClick={() => {
                router.push('/videos/new-video');
              }}
            >
              Añadir Video
              <MuiVideoCallIcon />
            </MuiButton>
            <VideosGalleryDialog
              selectedVideo={formState.video}
              onSelectVideo={(video: Video) => setFormState(prevState => ({ ...prevState, video }))}
              fullWidth={isSmallScreen}
              disabled={isPending}
            />
          </MuiStack>
          <MuiButton
            sx={{ my: 2 }}
            variant="contained"
            color="primary"
            fullWidth={isSmallScreen}
            onClick={handleConfirm}
            disabled={isPending}
          >
            Confirmar
          </MuiButton>
        </MuiGrid>
      </MuiGrid>
    </>
  );
};

export default ExerciseForm;

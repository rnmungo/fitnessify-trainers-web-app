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
import { useTranslation } from '@/core/i18n/context';
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
  const { t } = useTranslation();

  const sxProps = isSmallScreen ? { width: '100%' } : { width: 500 };

  const handleConfirm = useCallback(() => {
    if (!formState.name) {
      snackbar.caution(t('exercises-page.validations.name-required'));
      return;
    }

    if (!formState.muscleGroups.length) {
      snackbar.caution(t('exercises-page.validations.muscle-groups-required'));
      return;
    }

    if (!formState.video) {
      snackbar.caution(t('exercises-page.validations.video-required'));
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
            snackbar.success(t('exercises-page.mutation.update-exercise.success'));
            updateExercise.reset();
          },
          onError: (mutationError: unknown) => {
            const error = mutationError as AxiosError;
            snackbar.error((error.response?.data as { message?: string })?.message || error.message);
            updateExercise.reset();
          },
        }
      );
    } else {
      createExercise.mutate(exerciseForm, {
        onSuccess: () => {
          setFormState(defaultFormState);
          snackbar.success(t('exercises-page.mutation.create-exercise.success'));
          createExercise.reset();
        },
        onError: (mutationError: unknown) => {
          const error = mutationError as AxiosError;
          snackbar.error((error.response?.data as { message?: string })?.message || error.message);
          createExercise.reset();
        },
      });
    }
  }, [createExercise, updateExercise, defaultExercise, formState, snackbar, t]);

  const isPending = [createExercise.status, updateExercise.status].includes('pending');

  return (
    <>
      <Spinner loading={isPending} label={t('exercises-page.mutation.loading')} />
      <MuiGrid
        container
        justifyContent="center"
      >
        <MuiGrid sx={sxProps}>
          <MuiTextField
            label={t('exercises-page.fields.name')}
            value={formState.name}
            onChange={(e) => setFormState(prevState => ({ ...prevState, name: e.target.value }))}
            fullWidth
            margin="normal"
          />
          <MuiTextField
            label={t('exercises-page.fields.description')}
            value={formState.description}
            onChange={(e) => setFormState(prevState => ({ ...prevState, description: e.target.value }))}
            fullWidth
            margin="normal"
          />
          <MuscleGroupsMultipleSelect
            id="muscle-groups-select"
            label={t('exercises-page.fields.muscle-groups')}
            value={formState.muscleGroups}
            onChange={(value) => setFormState(prevState => ({ ...prevState, muscleGroups: value }))}
            sx={{ py: 2, width: '100%' }}
          />
          <MuiStack direction={isSmallScreen ? 'column' : 'row'} spacing={2}>
            <MuiButton
              sx={{ gap: 1 }}
              aria-label={t('exercises-page.actions.add-video')}
              variant="text"
              color="primary"
              fullWidth={isSmallScreen}
              disabled={isPending}
              onClick={() => {
                router.push('/videos/new-video');
              }}
            >
              {t('exercises-page.actions.add-video')}
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
            aria-label={t('common.wordings.confirm')}
            variant="contained"
            color="primary"
            fullWidth={isSmallScreen}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {t('common.wordings.confirm')}
          </MuiButton>
        </MuiGrid>
      </MuiGrid>
    </>
  );
};

export default ExerciseForm;

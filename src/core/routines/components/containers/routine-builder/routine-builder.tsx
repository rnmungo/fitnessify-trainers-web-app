import { SyntheticEvent, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { v4 as uuidV4 } from 'uuid';
import MuiAlert from '@mui/material/Alert';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiGrid from '@mui/material/Grid2';
import MuiFormControl from '@mui/material/FormControl';
import MuiInputLabel from '@mui/material/InputLabel';
import MuiSelect from '@mui/material/Select';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiTab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';
import MuiTextField from '@mui/material/TextField';
import MuiAddIcon from '@mui/icons-material/Add';
import MuiSaveIcon from '@mui/icons-material/Save';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableListSection } from '@/core/components/presentational/list';
import { TimeMaskTextField } from '@/core/components/presentational/textfield';
import Spinner from '@/core/components/presentational/spinner';
import { useTranslation } from '@/core/i18n/context';
import { useSnackbar } from '@/core/context/snackbar';
import useQueryExercises from '@/core/exercises/hooks/useQueryExercises';
import useMutationCreateRoutine from '../../../hooks/useMutationCreateRoutine';
import useMutationUpdateRoutine from '../../../hooks/useMutationUpdateRoutine';
import PreviewRoutine from '../../presentational/preview-routine';
import RoutineSectionBuilder from '../../presentational/routine-section-builder';
import { EQUIPMENT_TRANSLATION, LEVEL_TRANSLATION } from '../../../constants/routine';

import type { RoutineLevel, RoutineEquipment } from '@/types/routine';
import type { AutocompleteOption } from '@/types/material-ui';
import type {
  AutocompleteExerciseProps,
  ExerciseBuilder,
  RoutineBuilder,
  SectionBuilder,
} from '../../../types';

const initialRoutineState: RoutineBuilder = {
  name: '',
  duration: '00:00:00',
  level: '',
  equipment: '',
};

const initialSectionsState: Array<SectionBuilder> = [
  {
    id: uuidV4(),
    name: '',
    duration: '00:00:00',
    pauseTime: '00:00:00',
    rounds: 1,
    exercises: [],
  },
];

interface RoutineBuilderProps {
  id?: string;
  defaultRoutine?: RoutineBuilder;
  defaultSections?: Array<SectionBuilder>;
};

const RoutineBuilder = ({ defaultRoutine, defaultSections, id }: RoutineBuilderProps) => {
  const [activeTabState, setActiveTabState] = useState<number>(0);
  const [routineState, setRoutineState] = useState<RoutineBuilder>(defaultRoutine || initialRoutineState);
  const [sectionsState, setSectionsState] = useState<Array<SectionBuilder>>(defaultSections || initialSectionsState);
  const { t } = useTranslation();
  const snackbar = useSnackbar();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const createRoutine = useMutationCreateRoutine();
  const updateRoutine = useMutationUpdateRoutine();
  const { data, status, refetch } = useQueryExercises();

  const autocompleteExerciseProps: AutocompleteExerciseProps = useMemo(() => {
    if (status === 'success') {
      const exerciseItems: Array<AutocompleteOption> = data.map(exercise => ({ id: exercise.id, label: exercise.name }));

      const props = {
        options: exerciseItems,
        disabled: exerciseItems.length === 0,
        helper: exerciseItems.length === 0 ? t('routines-page.fields.exercise.empty') : ''
      };

      return props;
    }

    if (status === 'error') {
      const props = {
        options: [],
        disabled: false,
        helper: t('routines-page.fields.exercise.error'),
        error: true,
      };

      return props;
    }

    return { disabled: true, options: [], error: false };
  }, [data, status, t]);

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTabState(newValue);
  };

  const handleAddSection = () => {
    setSectionsState((prevSections) => [
      ...prevSections,
      {
        id: uuidV4(),
        name: '',
        duration: '00:00:00',
        pauseTime: '00:00:00',
        rounds: 1,
        exercises: [],
      },
    ]);
  };

  const handleAddExercise = (sectionIndex: number) => {
    setSectionsState((prevSections) =>
      prevSections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              exercises: [
                ...section.exercises,
                {
                  id: uuidV4(),
                  exerciseId: '',
                  duration: '00:00:00',
                  reps: 1,
                  pauseTime: '00:00:00',
                },
              ],
            }
          : section
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const [activeType, activeSectionId, activeExerciseId] = String(active.id).split('|');
    const [_, overSectionId, overExerciseId] = String(over.id).split('|');

    if (activeType === 'section') {
      setSectionsState((prevSections) => {
        const sections = [...prevSections];
        const oldIndex = sections.findIndex((section) => section.id === activeSectionId);
        const newIndex = sections.findIndex((section) => section.id === overSectionId);
        const [removed] = sections.splice(oldIndex, 1);
        sections.splice(newIndex, 0, removed);
        return sections;
      });
    }

    if (activeType === 'exercise' && activeSectionId === overSectionId) {
      setSectionsState((prevSections) =>
        prevSections.map(section =>
          section.id === activeSectionId
            ? {
                ...section,
                exercises: (() => {
                  const exercises = [...section.exercises];
                  const oldIndex = exercises.findIndex((exercise) => exercise.id === activeExerciseId);
                  const newIndex = exercises.findIndex((exercise) => exercise.id === overExerciseId);
                  const [removed] = exercises.splice(oldIndex, 1);
                  exercises.splice(newIndex, 0, removed);
                  return exercises;
                })(),
              }
            : section
        )
      );
    }
  };

  const handleUpdateSection = <T extends keyof SectionBuilder>(
    index: number,
    field: T,
    value: SectionBuilder[T]
  ) => {
    setSectionsState((prevSections) =>
      prevSections.map((section, sIndex) =>
        sIndex === index ? { ...section, [field]: value } : section
      )
    );
  };

  const handleUpdateExercise = <T extends keyof ExerciseBuilder>(
    sectionIndex: number,
    exerciseIndex: number,
    field: T,
    value: ExerciseBuilder[T]
  ) => {
    setSectionsState((prevSections) =>
      prevSections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              exercises: section.exercises.map((exercise, eIndex) =>
                eIndex === exerciseIndex
                  ? { ...exercise, [field]: value }
                  : exercise
              ),
            }
          : section
      )
    );
  };

  const handleRemoveExercise = (sectionIndex: number, exerciseIndex: number) => {
    setSectionsState((prevSections) =>
      prevSections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              exercises: section.exercises.filter(
                (_, eIndex) => eIndex !== exerciseIndex
              ),
            }
          : section
      )
    );
  };

  const handleRemoveSection = (index: number) => {
    setSectionsState((prevSections) =>
      prevSections.filter((_, sIndex) => sIndex !== index)
    );
  };

  const handleSaveRoutine = () => {
    if (!routineState.name.trim()) {
      snackbar.caution(t('routines-page.validations.routine-name-required'));
      return;
    }

    if (!routineState.equipment) {
      snackbar.caution(t('routines-page.validations.routine-equipment-required'));
      return;
    }

    if (!routineState.level) {
      snackbar.caution(t('routines-page.validations.routine-level-required'));
      return;
    }

    for (const [sectionIndex, section] of sectionsState.entries()) {
      if (!section.name.trim()) {
        snackbar.caution(t('routines-page.validations.routine-section-name-required', { sectionNumber: sectionIndex + 1 }));
        return;
      }

      if (section.duration.trim() === '00:00:00') {
        snackbar.caution(t('routines-page.validations.routine-section-duration-required', { sectionNumber: sectionIndex + 1 }));
        return;
      }

      if (section.rounds <= 0) {
        snackbar.caution(t('routines-page.validations.routine-section-rounds-required', { sectionNumber: sectionIndex + 1 }));
        return;
      }

      for (const [exerciseIndex, exercise] of section.exercises.entries()) {
        if (!exercise.exerciseId) {
          snackbar.caution(t('routines-page.validations.routine-exercise-name-required', { sectionNumber: sectionIndex + 1, exerciseNumber: exerciseIndex + 1 }));
          return;
        }

        if (exercise.duration.trim() === '00:00:00' && exercise.reps <= 0) {
          snackbar.caution(
            t('routines-page.validations.routine-exercise-reps-or-duration-required', { sectionNumber: sectionIndex + 1, exerciseNumber: exerciseIndex + 1 })
          );
          return;
        }
      }
    }

    const payload = {
      name: routineState.name,
      description: '',
      duration: routineState.duration,
      level: routineState.level as RoutineLevel,
      equipment: routineState.equipment as RoutineEquipment,
      routineSections: sectionsState.map((section) => ({
        name: section.name,
        duration: section.duration,
        pause: section.pauseTime,
        laps: section.rounds,
        routineExercises: section.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          duration: exercise.duration,
          repetitions: exercise.reps,
          pause: exercise.pauseTime,
        })),
      })),
    };

    if (id) {
      updateRoutine.mutate(
        { id, payload },
        {
          onSuccess: () => {
            snackbar.success(t('routines-page.actions.update.mutation.success'));
            updateRoutine.reset();
          },
          onError: (mutationError: unknown) => {
            const error = mutationError as AxiosError;
            snackbar.error((error.response?.data as { message?: string })?.message || error.message);
            updateRoutine.reset();
          },
        }
      );
    } else {
      createRoutine.mutate(
        payload,
        {
          onSuccess: () => {
            snackbar.success(t('routines-page.actions.create.mutation.success'));
            createRoutine.reset();
            setRoutineState(initialRoutineState);
            setSectionsState(initialSectionsState);
          },
          onError: (mutationError: unknown) => {
            const error = mutationError as AxiosError;
            snackbar.error((error.response?.data as { message?: string })?.message || error.message);
            createRoutine.reset();
          },
        }
      );
    }
  };

  const isPending = [createRoutine.status, updateRoutine.status].includes('pending');

  return (
    <>
      <Spinner loading={status === 'pending'} label={t('routines-page.queries.exercises.loading')} />
      <Spinner loading={isPending} label={t('routines-page.actions.loading')} />
      <MuiBox sx={{ width: '100%' }}>
        <MuiBox sx={{ width: "100%", mt: 2 }}>
          <MuiTabs value={activeTabState} onChange={handleTabChange}>
            <MuiTab label={t('routines-page.sections.routine')} />
            <MuiTab label={t('routines-page.sections.preview')} />
          </MuiTabs>

          <MuiBox sx={{ my: 2 }}>
            {status === 'error' && (
              <MuiAlert
                sx={{ mb: 2 }}
                severity="error"
                action={
                  <MuiButton color="inherit" size="small" onClick={() => refetch()}>
                    {t('common.wordings.retry')}
                  </MuiButton>
                }
              >
                {t('routines-page.queries.exercises.empty')}
              </MuiAlert>
            )}
            {activeTabState === 0 ? (
              <MuiBox>
                <MuiGrid container spacing={2}>
                  <MuiGrid size={{ xs: 12, md: 6, lg: 5 }}>
                    <MuiTextField
                      fullWidth
                      label={t('routines-page.fields.routine.name')}
                      value={routineState.name}
                      onChange={(e) => setRoutineState((prevState) => ({ ...prevState, name: e.target.value }))}
                    />
                  </MuiGrid>
                  <MuiGrid size={{ xs: 12, sm: 3, md: 3, lg: 2 }}>
                    <TimeMaskTextField
                      label={t('routines-page.fields.routine.duration')}
                      value={routineState.duration}
                      onChange={(e) => setRoutineState((prevState) => ({ ...prevState, duration: e.target.value }))}
                    />
                  </MuiGrid>
                  <MuiGrid size={{ xs: 12, sm: 4, md: 3, lg: 2 }}>
                    <MuiFormControl fullWidth>
                      <MuiInputLabel>{t('routines-page.fields.routine.level')}</MuiInputLabel>
                      <MuiSelect
                        value={routineState.level}
                        label={t('routines-page.fields.routine.level')}
                        onChange={(e) => setRoutineState((prevState) => ({ ...prevState, level: e.target.value }))}
                      >
                        {Object.entries(LEVEL_TRANSLATION).map(([key, value]) => (
                          <MuiMenuItem key={key} value={key}>{value}</MuiMenuItem>
                        ))}
                      </MuiSelect>
                    </MuiFormControl>
                  </MuiGrid>
                  <MuiGrid size={{ xs: 12, sm: 5, md: 4, lg: 3 }}>
                    <MuiFormControl fullWidth>
                      <MuiInputLabel>{t('routines-page.fields.routine.equipment')}</MuiInputLabel>
                      <MuiSelect
                        value={routineState.equipment}
                        label={t('routines-page.fields.routine.equipment')}
                        onChange={(e) => setRoutineState((prevState) => ({ ...prevState, equipment: e.target.value }))}
                      >
                        {Object.entries(EQUIPMENT_TRANSLATION).map(([key, value]) => (
                          <MuiMenuItem key={key} value={key}>{value}</MuiMenuItem>
                        ))}
                      </MuiSelect>
                    </MuiFormControl>
                  </MuiGrid>
                </MuiGrid>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sectionsState.map(section => `section|${section.id}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {sectionsState.map((section, sectionIndex) => (
                      <SortableListSection
                        key={`section|${section.id}`}
                        id={`section|${section.id}`}
                      >
                        <RoutineSectionBuilder
                          key={section.id}
                          section={section}
                          sectionIndex={sectionIndex}
                          autocompleteExercises={autocompleteExerciseProps}
                          onAddExercise={handleAddExercise}
                          onUpdateSection={handleUpdateSection}
                          onUpdateExercise={handleUpdateExercise}
                          onRemoveSection={handleRemoveSection}
                          onRemoveExercise={handleRemoveExercise}
                        />
                      </SortableListSection>
                    ))}
                  </SortableContext>
                </DndContext>
                <MuiBox sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <MuiButton
                    aria-label={t('routines-page.buttons.add-section')}
                    startIcon={<MuiAddIcon />}
                    onClick={handleAddSection}
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    {t('routines-page.buttons.add-section')}
                  </MuiButton>
                  <MuiButton
                    aria-label={t('routines-page.buttons.save-routine')}
                    startIcon={<MuiSaveIcon />}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    disabled={isPending}
                    onClick={handleSaveRoutine}
                  >
                    {t('routines-page.buttons.save-routine')}
                  </MuiButton>
                </MuiBox>
              </MuiBox>
            ) : (
              <>
                <PreviewRoutine
                  routine={routineState}
                  sections={sectionsState}
                  exerciseOptions={autocompleteExerciseProps.options}
                />
                <MuiBox sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <MuiButton
                    aria-label={t('routines-page.buttons.save-routine')}
                    startIcon={<MuiSaveIcon />}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    disabled={isPending}
                    onClick={handleSaveRoutine}
                  >
                    {t('routines-page.buttons.save-routine')}
                  </MuiButton>
                </MuiBox>
              </>
            )}
          </MuiBox>
        </MuiBox>
      </MuiBox>
    </>
  );
};

export default RoutineBuilder;

import React, { useMemo, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
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
import { TimeMaskTextField } from '@/core/components/presentational/textfield';
import { useSnackbar } from '@/core/context/snackbar';
import useQueryExercises from '@/core/exercises/hooks/useQueryExercises';
import PreviewRoutine from '../../presentational/preview-routine';
import RoutineSectionBuilder from '../../presentational/routine-section-builder';
import { EQUIPMENT_TRANSLATION, LEVEL_TRANSLATION } from '../../../constants/routine';

import type { AutocompleteOption } from '@/types/material-ui';
import type {
  AutocompleteExerciseProps,
  ExerciseBuilder,
  RoutineBuilder,
  SectionBuilder,
} from '../../../types';

const defaultRoutine: RoutineBuilder = {
  name: '',
  duration: '00:00:00',
  level: '',
  equipment: '',
};

const RoutineBuilder: React.FC = () => {
  const [activeTabState, setActiveTabState] = useState<number>(0);
  const [routineState, setRoutineState] = useState<RoutineBuilder>(defaultRoutine);
  const [sectionsState, setSectionsState] = useState<Array<SectionBuilder>>([
    {
      id: uuidV4(),
      name: '',
      duration: '00:00:00',
      pauseTime: '00:00:00',
      rounds: 1,
      exercises: [],
    },
  ]);
  const snackbar = useSnackbar();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const { data, status } = useQueryExercises();

  const autocompleteExerciseProps: AutocompleteExerciseProps = useMemo(() => {
    if (status === 'success') {
      const exerciseItems: Array<AutocompleteOption> = data.map(exercise => ({ id: exercise.id, label: exercise.name }));

      const props = {
        options: exerciseItems,
        disabled: exerciseItems.length === 0,
        helper: exerciseItems.length === 0 ? 'No se encontraron ejercicios' : ''
      };

      return props;
    }

    if (status === 'error') {
      const props = {
        options: [],
        disabled: false,
        helper: 'Ocurrió un error al buscar los ejercicios, intenta nuevamente',
        error: true,
      };

      return props;
    }

    return { disabled: true, options: [], error: false };
  }, [data, status]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
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

    const [activeSectionId, activeExerciseId] = String(active.id).split('|');
    const [overSectionId, overExerciseId] = String(over.id).split('|');

    if (activeSectionId === overSectionId) {
      setSectionsState((prevSections) =>
        prevSections.map((section, sIndex) =>
          section.id === activeSectionId
            ? {
                ...section,
                exercises: (() => {
                  const exercises = [...section.exercises];
                  const oldIndex = exercises.findIndex((ex) => ex.id === activeExerciseId);
                  const newIndex = exercises.findIndex((ex) => ex.id === overExerciseId);
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
      snackbar.caution('Debe ingresar el nombre de la rutina.');
      return;
    }

    if (!routineState.equipment) {
      snackbar.caution('Debe seleccionar el equipamiento de la rutina.');
      return;
    }

    if (!routineState.level) {
      snackbar.caution('Debe seleccionar el nivel de la rutina.');
      return;
    }

    for (const [sectionIndex, section] of sectionsState.entries()) {
      if (!section.name.trim()) {
        snackbar.caution(`Debe ingresar el nombre de la sección ${sectionIndex + 1}`);
        return;
      }

      if (!section.duration.trim()) {
        snackbar.caution(`Debe ingresar el tiempo de duración de la sección ${sectionIndex + 1}.`);
        return;
      }

      if (section.rounds <= 0) {
        snackbar.caution(`Debe ingresar la cantidad de rondas de la sección ${sectionIndex + 1}.`);
        return;
      }

      for (const [exerciseIndex, exercise] of section.exercises.entries()) {
        if (!exercise.exerciseId) {
          snackbar.caution(`Debe seleccionar el ejercicio en la sección ${sectionIndex + 1} fila ${exerciseIndex + 1}.`);
          return;
        }

        if (!exercise.duration.trim() && exercise.reps <= 0) {
          snackbar.caution(
            `Debe ingresar las repeticiones o un tiempo de duración en la sección ${sectionIndex + 1} fila ${exerciseIndex + 1}.`
          );
          return;
        }
      }
    }

    const payload = {
      name: routineState.name,
      duration: routineState.duration,
      level: routineState.level,
      equipment: routineState.equipment,
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

    // createRoutine.mutate(payload);
  };

  return (
    <MuiBox sx={{ width: '100%' }}>
      <MuiBox sx={{ width: "100%", mt: 2 }}>
        <MuiTabs value={activeTabState} onChange={handleTabChange}>
          <MuiTab label="Crear rutina" />
          <MuiTab label="Previsualizar" />
        </MuiTabs>

        <MuiBox sx={{ my: 2 }}>
          {activeTabState === 0 ? (
            <MuiBox>
              <MuiGrid container spacing={2}>
                <MuiGrid size={{ xs: 12, md: 6, lg: 5 }}>
                  <MuiTextField
                    fullWidth
                    label="Nombre de la rutina"
                    value={routineState.name}
                    onChange={(e) => setRoutineState((prevState) => ({ ...prevState, name: e.target.value }))}
                  />
                </MuiGrid>
                <MuiGrid size={{ xs: 12, sm: 3, md: 3, lg: 2 }}>
                  <TimeMaskTextField
                    label="Duración"
                    value={routineState.duration}
                    onChange={(e) => setRoutineState((prevState) => ({ ...prevState, duration: e.target.value }))}
                  />
                </MuiGrid>
                <MuiGrid size={{ xs: 12, sm: 4, md: 3, lg: 2 }}>
                  <MuiFormControl fullWidth>
                    <MuiInputLabel>Nivel</MuiInputLabel>
                    <MuiSelect
                      value={routineState.level}
                      label="Nivel"
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
                    <MuiInputLabel>Equipamiento</MuiInputLabel>
                    <MuiSelect
                      value={routineState.equipment}
                      label="Equipamiento"
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
                {sectionsState.map((section, sectionIndex) => (
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
                ))}
              </DndContext>
              <MuiBox sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <MuiButton
                  startIcon={<MuiAddIcon />}
                  onClick={handleAddSection}
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Agregar sección
                </MuiButton>
                <MuiButton
                  startIcon={<MuiSaveIcon />}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleSaveRoutine}
                >
                  Guardar rutina
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
                  startIcon={<MuiSaveIcon />}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleSaveRoutine}
                >
                  Guardar rutina
                </MuiButton>
              </MuiBox>
            </>
          )}
        </MuiBox>
      </MuiBox>
    </MuiBox>
  );
};

export default RoutineBuilder;

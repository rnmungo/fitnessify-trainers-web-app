import MuiBadge, { BadgeProps as MuiBadgeProps } from '@mui/material/Badge';
import MuiBox from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import MuiCardContent from '@mui/material/CardContent';
import MuiTextField from '@mui/material/TextField';
import MuiButton from '@mui/material/Button';
import MuiIconButton from '@mui/material/IconButton';
import MuiAutocomplete from '@mui/material/Autocomplete';
import MuiGrid from '@mui/material/Grid2';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import MuiAddIcon from '@mui/icons-material/Add';
import MuiDeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { TimeMaskTextField } from '@/core/components/presentational/textfield';
import { SortableListItem } from '@/core/components/presentational/list';
import type { AutocompleteExerciseProps, ExerciseBuilder, SectionBuilder } from '../../../types';

interface RoutineSectionBuilderProps {
  section: SectionBuilder;
  sectionIndex: number;
  autocompleteExercises: AutocompleteExerciseProps;
  onAddExercise: (sectionIndex: number) => void;
  onUpdateSection: <T extends keyof SectionBuilder>(index: number, field: T, value: SectionBuilder[T]) => void;
  onUpdateExercise: <T extends keyof ExerciseBuilder>(sectionIndex: number, exerciseIndex: number, field: T, value: ExerciseBuilder[T]) => void;
  onRemoveSection: (sectionIndex: number) => void;
  onRemoveExercise: (sectionIndex: number, exerciseIndex: number) => void;
};

const MuiStyledBadge = styled(MuiBadge)<MuiBadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 4,
    top: 20,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const RoutineSectionBuilder: React.FC<RoutineSectionBuilderProps> = ({
  section,
  sectionIndex,
  autocompleteExercises,
  onAddExercise,
  onUpdateSection,
  onUpdateExercise,
  onRemoveSection,
  onRemoveExercise,
}) => {

  return (
    <MuiStyledBadge
      color="primary"
      badgeContent={sectionIndex + 1}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{ width: '100%' }}
    >
      <MuiCard sx={{ my: 2, width: '100%' }}>
        <MuiCardContent>
          <MuiGrid container spacing={2}>
            <MuiGrid size={{ xs: 12, lg: 6, xl: 9 }}>
              <MuiTextField
                fullWidth
                label="Nombre de la sección"
                value={section.name}
                onChange={(e) => onUpdateSection(sectionIndex, 'name', e.target.value)}
              />
            </MuiGrid>
            <MuiGrid size={{ xs: 12, sm: 4, md: 3, lg: 2, xl: 1 }}>
              <MuiTextField
                fullWidth
                type="number"
                label="Rondas"
                value={section.rounds}
                onChange={(e) => onUpdateSection(sectionIndex, 'rounds', parseInt(e.target.value))}
              />
            </MuiGrid>
            <MuiGrid size={{ xs: 12, sm: 4, md: 3, lg: 2, xl: 1 }}>
              <TimeMaskTextField
                label="Duración"
                value={section.duration}
                onChange={(e) => onUpdateSection(sectionIndex, 'duration', e.target.value)}
              />
            </MuiGrid>
            <MuiGrid size={{ xs: 12, sm: 4, md: 3, lg: 2, xl: 1 }}>
              <TimeMaskTextField
                label="Pausa"
                value={section.pauseTime}
                onChange={(e) => onUpdateSection(sectionIndex, 'pauseTime', e.target.value)}
              />
            </MuiGrid>
          </MuiGrid>

          <MuiBox sx={{ mt: 2 }}>
            <SortableContext
              items={section.exercises.map(ex => `${section.id}|${ex.id}`)}
              strategy={verticalListSortingStrategy}
            >
              {section.exercises.map((exercise, exerciseIndex) => (
                <SortableListItem
                  key={`${section.id}|${exercise.id}`}
                  id={`${section.id}|${exercise.id}`}
                >
                  <MuiGrid size={{ xs: 12, sm: 7, md: 4 }}>
                    <MuiAutocomplete
                      options={autocompleteExercises.options}
                      value={autocompleteExercises.options.find(option => option.id === exercise.exerciseId) || null}
                      onChange={(e, newValue) => onUpdateExercise(sectionIndex, exerciseIndex, 'exerciseId', newValue?.id || '')}
                      disabled={autocompleteExercises.disabled}
                      renderInput={(params) => (
                        <MuiTextField
                          {...params}
                          label="Ejercicio"
                          fullWidth
                          helperText={autocompleteExercises.helper} error={autocompleteExercises.error}
                        />
                      )}
                    />
                  </MuiGrid>
                  <MuiGrid size={{ xs: 12, sm: 4, md: 2 }}>
                    <MuiTextField
                      fullWidth
                      type="number"
                      label="Repeticiones"
                      value={exercise.reps}
                      onChange={(e) => onUpdateExercise(sectionIndex, exerciseIndex, 'reps', parseInt(e.target.value))}
                    />
                  </MuiGrid>
                  <MuiGrid size={{ xs: 12, sm: 4, md: 2 }}>
                    <TimeMaskTextField
                      label="Duración"
                      value={exercise.duration}
                      onChange={(e) => onUpdateExercise(sectionIndex, exerciseIndex, 'duration', e.target.value)}
                    />
                  </MuiGrid>
                  <MuiGrid size={{ xs: 12, sm: 4, md: 2 }}>
                    <TimeMaskTextField
                      label="Pausa"
                      value={exercise.pauseTime}
                      onChange={(e) => onUpdateExercise(sectionIndex, exerciseIndex, 'pauseTime', e.target.value)}
                    />
                  </MuiGrid>
                  <MuiGrid>
                    <MuiIconButton
                      color="error"
                      onClick={() => onRemoveExercise(sectionIndex, exerciseIndex)}
                    >
                      <MuiDeleteIcon />
                    </MuiIconButton>
                  </MuiGrid>
                </SortableListItem>
              ))}
            </SortableContext>
          </MuiBox>

          <MuiBox sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <MuiButton
              startIcon={<MuiAddIcon />}
              onClick={() => onAddExercise(sectionIndex)}
              variant="outlined"
              color="primary"
            >
              Agregar ejercicio
            </MuiButton>
            <MuiButton
              startIcon={<MuiDeleteIcon />}
              onClick={() => onRemoveSection(sectionIndex)}
              variant="text"
              color="error"
            >
              Eliminar sección
            </MuiButton>
          </MuiBox>
        </MuiCardContent>
      </MuiCard>
    </MuiStyledBadge>
  );
};

export default RoutineSectionBuilder;

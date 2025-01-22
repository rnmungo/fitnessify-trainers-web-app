import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { EQUIPMENT_TRANSLATION, LEVEL_TRANSLATION } from '../../../constants/routine';

import type { AutocompleteOption } from '@/types/material-ui';
import type { RoutineEquipment, RoutineLevel } from '@/types/routine';
import type { RoutineBuilder, SectionBuilder } from '../../../types';

interface PreviewRoutineProps {
  routine: RoutineBuilder;
  sections: Array<SectionBuilder>;
  exerciseOptions: Array<AutocompleteOption>;
}

const PreviewRoutine = ({ exerciseOptions, routine, sections }: PreviewRoutineProps) => (
  <MuiBox>
    <MuiTypography variant="h5" gutterBottom>
      {routine.name || 'Rutina sin título'}
    </MuiTypography>
    <MuiBox sx={{ mb: 2 }}>
      <MuiTypography variant="body1" gutterBottom>
        <strong>Duración total:</strong> {routine.duration || 'No establecido'}
      </MuiTypography>
      <MuiTypography variant="body1" gutterBottom>
        <strong>Nivel:</strong> {routine.level
          ? LEVEL_TRANSLATION[routine.level as RoutineLevel]
          : 'No especificado'}
      </MuiTypography>
      <MuiTypography variant="body1" gutterBottom>
        <strong>Equipamiento:</strong> {routine.equipment
          ? EQUIPMENT_TRANSLATION[routine.equipment as RoutineEquipment]
          : 'No especificado'
        }
      </MuiTypography>
    </MuiBox>
    {sections.map((section, index) => (
      <MuiAccordion key={section.id} sx={{ mb: 2 }}>
        <MuiAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`section-${index}-content`} id={`section-${index}-header`}>
          <MuiTypography variant="h6">{section.name || `Sección ${index + 1}`}</MuiTypography>
        </MuiAccordionSummary>
        <MuiAccordionDetails>
          <MuiTypography variant="body2" gutterBottom>
            <strong>Rondas:</strong> {section.rounds}
          </MuiTypography>
          <MuiTypography variant="body2" gutterBottom>
            <strong>Duración:</strong> {section.duration || 'No establecido'}
          </MuiTypography>
          <MuiTypography variant="body2" gutterBottom>
            <strong>Pausa:</strong> {section.pauseTime || 'No establecido'}
          </MuiTypography>

          <MuiTableContainer sx={{ mt: 2 }}>
            <MuiTable size="small">
              <MuiTableHead>
                <MuiTableRow>
                  <MuiTableCell>Ejercicio</MuiTableCell>
                  <MuiTableCell align="center">Repeticiones</MuiTableCell>
                  <MuiTableCell align="center">Duración</MuiTableCell>
                  <MuiTableCell align="center">Pausa</MuiTableCell>
                </MuiTableRow>
              </MuiTableHead>
              <MuiTableBody>
                {section.exercises.map((exercise, exerciseIndex) => (
                  <MuiTableRow key={exercise.id}>
                    <MuiTableCell>
                      {exerciseOptions && exerciseOptions.find(option => option.id === exercise.exerciseId)?.label
                        || `Ejercicio ${exerciseIndex + 1}`}
                    </MuiTableCell>
                    <MuiTableCell align="center">{exercise.reps}</MuiTableCell>
                    <MuiTableCell align="center">{exercise.duration || 'No establecido'}</MuiTableCell>
                    <MuiTableCell align="center">{exercise.pauseTime || 'No establecido'}</MuiTableCell>
                  </MuiTableRow>
                ))}
              </MuiTableBody>
            </MuiTable>
          </MuiTableContainer>
        </MuiAccordionDetails>
      </MuiAccordion>
    ))}
  </MuiBox>
);

export default PreviewRoutine;

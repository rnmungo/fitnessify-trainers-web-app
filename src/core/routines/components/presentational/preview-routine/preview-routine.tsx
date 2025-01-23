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
import { useTranslation } from '@/core/i18n/context';
import { EQUIPMENT_TRANSLATION, LEVEL_TRANSLATION } from '../../../constants/routine';

import type { AutocompleteOption } from '@/types/material-ui';
import type { RoutineEquipment, RoutineLevel } from '@/types/routine';
import type { RoutineBuilder, SectionBuilder } from '../../../types';

interface PreviewRoutineProps {
  routine: RoutineBuilder;
  sections: Array<SectionBuilder>;
  exerciseOptions: Array<AutocompleteOption>;
}

const PreviewRoutine = ({ exerciseOptions, routine, sections }: PreviewRoutineProps) => {
  const { t } = useTranslation();

  return (
    <MuiBox>
      <MuiTypography variant="h5" gutterBottom>
        {routine.name || t('routines-page.preview.untitled-routine')}
      </MuiTypography>
      <MuiBox sx={{ mb: 2 }}>
        <MuiTypography variant="body1" gutterBottom>
          <strong>{t('routines-page.preview.total-duration')}</strong> {routine.duration || t('common.wordings.not-established')}
        </MuiTypography>
        <MuiTypography variant="body1" gutterBottom>
          <strong>{t('routines-page.preview.level')}</strong> {routine.level
            ? LEVEL_TRANSLATION[routine.level as RoutineLevel]
            : t('common.wordings.not-established')}
        </MuiTypography>
        <MuiTypography variant="body1" gutterBottom>
          <strong>{t('routines-page.preview.equipment')}</strong> {routine.equipment
            ? EQUIPMENT_TRANSLATION[routine.equipment as RoutineEquipment]
            : t('common.wordings.not-established')}
        </MuiTypography>
      </MuiBox>
      {sections.map((section, index) => (
        <MuiAccordion key={section.id} sx={{ mb: 2 }}>
          <MuiAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`section-${index}-content`} id={`section-${index}-header`}>
            <MuiTypography variant="h6">{section.name || t('routines-page.preview.section', { number: index + 1 })}</MuiTypography>
          </MuiAccordionSummary>
          <MuiAccordionDetails>
            <MuiTypography variant="body2" gutterBottom>
              <strong>{t('routines-page.preview.rounds')}</strong> {section.rounds}
            </MuiTypography>
            <MuiTypography variant="body2" gutterBottom>
              <strong>{t('routines-page.preview.duration')}</strong> {section.duration || t('common.wordings.not-established')}
            </MuiTypography>
            <MuiTypography variant="body2" gutterBottom>
              <strong>{t('routines-page.preview.pause')}</strong> {section.pauseTime || t('common.wordings.not-established')}
            </MuiTypography>

            <MuiTableContainer sx={{ mt: 2 }}>
              <MuiTable size="small">
                <MuiTableHead>
                  <MuiTableRow>
                    <MuiTableCell>{t('routines-page.preview.table.exercise')}</MuiTableCell>
                    <MuiTableCell align="center">{t('routines-page.preview.table.repetitions')}</MuiTableCell>
                    <MuiTableCell align="center">{t('routines-page.preview.table.duration')}</MuiTableCell>
                    <MuiTableCell align="center">{t('routines-page.preview.table.pause')}</MuiTableCell>
                  </MuiTableRow>
                </MuiTableHead>
                <MuiTableBody>
                  {section.exercises.map((exercise, exerciseIndex) => (
                    <MuiTableRow key={exercise.id}>
                      <MuiTableCell>
                        {exerciseOptions && exerciseOptions.find(option => option.id === exercise.exerciseId)?.label
                          || t('routines-page.preview.exercise', { number: exerciseIndex + 1 })}
                      </MuiTableCell>
                      <MuiTableCell align="center">{exercise.reps}</MuiTableCell>
                      <MuiTableCell align="center">{exercise.duration || t('common.wordings.not-established')}</MuiTableCell>
                      <MuiTableCell align="center">{exercise.pauseTime || t('common.wordings.not-established')}</MuiTableCell>
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
};

export default PreviewRoutine;

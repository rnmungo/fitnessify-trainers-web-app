import { GetServerSideProps, NextPage } from 'next';
import MuiGrid from '@mui/material/Grid2';
import { withGuardPage } from '@/core/auth/guards/withGuardPage';
import { withLayout } from '@/core/components/hoc/layout';
import ExercisesTable from '@/core/exercises/components/containers/exercises-table';

const ExercisesPage: NextPage = () => (
  <MuiGrid
    container
    sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      placeContent: 'start',
      p: 4,
    }}
  >
    <ExercisesTable rowsPerPage={10} />
  </MuiGrid>
);

export const getServerSideProps: GetServerSideProps = withGuardPage(async () => {
  return {
    props: {},
  };
});

export default withLayout(ExercisesPage, {
  title: 'Ejercicios',
  description: 'Aplicación de gestión de rutinas y ejercicios',
  navigation: true,
});

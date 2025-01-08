import { GetServerSideProps, NextPage } from 'next';
import MuiGrid from '@mui/material/Grid2';
import { withGuardPage } from '@/core/auth/guards/withGuardPage';
import { withLayout } from '@/core/components/hoc/layout';
import VideosTable from '@/core/exercises/components/containers/videos-table';

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
    <VideosTable rowsPerPage={10} />
  </MuiGrid>
);

export const getServerSideProps: GetServerSideProps = withGuardPage(async () => {
  return {
    props: {},
  };
});

export default withLayout(ExercisesPage, {
  title: 'Videos',
  description: 'Aplicación de gestión de rutinas y ejercicios',
  navigation: true,
});

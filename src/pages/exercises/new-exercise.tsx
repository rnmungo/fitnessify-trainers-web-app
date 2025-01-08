import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiGrid from '@mui/material/Grid2';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';
import { withGuardPage } from '@/core/auth/guards/withGuardPage';
import { withLayout } from '@/core/components/hoc/layout';
import ExerciseForm from '@/core/exercises/components/containers/exercise-form';
const LinkNoSsr = dynamic(() => import('@/core/components/presentational/link'), { ssr: false });

const NewExercisePage: NextPage = () => (
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
    <MuiStack direction="column" spacing={1}>
      <MuiBreadcrumbs aria-label="breadcrumb">
        <LinkNoSsr underline="hover" color="inherit" href="/">
          Inicio
        </LinkNoSsr>
        <LinkNoSsr underline="hover" color="inherit" href="/exercises">
          Ejercicios
        </LinkNoSsr>
        <MuiTypography color="text.primary">Nuevo ejercicio</MuiTypography>
      </MuiBreadcrumbs>
      <ExerciseForm />
    </MuiStack>
  </MuiGrid>
);

export const getServerSideProps: GetServerSideProps = withGuardPage(async () => {
  return {
    props: {},
  };
});

export default withLayout(NewExercisePage, {
  title: 'Nuevo ejercicio',
  description: 'Aplicación de gestión de rutinas y ejercicios',
  navigation: true,
});

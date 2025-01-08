import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { getIronSession } from 'iron-session';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiGrid from '@mui/material/Grid2';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';
import { withGuardPage } from '@/core/auth/guards/withGuardPage';
import { withLayout } from '@/core/components/hoc/layout';
import ExerciseForm from '@/core/exercises/components/containers/exercise-form';
import { getExercise } from '@/services/exercise/service';
import { sessionOptions } from '@/utilities/session/options';
const LinkNoSsr = dynamic(() => import('@/core/components/presentational/link'), { ssr: false });

import type { ExerciseDetailed } from '@/types/exercise';
import type { Session } from '@/types/session';
import { AxiosError } from 'axios';
import { HTTP_STATUS } from '@/constants/http-status';

interface UpdateExercisePageProps {
  exercise: ExerciseDetailed | undefined
}

const UpdateExercisePage: NextPage<UpdateExercisePageProps> = ({ exercise }) => (
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
        <MuiTypography color="text.primary">{exercise?.name}</MuiTypography>
      </MuiBreadcrumbs>
      <ExerciseForm defaultExercise={exercise} />
    </MuiStack>
  </MuiGrid>
);

export const getServerSideProps: GetServerSideProps = withGuardPage(async (context) => {
  const { query, req, res } = context;
  const id = query.id as string;

  try {
    const session = await getIronSession<Session>(req, res, sessionOptions);
    const exercise = await getExercise({ id, token: session.authorization.token })

    return {
      props: { exercise },
    };
  } catch (responseError: unknown) {
    const error = responseError as AxiosError;
    const status = error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;

    if (status === HTTP_STATUS.NOT_FOUND) {
      return { notFound: true };
    }

    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }
});

export default withLayout(UpdateExercisePage, {
  title: 'Actualizar ejercicio',
  description: 'Aplicación de gestión de rutinas y ejercicios',
  navigation: true,
});

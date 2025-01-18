import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiGrid from '@mui/material/Grid2';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';
import { HTTP_STATUS } from '@/constants/http-status';
import { withGuardPage } from '@/core/auth/guards/withGuardPage';
import { withLayout } from '@/core/components/hoc/layout';
import { getRoutine } from '@/services/routine/service';
import { sessionOptions } from '@/utilities/session/options';

import RoutineBuilder from '@/core/routines/components/containers/routine-builder';

import type { Session } from '@/types/session';

import type {
  RoutineBuilder as RoutineBuilderType,
  SectionBuilder,
} from '@/core/routines/types';

const LinkNoSsr = dynamic(() => import('@/core/components/presentational/link'), { ssr: false });

interface RoutinePlansPageProps {
  id: string;
  routineBuilder: RoutineBuilderType | undefined;
  sectionsBuilder: Array<SectionBuilder>;
}

const RoutinePlansPage: NextPage<RoutinePlansPageProps> = ({ id, routineBuilder, sectionsBuilder }) => (
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
    <MuiStack sx={{ width: '100%' }} direction="column" spacing={3}>
      <MuiBreadcrumbs aria-label="breadcrumb">
        <LinkNoSsr underline="hover" color="inherit" href="/">
          Inicio
        </LinkNoSsr>
        <LinkNoSsr underline="hover" color="inherit" href="/routines">
          Rutinas
        </LinkNoSsr>
        <MuiTypography color="text.primary">{routineBuilder?.name}</MuiTypography>
      </MuiBreadcrumbs>
      <RoutineBuilder
        id={id}
        defaultRoutine={routineBuilder}
        defaultSections={sectionsBuilder}
      />
    </MuiStack>
  </MuiGrid>
);

export const getServerSideProps: GetServerSideProps = withGuardPage(async (context) => {
  const { query, req, res } = context;
  const id = query.id as string;

  try {
    const session = await getIronSession<Session>(req, res, sessionOptions);
    const routine = await getRoutine({ id, token: session.authorization.token });

    const routineBuilder = {
      name: routine.name,
      duration: routine.duration,
      level: routine.level,
      equipment: routine.equipment,
    };

    const sectionsBuilder = routine.routineSections.map(section => ({
      id: section.id,
      name: section.name,
      duration: section.duration,
      pauseTime: section.pause,
      rounds: section.laps,
      exercises: section.routineExercises.map(exercise => ({
        id: exercise.id,
        exerciseId: exercise.exercise.id,
        duration: exercise.duration,
        reps: exercise.repetitions,
        pauseTime: exercise.pause,
      })),
    }));

    return {
      props: { id, routineBuilder, sectionsBuilder },
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

export default withLayout(RoutinePlansPage, {
  title: 'Actualizar rutina',
  description: 'Aplicación de gestión de rutinas y ejercicios',
  navigation: true,
});

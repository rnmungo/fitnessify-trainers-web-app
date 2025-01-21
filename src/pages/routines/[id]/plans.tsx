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
import { useTranslation } from '@/core/i18n/context';
import { withLayout } from '@/core/components/hoc/layout';
import { getRoutine, getRoutinePlans } from '@/services/routine/service';
import { sessionOptions } from '@/utilities/session/options';

import RoutinePlansForm from '@/core/routines/components/containers/routine-plans-form';

import type { RoutineDetailed, RoutinePlan } from '@/types/routine';
import type { Session } from '@/types/session';

const LinkNoSsr = dynamic(() => import('@/core/components/presentational/link'), { ssr: false });

interface RoutinePlansPageProps {
  id: string
  routine: RoutineDetailed | undefined
  routinePlans: Array<RoutinePlan>
}

const RoutinePlansPage: NextPage<RoutinePlansPageProps> = ({ id, routine, routinePlans }) => {
  const { t } = useTranslation();

  return (
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
            {t('main.navigation.home')}
          </LinkNoSsr>
          <LinkNoSsr underline="hover" color="inherit" href="/routines">
            {t('main.navigation.home')}
          </LinkNoSsr>
          <LinkNoSsr underline="hover" color="inherit" href={`/routines/${routine?.id}`}>
            {routine?.name}
          </LinkNoSsr>
          <MuiTypography color="text.primary">{t('main.navigation.plans')}</MuiTypography>
        </MuiBreadcrumbs>
        <RoutinePlansForm id={id} routinePlans={routinePlans} />
      </MuiStack>
    </MuiGrid>
  );
};

export const getServerSideProps: GetServerSideProps = withGuardPage(async (context) => {
  const { query, req, res } = context;
  const id = query.id as string;

  try {
    const session = await getIronSession<Session>(req, res, sessionOptions);

    const [routine, routinePlans] = await Promise.all([
      getRoutine({ id, token: session.authorization.token }),
      getRoutinePlans({ id, token: session.authorization.token }),
    ]);

    return {
      props: { id, routine, routinePlans },
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
  title: 'main.navigation.update-plans',
  description: 'main.meta.description',
  navigation: true,
});

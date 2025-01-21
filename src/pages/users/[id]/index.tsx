import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { getIronSession } from 'iron-session';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiGrid from '@mui/material/Grid2';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';
import { withGuardPage } from '@/core/auth/guards/withGuardPage';
import { useTranslation } from '@/core/i18n/context';
import { withLayout } from '@/core/components/hoc/layout';
import SubscriptionsTable from '@/core/subscriptions/components/containers/subscriptions-table';
import { getUserProfile } from '@/services/user/service';
import { sessionOptions } from '@/utilities/session/options';
const LinkNoSsr = dynamic(() => import('@/core/components/presentational/link'), { ssr: false });

import type { Profile } from '@/types/session';
import type { Session } from '@/types/session';
import { AxiosError } from 'axios';
import { HTTP_STATUS } from '@/constants/http-status';

interface UpdateUserPageProps {
  id: string
  profile: Profile | undefined
}

const UpdateUserPage: NextPage<UpdateUserPageProps> = ({ id, profile }) => {
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
      <MuiStack sx={{ width: '100%' }} direction="column" spacing={1}>
        <MuiBreadcrumbs aria-label="breadcrumb">
          <LinkNoSsr underline="hover" color="inherit" href="/">
            {t('main.navigation.home')}
          </LinkNoSsr>
          <LinkNoSsr underline="hover" color="inherit" href="/users">
            {t('main.navigation.customers')}
          </LinkNoSsr>
          <MuiTypography color="text.primary">{`${profile?.name} ${profile?.lastName}`}</MuiTypography>
        </MuiBreadcrumbs>
        <SubscriptionsTable id={id} />
      </MuiStack>
    </MuiGrid>
  );
};

export const getServerSideProps: GetServerSideProps = withGuardPage(async (context) => {
  const { query, req, res } = context;
  const id = query.id as string;

  try {
    const session = await getIronSession<Session>(req, res, sessionOptions);
    const profile = await getUserProfile({ id, token: session.authorization.token })

    return {
      props: { id, profile },
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

export default withLayout(UpdateUserPage, {
  title: 'main.navigation.update-customer',
  description: 'main.meta.description',
  navigation: true,
});

import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiGrid from '@mui/material/Grid2';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';
import { withGuardPage } from '@/core/auth/guards/withGuardPage';
import { useTranslation } from '@/core/i18n/context';
import { withLayout } from '@/core/components/hoc/layout';
import VideosTable from '@/core/exercises/components/containers/videos-table';
const LinkNoSsr = dynamic(() => import('@/core/components/presentational/link'), { ssr: false });

const VideosPage: NextPage = () => {
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
          <MuiTypography color="text.primary">{t('main.navigation.videos')}</MuiTypography>
        </MuiBreadcrumbs>
        <VideosTable rowsPerPage={10} />
      </MuiStack>
    </MuiGrid>
  );
};

export const getServerSideProps: GetServerSideProps = withGuardPage(async () => {
  return {
    props: {},
  };
});

export default withLayout(VideosPage, {
  title: 'main.navigation.videos',
  description: 'main.meta.description',
  navigation: true,
});

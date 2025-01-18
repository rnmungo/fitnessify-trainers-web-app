import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiGrid from '@mui/material/Grid2';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';
import { withGuardPage } from '@/core/auth/guards/withGuardPage';
import { withLayout } from '@/core/components/hoc/layout';
import RoutinesTable from '@/core/routines/components/containers/routines-table';
const LinkNoSsr = dynamic(() => import('@/core/components/presentational/link'), { ssr: false });

const RoutinesPage: NextPage = () => (
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
          Inicio
        </LinkNoSsr>
        <MuiTypography color="text.primary">Rutinas</MuiTypography>
      </MuiBreadcrumbs>
      <RoutinesTable rowsPerPage={10} />
    </MuiStack>
  </MuiGrid>
);

export const getServerSideProps: GetServerSideProps = withGuardPage(async () => {
  return {
    props: {},
  };
});

export default withLayout(RoutinesPage, {
  title: 'Rutinas',
  description: 'Aplicación de gestión de rutinas y ejercicios',
  navigation: true,
});

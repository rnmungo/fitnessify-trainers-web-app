import { GetServerSideProps, NextPage } from 'next';
import MuiGrid from '@mui/material/Grid2';
import { withGuardPage } from '@/core/auth/guards/withGuardPage';
import { withLayout } from '@/core/components/hoc/layout';
import UsersTable from '@/core/users/components/containers/users-table';

const UsersPage: NextPage = () => (
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
    <UsersTable rowsPerPage={10} />
  </MuiGrid>
);

export const getServerSideProps: GetServerSideProps = withGuardPage(async () => {
  return {
    props: {},
  };
});

export default withLayout(UsersPage, {
  title: 'Usuarios',
  description: 'Aplicación de gestión de rutinas y ejercicios',
  navigation: true,
});

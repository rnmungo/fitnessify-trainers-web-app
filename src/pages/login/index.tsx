import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import MuiGrid from '@mui/material/Grid2';
import MuiPaper from '@mui/material/Paper';
import LoginFormContainer from '@/core/auth/components/containers/login-form';
import { withGuardPage } from '@/core/auth/guards/withGuardPage';
import { withLayout } from '@/core/components/hoc/layout';

const LoginPage: NextPage = () => (
  <MuiGrid container component="main" sx={{ height: '100vh' }}>
    <MuiGrid
      size={{ xs: 'grow', md: 6 }}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <MuiGrid sx={{ width: '100%', p: 6 }}>
        <Image
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          src="/illustrations/two_factor.svg"
          alt="Welcome to Fitnessify Backoffice UI"
          quality={100}
          priority={true}
          width={980}
          height={425}
        />
      </MuiGrid>
    </MuiGrid>
    <MuiGrid
      size={{ xs: 12, md: 6 }}
      justifyContent="center"
      component={MuiPaper}
      elevation={6}
      square
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        p: 6,
      }}
    >
      <LoginFormContainer />
    </MuiGrid>
  </MuiGrid>
);

export const getServerSideProps: GetServerSideProps = withGuardPage(async () => {
  return {
    props: {},
  };
});

export default withLayout(LoginPage, {
  title: 'Iniciar sesión',
  description: 'Aplicación de gestión de rutinas y planes',
  navigation: false,
});

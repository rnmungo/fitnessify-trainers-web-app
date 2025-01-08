import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import MuiGrid from '@mui/material/Grid2';
import MuiTypography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { withGuardPage } from '@/core/auth/guards/withGuardPage';
import { withLayout } from '@/core/components/hoc/layout';
import useMedia from '@/core/hooks/useMedia';

const HomePage: NextPage = () => {
  const matches = useMedia('md');

  return (
    <MuiGrid
      container
      sx={{
        width: '100%',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        placeContent: 'center',
        gap: 4,
        pl: 4,
        pr: 4,
        flexDirection: matches ? 'row' : 'column',
      }}
    >
      <MuiGrid size={{ xs: 12, sm: 8, md: 6, lg: 4, xl: 4 }}>
        <Image
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          src="/illustrations/hello.svg"
          alt="Welcome to Auth UI"
          quality="100"
          priority
          width={980}
          height={425}
        />
      </MuiGrid>
      <MuiGrid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: matches ? 'left' : 'center',
        }}
      >
        <MuiTypography
          component="p"
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          ¡Hola!
        </MuiTypography>
        <MuiTypography component="p" variant="h5" sx={{ fontWeight: 'normal' }}>
          Bienvenido al sistema
        </MuiTypography>
        <MuiTypography
          component="p"
          variant="h6"
          sx={{ fontWeight: 'normal', color: grey[500] }}
        >
          Gestioná tus rutinas y planes
        </MuiTypography>
      </MuiGrid>
    </MuiGrid>
  );
}

export const getServerSideProps: GetServerSideProps = withGuardPage(async () => {
  return {
    props: {},
  };
});

export default withLayout(HomePage, {
  title: 'Inicio',
  description: 'Aplicación de gestión de rutinas y planes',
});

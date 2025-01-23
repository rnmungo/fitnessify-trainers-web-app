import Image from 'next/image';
import MuiGrid from '@mui/material/Grid2';
import MuiTypography from '@mui/material/Typography';
import { withLayout } from '@/core/components/hoc/layout';

const ErrorPage = () => (
  <MuiGrid
    container
    justifyContent="center"
    component="main"
    sx={{ height: '100vh' }}
  >
    <MuiGrid
      size={{ xs: 10, sm: 8, md: 6, lg: 4, xl: 4 }}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <MuiGrid sx={{ width: '100%', pl: 6, pr: 6 }}>
        <Image
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          src="/illustrations/sorry.svg"
          alt="Auth UI - Error Page"
          quality="100"
          priority
          width={720}
          height={720}
        />
      </MuiGrid>
    </MuiGrid>
    <MuiGrid size={12} sx={{ textAlign: 'center' }}>
      <MuiTypography component="p" variant="h6" gutterBottom>
        Lo sentimos
      </MuiTypography>
      <MuiTypography component="p" variant="h6" gutterBottom>
        El servicio no está disponible, nuestro equipo está trabajando para
        solucionarlo a la brevedad
      </MuiTypography>
    </MuiGrid>
  </MuiGrid>
);

export default withLayout(ErrorPage, {
  title: 'Servicio no disponible',
  description: 'Aplicación de gestión de usuarios y privilegios',
  navigation: false,
});

import dynamic from 'next/dynamic';
import Image from 'next/image';
import MuiGrid from '@mui/material/Grid2';
import MuiTypography from '@mui/material/Typography';
import { withLayout } from '@/core/components/hoc/layout';
const LinkNoSsr = dynamic(() => import('@/core/components/presentational/link'), { ssr: false });

const NotFoundPage = () => (
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
          src="/illustrations/not_found.svg"
          alt="Auth UI - NotFound Page"
          quality="100"
          priority
          width={720}
          height={720}
        />
      </MuiGrid>
    </MuiGrid>
    <MuiGrid size={12} sx={{ textAlign: 'center' }}>
      <MuiTypography component="p" variant="h6" gutterBottom>
        Esta página no fue encontrada
      </MuiTypography>
      <LinkNoSsr href="/">Diríjase a la página de inicio</LinkNoSsr>
    </MuiGrid>
  </MuiGrid>
);

export default withLayout(NotFoundPage, {
  title: 'Esta página no fue encontrada',
  description: 'Aplicación de gestión de usuarios y privilegios',
  navigation: false,
});

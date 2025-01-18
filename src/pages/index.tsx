import { GetServerSideProps, NextPage } from 'next';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import MuiCardContent from '@mui/material/CardContent';
import MuiCardMedia from '@mui/material/CardMedia';
import MuiContainer from '@mui/material/Container';
import MuiGrid from '@mui/material/Grid2';
import MuiTypography from '@mui/material/Typography';
import MuiFitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MuiAssignmentIcon from '@mui/icons-material/Assignment';
import MuiGroupIcon from '@mui/icons-material/Group';
import { styled } from '@mui/system';
import { withGuardPage } from '@/core/auth/guards/withGuardPage';
import { withLayout } from '@/core/components/hoc/layout';

const StyledCard = styled(MuiCard)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '24px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
  }
}));

const StyledCardMedia = styled(MuiCardMedia)({
  paddingTop: '56.25%',
  position: 'relative'
});

const features = [
  {
    title: 'Rutinas',
    description: 'Creá, personalizá y organizá programas de entrenamiento para tus clientes, adaptados a su nivel y objetivos.',
    icon: <MuiFitnessCenterIcon />,
    image: '/illustrations/add-tasks.svg'
  },
  {
    title: 'Ejercicios',
    description: 'Armá tu biblioteca completa de ejercicios con video tutoriales de alta calidad para guiar a tus clientes en cada ejercicio.',
    icon: <MuiAssignmentIcon />,
    image: '/illustrations/personal-training.svg'
  },
  {
    title: 'Suscripciones',
    description: 'Gestioná las subscripciones de tus clientes para acceder al contenido que ofrecés.',
    icon: <MuiGroupIcon />,
    image: '/illustrations/subscriptions.svg'
  }
];

const HomePage: NextPage = () => (
  <MuiContainer maxWidth="lg" sx={{ py: 4 }}>
    <MuiBox mb={6} textAlign="center">
      <MuiTypography variant="h3" component="h1" gutterBottom>
        Bienvenido a Fitnessify
      </MuiTypography>
      <MuiTypography variant="h6" color="textSecondary">
        Tu plataforma integral para gestionar entrenamientos, ejercicios y más
      </MuiTypography>
    </MuiBox>

    <MuiGrid container spacing={4}>
      {features.map((feature) => (
        <MuiGrid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
          <StyledCard>
            <StyledCardMedia
              sx={{ backgroundSize: 'contain' }}
              image={feature.image}
              title={feature.title}
            />
            <MuiCardContent>
              <MuiTypography gutterBottom variant="h5" component="h2">
                {feature.title}
              </MuiTypography>
              <MuiTypography variant="body2" color="textSecondary">
                {feature.description}
              </MuiTypography>
            </MuiCardContent>
          </StyledCard>
        </MuiGrid>
      ))}
    </MuiGrid>
    <MuiBox mt={6} textAlign="center">
      <MuiTypography component="p" variant="body1" color="textSecondary" gutterBottom>
        Accedé al manual de usuario para obtener una guía completa sobre cómo utilizar la plataforma. Podés descargarlo para consultarlo en cualquier momento.
      </MuiTypography>
      <MuiButton
        sx={{ mt: 1 }}
        variant="text"
        color="primary"
        size="large"
        href="/documentation/user_manual.pdf"
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        Descargar Manual
      </MuiButton>
    </MuiBox>
  </MuiContainer>
);

export const getServerSideProps: GetServerSideProps = withGuardPage(async () => {
  return {
    props: {},
  };
});

export default withLayout(HomePage, {
  title: 'Inicio',
  description: 'Aplicación de gestión de rutinas y planes',
});

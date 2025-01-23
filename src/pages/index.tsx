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
import { useTranslation } from '@/core/i18n/context';
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
    title: 'home-page.features.routines.title',
    description: 'home-page.features.routines.description',
    icon: <MuiFitnessCenterIcon />,
    image: '/illustrations/add-tasks.svg'
  },
  {
    title: 'home-page.features.exercises.title',
    description: 'home-page.features.exercises.description',
    icon: <MuiAssignmentIcon />,
    image: '/illustrations/personal-training.svg'
  },
  {
    title: 'home-page.features.subscriptions.title',
    description: 'home-page.features.subscriptions.description',
    icon: <MuiGroupIcon />,
    image: '/illustrations/subscriptions.svg'
  }
];

const HomePage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <MuiContainer maxWidth="lg" sx={{ py: 4 }}>
      <MuiBox mb={6} textAlign="center">
        <MuiTypography variant="h3" component="h1" gutterBottom>
          {t('home-page.presentation.title')}
        </MuiTypography>
        <MuiTypography variant="h6" color="textSecondary">
          {t('home-page.presentation.sub-title')}
        </MuiTypography>
      </MuiBox>
      <MuiGrid container spacing={4}>
        {features.map((feature) => (
          <MuiGrid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
            <StyledCard>
              <StyledCardMedia
                sx={{ backgroundSize: 'contain' }}
                image={feature.image}
                title={t(feature.title)}
              />
              <MuiCardContent>
                <MuiTypography gutterBottom variant="h5" component="h2">
                  {t(feature.title)}
                </MuiTypography>
                <MuiTypography variant="body2" color="textSecondary">
                  {t(feature.description)}
                </MuiTypography>
              </MuiCardContent>
            </StyledCard>
          </MuiGrid>
        ))}
      </MuiGrid>
      <MuiBox mt={6} textAlign="center">
        <MuiTypography component="p" variant="body1" color="textSecondary" gutterBottom>
          {t('home-page.user_manual.explain')}
        </MuiTypography>
        <MuiButton
          sx={{ mt: 1 }}
          aria-label={t('home-page.user_manual.download')}
          variant="text"
          color="primary"
          size="large"
          href="/documentation/user_manual.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          {t('home-page.user_manual.download')}
        </MuiButton>
      </MuiBox>
    </MuiContainer>
  );
};

export const getServerSideProps: GetServerSideProps = withGuardPage(async () => {
  return {
    props: {},
  };
});

export default withLayout(HomePage, {
  title: 'main.navigation.home',
  description: 'main.meta.description',
  navigation: true,
});

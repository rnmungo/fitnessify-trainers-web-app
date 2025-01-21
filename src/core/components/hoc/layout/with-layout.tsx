import { ComponentType, FC } from 'react';
import Head from 'next/head';
import MuiGrid from '@mui/material/Grid2';
import NavigationContainer from '@/core/auth/components/containers/navigation';
import { useTranslation } from '@/core/i18n/context';

interface LayoutProps {
  title: string;
  description: string;
  navigation?: boolean;
}

const withLayout = (
  Component: ComponentType<any>,
  { title, description, navigation = true }: LayoutProps
): FC => {
  const WrappedComponent: FC = (props) => {
    const { t } = useTranslation();

    return (
      <>
        <Head>
          <title>{t(title)}</title>
          <meta name="description" content={t(description)} />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <MuiGrid sx={{ width: '100%', height: '100vh' }}>
          {navigation && <NavigationContainer />}
          <MuiGrid component="main" sx={{ width: '100%', height: navigation ? '90vh' : '100vh' }}>
            <Component {...props} />
          </MuiGrid>
        </MuiGrid>
      </>
    );
  };

  return WrappedComponent;
};

export default withLayout;

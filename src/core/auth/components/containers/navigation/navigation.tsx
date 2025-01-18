import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/core/components/presentational/navigation';
import Spinner from '@/core/components/presentational/spinner';
import { getInitialLetters } from '@/utilities/string.utility';
import { useMutationSignOut } from '../../../hooks';
import { useSession } from '../../../context/session';

const NavigationContainer: React.FC = () => {
  const router = useRouter();
  const session = useSession();
  const signOut = useMutationSignOut();

  const memorizedLinks = useMemo(() => {
    const links = [
      { label: 'Rutinas', onClick: () => router.push('/routines') },
      {
        label: 'Ejercicios',
        onClick: () => router.push('/exercises'),
      },
      {
        label: 'Videos',
        onClick: () => router.push('/videos'),
      },
      { label: 'Usuarios', onClick: () => router.push('/users') },
    ];

    return links;
  }, [router]);

  const memorizedSettings = useMemo(() => {
     const settings = [
      {
        label: 'Cambiar Contraseña',
        onClick: () => router.push('/profile/change-password'),
      },
      { label: 'Cerrar Sesión', onClick: () => signOut.mutate() },
    ];

    return settings;
  }, [router, signOut]);

  const avatarLabel = useMemo(() => {
    if (session.status === 'success') {
      return getInitialLetters(session?.data?.profile?.name, session?.data?.profile?.lastName);
    }
    return '';
  }, [session?.data?.profile?.lastName, session?.data?.profile?.name, session.status]);

  useEffect(() => {
    if (signOut.status === 'success') {
      signOut.reset();
      router.push('/login');
    }
  }, [router, signOut]);

  return (
    <>
      <Spinner loading={signOut.status === 'pending'} label="Cerrando sesión" />
      <Navigation
        logo={session.data?.profile?.tenant?.name || 'Inicio'}
        avatar={{
          text: avatarLabel,
        }}
        links={memorizedLinks}
        settings={memorizedSettings}
      />
    </>
  );
};

export default NavigationContainer;

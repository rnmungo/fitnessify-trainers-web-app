import { createContext, useContext, ReactNode } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import useQueryUserSession from '../../hooks/useQueryUserSession';
import type { Session } from '@/types/session';

const SessionContext = createContext<UseQueryResult<Session, Error> | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within an SessionContext');
  }

  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

const SessionProvider = ({ children }: SessionProviderProps) => {
  const query = useQueryUserSession();

  return (
    <SessionContext.Provider value={query}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;

import { createContext, forwardRef, useCallback, useContext, useState, ReactNode, Ref } from 'react';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import MuiSnackbar from '@mui/material/Snackbar';

type SnackbarSeverity = AlertColor | 'default';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

interface SnackbarContextProps {
  notify: (message: string, variant?: SnackbarSeverity) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

const Alert = forwardRef(function Alert(props: AlertProps, ref: Ref<HTMLDivElement>) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }

  const { notify } = context;

  const success = (message: string) => notify(message, 'success');
  const error = (message: string) => notify(message, 'error');
  const caution = (message: string) => notify(message, 'warning');
  const info = (message: string) => notify(message, 'info');

  return { success, error, caution, info };
};

interface SnackbarProviderProps {
  children: ReactNode;
}

const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'default',
  });

  const notify = useCallback(
    (message: string, variant: SnackbarSeverity = 'default') => {
      setSnackbar({
        open: true,
        message,
        severity: variant,
      });
    },
    [],
  );

  const handleClose = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <>
      <MuiSnackbar
        key="bottom center"
        autoHideDuration={20000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbar.open}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={snackbar.severity !== 'default' ? snackbar.severity : undefined}>
          {snackbar.message}
        </Alert>
      </MuiSnackbar>
      <SnackbarContext.Provider value={{ notify }}>{children}</SnackbarContext.Provider>
    </>
  );
};

export default SnackbarProvider;

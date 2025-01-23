import MuiGrid from '@mui/material/Grid2';
import MuiTypography from '@mui/material/Typography';
import MuiCircularProgress from '@mui/material/CircularProgress';
import Backdrop from '../../styled/backdrop';

interface SpinnerProps {
  label?: string;
  loading?: boolean;
}

const Spinner = ({ label = '', loading = false }: SpinnerProps) => (
  <Backdrop open={loading}>
    <MuiGrid container justifyContent="center" alignItems="center" gap={4}>
      <MuiGrid size={12}>
        <MuiCircularProgress color="inherit" size={60} />
      </MuiGrid>
      {label && (
        <MuiGrid size={12}>
          <MuiTypography color="text.primary" variant="h5" align="center">
            {label}
          </MuiTypography>
        </MuiGrid>
      )}
    </MuiGrid>
  </Backdrop>
);

export default Spinner;

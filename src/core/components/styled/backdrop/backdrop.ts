import MuiBackdrop from '@mui/material/Backdrop';
import { styled } from '@mui/material/styles';

const Backdrop = styled(MuiBackdrop)(({ theme }) => ({
  color: theme.palette.text.primary,
  textAlign: 'center',
  zIndex: 1030,
}));

export default Backdrop;

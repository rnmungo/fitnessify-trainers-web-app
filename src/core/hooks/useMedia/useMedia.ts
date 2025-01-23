import { useTheme, Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Breakpoint } from '@mui/system';

const useMedia = (breakpoint: Breakpoint): boolean => {
  const theme: Theme = useTheme();
  const matches: boolean = useMediaQuery(theme.breakpoints.up(breakpoint));
  return matches;
};

export default useMedia;

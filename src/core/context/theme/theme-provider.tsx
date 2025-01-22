import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, ReactNode, Dispatch } from 'react';
import MuiCssBaseline from '@mui/material/CssBaseline';
import { useTheme, createTheme, ThemeProvider as MuiThemeProvider, ThemeOptions } from '@mui/material/styles';
import { UI_MODE_KEY } from '@/constants/local-storage-keys';

interface ThemeState {
  paletteType: 'light' | 'dark';
}

interface ChangeThemeAction {
  type: 'CHANGE_THEME';
  payload: 'light' | 'dark';
}

type ThemeAction = ChangeThemeAction;

interface ThemeProviderProps {
  children: ReactNode;
  theme: ThemeOptions;
}

const ThemeContext = createContext<Dispatch<ThemeAction>>(() => {});

export const useThemeType = (): () => void => {
  const dispatch = useContext(ThemeContext);
  const theme = useTheme();
  const changeTheme = useCallback(
    () =>
      dispatch({
        type: 'CHANGE_THEME',
        payload: theme.palette.mode === 'light' ? 'dark' : 'light',
      }),
    [theme.palette.mode, dispatch],
  );

  return changeTheme;
};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'CHANGE_THEME':
      localStorage.setItem(UI_MODE_KEY, action.payload);
      return {
        ...state,
        paletteType: action.payload,
      };
    default:
      throw new Error('Unhandled action type');
  }
};

const ThemeProvider = ({ children, theme }: ThemeProviderProps) => {
  const themeInitialOptions: ThemeState = {
    paletteType: 'dark',
  };

  const [themeOptions, dispatch] = useReducer(themeReducer, themeInitialOptions);

  const memoizedTheme = useMemo(() => {
    return createTheme({
      ...theme,
      palette: {
        ...theme.palette,
        mode: themeOptions.paletteType,
        contrastThreshold: 4.5,
      },
    });
  }, [theme, themeOptions.paletteType]);

  useEffect(() => {
    const modeFromStore = localStorage.getItem(UI_MODE_KEY);
    dispatch({
      type: 'CHANGE_THEME',
      payload: (modeFromStore as 'light' | 'dark') || themeOptions.paletteType,
    });
  }, [themeOptions.paletteType]);

  return (
    <MuiThemeProvider theme={memoizedTheme}>
      <ThemeContext.Provider value={dispatch}>
        <MuiCssBaseline />
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  );
};

export default ThemeProvider;

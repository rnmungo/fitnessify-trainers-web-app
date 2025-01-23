import { useState, MouseEvent } from 'react';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import MuiInputAdornment from '@mui/material/InputAdornment';
import MuiIconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTranslation } from '@/core/i18n/context';

export interface PasswordFieldProps extends Omit<TextFieldProps, 'slotProps'> {
  slotProps?: TextFieldProps['slotProps'];
}

const PasswordField = ({
  slotProps = {},
  ...textFieldProps
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClick = () => {
    setVisible(prevState => !prevState);
  };

  return (
    <MuiTextField
      slotProps={{
        htmlInput: {
          ...slotProps.htmlInput,
          type: visible ? 'text' : 'password',
        },
        input: {
          ...slotProps.input,
          endAdornment: (
            <MuiInputAdornment position="end">
              <MuiIconButton
                aria-label={t('password-field.icon-label')}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                edge="end"
                tabIndex={-1}
              >
                {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </MuiIconButton>
            </MuiInputAdornment>
          ),
        },
      }}
      {...textFieldProps}
    />
  );
};

export default PasswordField;

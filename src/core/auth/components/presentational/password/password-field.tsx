import React, { useState, MouseEvent } from 'react';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import MuiInputAdornment from '@mui/material/InputAdornment';
import MuiIconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export interface PasswordFieldProps extends Omit<TextFieldProps, 'InputProps'> {
  inputProps?: React.HTMLProps<HTMLInputElement>;
  InputProps?: TextFieldProps['InputProps'];
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  inputProps = {},
  InputProps = {},
  ...textFieldProps
}) => {
  const [visible, setVisible] = useState(false);

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClick = () => {
    setVisible(prevState => !prevState);
  };

  return (
    <MuiTextField
      inputProps={{
        ...inputProps,
        type: visible ? 'text' : 'password',
      }}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <MuiInputAdornment position="end">
            <MuiIconButton
              aria-label="Toggle password visibility"
              onMouseDown={handleMouseDown}
              onClick={handleClick}
              edge="end"
              tabIndex={-1}
            >
              {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </MuiIconButton>
          </MuiInputAdornment>
        ),
      }}
      {...textFieldProps}
    />
  );
};

export default PasswordField;

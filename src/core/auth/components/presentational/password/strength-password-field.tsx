import React from 'react';
import MuiCircleIcon from '@mui/icons-material/Circle';
import MuiInputAdornment from '@mui/material/InputAdornment';
import { getPasswordStrength } from '../../../utilities';
import PasswordField, { PasswordFieldProps } from './password-field';

interface StrengthPasswordFieldProps extends PasswordFieldProps {
  value: string;
}

const StrengthPasswordField: React.FC<StrengthPasswordFieldProps> = ({
  value,
  InputProps = {},
  ...textFieldProps
}) => {
  const strength = getPasswordStrength(value);

  return (
    <PasswordField
      {...textFieldProps}
      focused={Boolean(value)}
      value={value}
      label={strength.label}
      InputProps={{
        ...InputProps,
        startAdornment: (
          <MuiInputAdornment position="start">
            <MuiCircleIcon color={strength.color} />
          </MuiInputAdornment>
        ),
      }}
      color={strength.color}
    />
  );
};

export default StrengthPasswordField;

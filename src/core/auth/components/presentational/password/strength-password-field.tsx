import MuiCircleIcon from '@mui/icons-material/Circle';
import MuiInputAdornment from '@mui/material/InputAdornment';
import { useTranslation } from '@/core/i18n/context';
import { getPasswordStrength } from '../../../utilities';
import PasswordField, { PasswordFieldProps } from './password-field';

interface StrengthPasswordFieldProps extends PasswordFieldProps {
  value: string;
}

const StrengthPasswordField = ({
  value,
  slotProps = {},
  ...textFieldProps
}: StrengthPasswordFieldProps) => {
  const { t } = useTranslation();
  const strength = getPasswordStrength(value);

  return (
    <PasswordField
      {...textFieldProps}
      focused={Boolean(value)}
      value={value}
      label={t(strength.label)}
      slotProps={{
        input: {
          ...slotProps.input,
          startAdornment: (
            <MuiInputAdornment position="start">
              <MuiCircleIcon color={strength.color} />
            </MuiInputAdornment>
          ),
        },
      }}
      color={strength.color}
    />
  );
};

export default StrengthPasswordField;

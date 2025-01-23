import MuiTooltip from '@mui/material/Tooltip';
import MuiInfoIcon from '@mui/icons-material/Info';
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
              <MuiTooltip
                title={t('common.password-strength.recommendations')}
                arrow
              >
                <MuiInfoIcon sx={{ cursor: 'pointer' }} color={strength.color} />
              </MuiTooltip>
            </MuiInputAdornment>
          ),
        },
      }}
      color={strength.color}
    />
  );
};

export default StrengthPasswordField;

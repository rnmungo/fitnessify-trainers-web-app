import MuiTextField from '@mui/material/TextField';
import InputMask from 'react-input-mask';

interface TimeMaskTextFieldProps {
  label: string;
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TimeMaskTextField = ({
  label,
  value,
  onChange,
  ...props
}: TimeMaskTextFieldProps) => (
  <InputMask
    mask="99:99:99"
    value={value || ""}
    onChange={onChange}
    maskChar="0"
  >
    {() => <MuiTextField label={label} fullWidth {...props} />}
  </InputMask>
);

export default TimeMaskTextField;

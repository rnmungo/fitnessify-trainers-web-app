const STRONG_REGEX = new RegExp(
  '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})'
);
const MEDIUM_REGEX = new RegExp(
  '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))'
);

interface PasswordStrength {
  label: string;
  color: 'primary' | 'success' | 'warning' | 'error';
}

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { label: 'common.password-strength.password', color: 'primary' };
  if (STRONG_REGEX.test(password))
    return { label: 'common.password-strength.secure-password', color: 'success' };
  if (MEDIUM_REGEX.test(password))
    return { label: 'common.password-strength.weak-password', color: 'warning' };
  return { label: 'common.password-strength.insecure-password', color: 'error' };
};

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MuiButton from '@mui/material/Button';
import MuiGrid from '@mui/material/Grid2';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Spinner from '@/core/components/presentational/spinner';
import { useSnackbar } from '@/core/context/snackbar';
import { useTranslation } from '@/core/i18n/context';
import { PasswordField, StrengthPasswordField } from '../../presentational/password';
import { useMutationChangePassword } from '../../../hooks';

type ConfirmPasswordProps = {
  color?: 'error' | 'success' | 'primary' | 'secondary' | 'info' | 'warning';
  helperText?: string;
};

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const validationSchema = yup.object({
  currentPassword: yup.string().required('change-password-page.validations.current-password-required'),
  newPassword: yup.string().required('change-password-page.validations.new-password-required'),
  confirmPassword: yup.string().required('change-password-page.validations.confirm-password-required').oneOf([yup.ref('newPassword')], 'change-password-page.validations.confirm-password-no-match'),
});

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const snackbar = useSnackbar();
  const changePassword = useMutationChangePassword();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { currentPassword, newPassword, confirmPassword } = values;
      changePassword.mutate({ currentPassword, newPassword, confirmPassword });
    },
  });

  useEffect(() => {
    if (changePassword.status === 'success') {
      snackbar.success(t('change-password-page.mutation.success'));
      changePassword.reset();
      formik.resetForm();
    }

    if (changePassword.status === 'error') {
      const error = changePassword.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      changePassword.reset();
    }
  }, [router, changePassword, snackbar, formik, t]);

  const confirmPasswordProps: ConfirmPasswordProps = useMemo(() => {
    const passwordsMatch =
      formik.values.newPassword &&
      formik.values.confirmPassword &&
      formik.values.newPassword === formik.values.confirmPassword;

    if (passwordsMatch) {
      return {
        color: 'success',
        helperText: t('change-password-page.validations.confirm-password-match'),
      } as ConfirmPasswordProps;
    }

    return {
      color: formik.errors.confirmPassword ? 'error' : 'primary',
      helperText: (formik.touched.confirmPassword && formik.errors.confirmPassword) && t(formik.errors.confirmPassword),
    } as ConfirmPasswordProps;
  }, [formik.errors.confirmPassword, formik.touched.confirmPassword, formik.values.confirmPassword, formik.values.newPassword, t]);

  return (
    <>
      <Spinner loading={changePassword.status === 'pending'} label={t('change-password-page.mutation.loading')} />
      <MuiGrid
        container
        justifyContent="flex-start"
      >
        <MuiGrid sx={{ width: isSmallScreen ? '100%' : 500 }}>
          <Form onSubmit={formik.handleSubmit}>
            <PasswordField
              fullWidth
              aria-label={t('change-password-page.inputs.current-password')}
              slotProps={{ htmlInput: { 'aria-label': t('change-password-page.inputs.current-password') } }}
              sx={{ mb: 4 }}
              id="currentPassword"
              name="currentPassword"
              label={t('change-password-page.inputs.current-password')}
              color="primary"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
              helperText={(formik.touched.currentPassword && formik.errors.currentPassword) && t(formik.errors.currentPassword)}
            />
            <StrengthPasswordField
              fullWidth
              aria-label={t('change-password-page.inputs.new-password')}
              slotProps={{ htmlInput: { 'aria-label': t('change-password-page.inputs.new-password') } }}
              sx={{ mb: 4 }}
              id="newPassword"
              name="newPassword"
              label={t('change-password-page.inputs.new-password')}
              color="primary"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              helperText={(formik.touched.newPassword && formik.errors.newPassword) && t(formik.errors.newPassword)}
            />
            <PasswordField
              fullWidth
              aria-label={t('change-password-page.inputs.confirm-password')}
              slotProps={{ htmlInput: { 'aria-label': t('change-password-page.inputs.confirm-password') } }}
              sx={{ mb: 4 }}
              id="confirmPassword"
              name="confirmPassword"
              label={t('change-password-page.inputs.confirm-password')}
              focused={Boolean(formik.values.confirmPassword)}
              color={confirmPasswordProps.color}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={confirmPasswordProps.helperText}
            />
            <MuiButton
              aria-label={t('change-password-page.actions.change-password')}
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formik.isValid || !formik.dirty}
            >
              {t('change-password-page.actions.change-password')}
            </MuiButton>
          </Form>
        </MuiGrid>
      </MuiGrid>
    </>
  );
};

export default ChangePasswordForm;

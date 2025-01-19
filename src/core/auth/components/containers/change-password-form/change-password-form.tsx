import React, { useEffect, useMemo } from 'react';
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
  currentPassword: yup.string().required('Ingrese la contraseña actual'),
  newPassword: yup.string().required('Ingrese la nueva contraseña'),
  confirmPassword: yup.string().required('Ingrese la contraseña nuevamente').oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden'),
});

const ChangePasswordForm: React.FC = () => {
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
      snackbar.success('La contraseña fue actualizada correctamente');
      changePassword.reset();
      formik.resetForm();
    }

    if (changePassword.status === 'error') {
      const error = changePassword.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      changePassword.reset();
    }
  }, [router, changePassword, snackbar, formik]);

  const confirmPasswordProps: ConfirmPasswordProps = useMemo(() => {
    const passwordsMatch =
      formik.values.newPassword &&
      formik.values.confirmPassword &&
      formik.values.newPassword === formik.values.confirmPassword;

    if (passwordsMatch) {
      return {
        color: 'success',
        helperText: 'Las contraseñas coinciden',
      } as ConfirmPasswordProps;
    }

    return {
      color: formik.errors.confirmPassword ? 'error' : 'primary',
      helperText: formik.touched.confirmPassword && formik.errors.confirmPassword,
    } as ConfirmPasswordProps;
  }, [formik.errors.confirmPassword, formik.touched.confirmPassword, formik.values.confirmPassword, formik.values.newPassword]);

  return (
    <>
      <Spinner loading={changePassword.status === 'pending'} label="Actualizando contraseña" />
      <MuiGrid
        container
        justifyContent="flex-start"
      >
        <MuiGrid sx={{ width: isSmallScreen ? '100%' : 500 }}>
          <Form onSubmit={formik.handleSubmit}>
            <PasswordField
              fullWidth
              aria-label="Contraseña actual"
              slotProps={{ htmlInput: { 'aria-label': 'Contraseña actual' } }}
              sx={{ mb: 4 }}
              id="currentPassword"
              name="currentPassword"
              label="Contraseña actual"
              color="primary"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
              helperText={formik.touched.currentPassword && formik.errors.currentPassword}
            />
            <StrengthPasswordField
              fullWidth
              aria-label="Nueva contraseña"
              slotProps={{ htmlInput: { 'aria-label': 'Confirmar contraseña' } }}
              sx={{ mb: 4 }}
              id="newPassword"
              name="newPassword"
              label="Nueva contraseña"
              color="primary"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              helperText={formik.touched.newPassword && formik.errors.newPassword}
            />
            <PasswordField
              fullWidth
              aria-label="Confirmar contraseña"
              slotProps={{ htmlInput: { 'aria-label': 'Confirmar contraseña' } }}
              sx={{ mb: 4 }}
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmar contraseña"
              focused={Boolean(formik.values.confirmPassword)}
              color={confirmPasswordProps.color}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={confirmPasswordProps.helperText}
            />
            <MuiButton
              aria-label="Cambiar contraseña"
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formik.isValid || !formik.dirty}
            >
              Cambiar contraseña
            </MuiButton>
          </Form>
        </MuiGrid>
      </MuiGrid>
    </>
  );
};

export default ChangePasswordForm;

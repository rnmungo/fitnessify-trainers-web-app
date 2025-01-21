import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { amber } from '@mui/material/colors';
import MuiAvatar from '@mui/material/Avatar';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiLockIcon from '@mui/icons-material/Lock';
import MuiStack from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import MuiTypography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Copyright from '@/core/components/presentational/copyright';
import Spinner from '@/core/components/presentational/spinner';
import { useSnackbar } from '@/core/context/snackbar';
import { useTranslation } from '@/core/i18n/context';
import { PasswordField } from '../../presentational/password';
import { useMutationSignIn } from '../../../hooks';
import { useSession } from '../../../context/session';

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const validationSchema = yup.object({
  userName: yup.string().required('login-page.validations.username'),
  password: yup.string().required('login-page.validations.password'),
});

const LoginFormContainer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const snackbar = useSnackbar();
  const signIn = useMutationSignIn();
  const session = useSession();

  const formik = useFormik({
    initialValues: {
      userName: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { userName, password } = values;
      signIn.mutate({ email: userName, password });
    },
  });

  useEffect(() => {
    if (signIn.status === 'success') {
      signIn.reset();
      session.refetch();
      router.push('/');
    }

    if (signIn.status === 'error') {
      const error = signIn.error as AxiosError;
      snackbar.error((error.response?.data as { message?: string })?.message || error.message);
      signIn.reset();
    }
  }, [router, session, signIn, snackbar]);

  return (
    <>
      <Spinner loading={signIn.status === 'pending'} label="Iniciando sesión" />
      <MuiStack direction="column" alignItems="center" spacing={1}>
        <MuiAvatar
          sx={{ bgcolor: amber[500], color: 'primary.contrastText', m: 1 }}
        >
          <MuiLockIcon />
        </MuiAvatar>
        <MuiTypography component="h1" variant="h5">
          {t('login-page.actions.login')}
        </MuiTypography>
        <Form onSubmit={formik.handleSubmit}>
          <MuiTextField
            fullWidth
            aria-label={t('login-page.inputs.username')}
            slotProps={{ htmlInput: { 'aria-label': t('login-page.inputs.username') } }}
            sx={{ mb: 4 }}
            id="userName"
            name="userName"
            label={t('login-page.inputs.username')}
            color="primary"
            autoComplete="username"
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userName && Boolean(formik.errors.userName)}
            helperText={(formik.touched.userName && formik.errors.userName) && t(formik.errors.userName)}
          />
          <PasswordField
            fullWidth
            aria-label={t('login-page.inputs.password')}
            slotProps={{ htmlInput: { 'aria-label': t('login-page.inputs.password') } }}
            sx={{ mb: 4 }}
            id="password"
            name="password"
            label={t('login-page.inputs.password')}
            color="primary"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={(formik.touched.password && formik.errors.password) && t(formik.errors.password)}
          />
          <MuiButton
            aria-label={t('login-page.actions.login')}
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
          >
            {t('login-page.actions.login')}
          </MuiButton>
          <MuiBox mt={5}>
            <Copyright enterprise="Fitnessify" startYear={2023} />
          </MuiBox>
        </Form>
      </MuiStack>
    </>
  );
};

export default LoginFormContainer;

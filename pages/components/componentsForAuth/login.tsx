import { State, useHookstate } from '@hookstate/core';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert, Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';
import { FirebaseError } from 'firebase-admin';
import * as React from 'react';

import { authUtils } from '@/firebase/auth-utils';

const MyAlert = (message: string, type: string) => {
  switch (type) {
    case 'success': {
      return <Alert severity="success">{message}</Alert>;
    }
    case 'error': {
      return <Alert severity="error">{message}</Alert>;
    }
    default: {
      return <div></div>;
    }
  }
};

const Submit = async (
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
  data: { password: string; email: string },
  isCheck: boolean,
  credentialsSetter: State<{
    email: string;
    password: string;
  }>,
  SetIsChecked: React.Dispatch<React.SetStateAction<boolean>>,

  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  // event.preventDefault();
  // const data = new FormData(event.currentTarget);
  // window.localStorage.removeItem()
  const errMsgEmail = 'Email is not valid';
  const errMsgLogin = 'Bad password or user name or you do not have account';
  const errMsgPassword =
    'Password is not valid (must be a string with at least six characters)';
  if (data.email.length === 0) {
    errSetter.errEmail.set('Email was not provided');
    return;
  }

  if (data.password.length === 0) {
    errSetter.errPassword.set('Password was not provided');
    return;
  }

  const login = async () => {
    const response: {
      email: string;
      password: string;
      errMsg: { login: string; password: string; email: string };
    } = {
      email: '',
      password: '',
      errMsg: { login: '', password: '', email: '' },
    };

    // return setPersistence(auth, browserSessionPersistence).then(async () => {
    // New sign-in will be persisted with session persistence.
    try {
      // nufunkcni rememer me
      await authUtils.login(data.email, data.password);
      response.email = data.email;
      response.password = data.password;
      const auth = getAuth();
      await setPersistence(auth, browserSessionPersistence);
      SetIsChecked(true);

      return {
        email: data.email,
        password: data.password,
        errMsg: { login: 'Any', password: 'Any', email: 'Any' },
      };
    } catch (error) {
      const err = error as FirebaseError;
      if (err.code === 'auth/user-not-found') {
        response.errMsg.login = errMsgLogin;
      }
      if (err.code === 'auth/invalid-email') {
        response.errMsg.email = errMsgEmail;
      }
      if (err.code === 'auth/invalid-password') {
        response.errMsg.password = errMsgPassword;
      }
    }

    return response;
    // });
  };

  let response;
  if (isCheck) {
    response = login();
    const { errMsg, email, password } = await response;
    if (errMsg.login !== '') {
      SetAlert(MyAlert(errMsg.login, 'error'));
    }
    if (errMsg.password !== '') {
      errSetter.errPassword.set(errMsg.password);
    }
    if (email !== '' && password !== '') {
      credentialsSetter.email.set(email);
      credentialsSetter.password.set(password);
      SetAlert(MyAlert('User registration succesfull', 'success'));
    }
  } else {
    try {
      await authUtils.login(data.email, data.password);
      SetAlert(MyAlert('User registration succesfull', 'success'));
    } catch (error) {
      const err = error as FirebaseError;
      // eslint-disable-next-line max-depth
      if (err.code === 'auth/user-not-found') {
        SetAlert(MyAlert(errMsgLogin, 'error'));
      }
      // eslint-disable-next-line max-depth
      if (err.code === 'auth/invalid-email') {
        errSetter.errEmail.set(errMsgEmail);
      }
      // password a too many atemps
      // eslint-disable-next-line max-depth
      // if (err.code === 'auth/invalid-password') {
      //   errSetter.errPassword.set(errMsgPassword);
      // }
      // // eslint-disable-next-line max-depth
      // if (err.message === 'INVALID_PASSWORD') {
      //   errSetter.errPassword.set(errMsgPassword);
      // }
    }
  }
};

const onChangeForm = (
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
) => {
  SetAlert(<div></div>);
  errSetter.set({
    errEmail: '',
    errPassword: '',
  });
};

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export const PageFormLogin = () => {
  // const storage = window.localStorage;

  const [myAlert, SetmyAlert] = React.useState(<div></div>);
  const [isChecked, SetIsChecked] = React.useState(false);

  const errCredentials = useHookstate({
    errEmail: '',
    errPassword: '',
  });

  const credentials = useHookstate({
    email: '',
    password: '',
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {myAlert}
          <Box
            component="form"
            onChange={() => onChangeForm(errCredentials, SetmyAlert)}
            noValidate
            sx={{ mt: 1 }}
          >
            {errCredentials.errEmail.get() === '' ? (
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                onChange={(e) => credentials.email.set(e.target.value)}
                autoComplete="email"
                autoFocus
                helperText="Enter your email"
              />
            ) : (
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                error
                label="Email Address"
                onChange={(e) => credentials.email.set(e.target.value)}
                autoComplete="email"
                autoFocus
                helperText={errCredentials.errEmail.get()}
                // value={credentials.email.get()}
              />
            )}
            {errCredentials.errPassword.get() === '' ? (
              <TextField
                margin="normal"
                required
                fullWidth
                onChange={(e) => credentials.password.set(e.target.value)}
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                helperText="Enter your password"
              />
            ) : (
              <TextField
                margin="normal"
                required
                fullWidth
                error
                onChange={(e) => credentials.password.set(e.target.value)}
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                helperText={errCredentials.errPassword.get()}
                // value={credentials.password.get()}
              />
            )}
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  onChange={(e) => SetIsChecked(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Grid container>
              <Grid item xs>
                <Link href="change-pass-page" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="register-page" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Button
              onClick={() =>
                Submit(
                  SetmyAlert,
                  errCredentials,
                  {
                    email: credentials.email.get(),
                    password: credentials.password.get(),
                  },
                  isChecked,
                  credentials,
                  SetIsChecked,
                )
              }
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

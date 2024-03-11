import { State, useHookstate } from '@hookstate/core';
// import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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

const ValidCredentials = (
  password: string,
  email: string,
): { where: string | undefined; errMesage: string | undefined } => {
  const data = { pass: password, em: email };
  const hasSymbol = /[!"#$%&()*,.:<>?@^{|}]/.test(password);
  const hasNumber = /\d/.test(password);
  if (data.em.length === 0) {
    return { where: 'email', errMesage: 'Email was not provided' };
  }

  if (data.pass.length === 0) {
    return { where: 'password', errMesage: 'Password was not provided' };
  }

  if (data.pass.length < 8) {
    return { where: 'password', errMesage: 'Password length is small' };
  }

  if (!hasSymbol || !hasNumber) {
    return {
      where: 'password',
      errMesage: 'Password is not combination of chars, numbers and symbols',
    };
  }

  const getPartEmIndex = data.em.indexOf('@');

  if (
    password.includes(data.em.slice(0, getPartEmIndex)) &&
    getPartEmIndex > 0
  ) {
    return {
      where: 'password',
      errMesage: 'Password includes emeail account',
    };
  }

  return { where: undefined, errMesage: undefined };
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

const RequirementsPass = () =>
  // setClose: React.Dispatch<React.SetStateAction<boolean>>,
  {
    return (
      <div
        style={{
          border: '3px solid #FADF79',
          borderRadius: '10px',
          background: '#FADF79',
          padding: '10px',
        }}
      >
        {/* <Button style={{ float: 'right' }} onClick={() => setClose(true)}>
        <ClearOutlinedIcon />
      </Button> */}
        <p style={{ margin: '6px' }}>Length bigger or equal to 8</p>
        <p style={{ margin: '6px' }}>
          Combination of symbol, number, character
        </p>
        <p style={{ margin: '6px' }}>Part of email not included in password</p>
      </div>
    );
  };

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const Submit = async (
  data: { password: string; email: string },
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
) => {
  const validation = ValidCredentials(data.password, data.email);

  if (validation.where && validation.errMesage) {
    switch (validation.where) {
      case 'password': {
        errSetter.errPassword.set(validation.errMesage);
        return;
      }
      case 'email': {
        errSetter.errEmail.set(validation.errMesage);
        return;
      }
      default: {
        return;
      }
    }
  }
  try {
    await authUtils.register(data.email, data.password);
    SetAlert(MyAlert('User registration succesfull', 'success'));
  } catch (error) {
    const err = error as FirebaseError;
    switch (err.code) {
      case 'auth/email-already-in-use': {
        errSetter.errEmail.set('User is already in use');
        break;
      }
      case 'auth/invalid-email': {
        errSetter.errEmail.set('Email is not valid');
        break;
      }
      default: {
        SetAlert(MyAlert('User registration failed', 'error'));
      }
    }
  }
};

const Credentials = async (
  data: { emeil: string; password: string },
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
) => {
  if (data.emeil.length > 0 && data.password.length > 0) {
    await Submit(
      {
        password: data.password,
        email: data.emeil,
      },
      SetAlert,
      errSetter,
    );
  } else {
    SetAlert(MyAlert('Credentials of your new account not provided', 'error'));
  }
};

export const PageRegisterForm = () => {
  const [close, SetClose] = React.useState(true);
  const [myAlert, SetmyAlert] = React.useState(<div></div>);
  const credentials = useHookstate({
    email: '',
    password: '',
  });

  const errCredentials = useHookstate({
    errEmail: '',
    errPassword: '',
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
          <Avatar src="/broken-image.jpg" />
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          {myAlert}
          <Box
            component="form"
            onChange={() => onChangeForm(errCredentials, SetmyAlert)}
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
                helperText="Enter new email"
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
              />
            )}

            <div style={{ display: 'flex', color: 'darkblue' }}>
              <Button onClick={() => SetClose((prev) => !prev)}>
                <InfoOutlinedIcon
                  sx={{ color: 'darkblue', width: '30px', height: '30px' }}
                />
              </Button>
              <p style={{ textAlign: 'center', margin: '10px' }}>
                Password requirements
              </p>
            </div>

            <div>{close === true ? <div></div> : RequirementsPass()}</div>

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
                helperText="Enter new password"
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
              />
            )}

            <Button
              onClick={() =>
                Credentials(
                  {
                    emeil: credentials.email.get(),
                    password: credentials.password.get(),
                  },
                  SetmyAlert,
                  errCredentials,
                )
              }
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

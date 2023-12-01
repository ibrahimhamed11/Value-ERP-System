import { handleUserResponse, useLogin } from '../../../lib/auth';
import { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { Layout as AuthLayout } from '../../../layout/authLayout';
import { useMutation } from '@tanstack/react-query';
import { loginWithEmailAndPassword } from '../api/login';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../redux/Slices/User';
import ErrorMessageBox from '../../../components/errorMsgBox/ErrorMessageBox '
export const Login = () => {

  const fifteenMinutes = 15 * 60 * 1000;
  const [errorMessage, setErrorMessage] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastInvalidAttemptTimestamp, setLastInvalidAttemptTimestamp] = useState(
    parseInt(localStorage.getItem("lastInvalidAttemptTimestamp")) || null
  );
  const [timeWindowExpired, setTimeWindowExpired] = useState(false);
  
  

  useEffect(() => {
    const checkTimeWindow = () => {
      const now = Date.now();
      if (lastInvalidAttemptTimestamp) {
        if (now - lastInvalidAttemptTimestamp >= fifteenMinutes) {
          setTimeWindowExpired(true);
          setLoginAttempts(0)
          localStorage.removeItem('loginAttempts');
          localStorage.removeItem('lastInvalidAttemptTimestamp');
          setErrorMessage("")
        }
      }
    };

    checkTimeWindow();

    const timer = setInterval(() => {
      checkTimeWindow();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [lastInvalidAttemptTimestamp]);




  const dispatch = useDispatch();
  const login = useMutation({
    mutationFn: loginWithEmailAndPassword, onError: () => {
      formik.setErrors({ password: "email or password invalid" })
    }, onSuccess: (res) => {
      handleUserResponse(res);
      dispatch(loginUser());


    }
  })
  const hideError = () => {
    setErrorMessage("");
  };
  const [method, setMethod] = useState('email');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255, 'Email must be at most 255 characters')
        .required('Email is required'),
      password: Yup
        .string()
        .max(255, 'Password must be at most 255 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        let response = await login.mutateAsync({ email: values.email, password: values.password });
        setLoginAttempts(0);
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("lastInvalidAttemptTimestamp");
      } catch (err) {
        const updatedLoginAttempts = loginAttempts + 1;
        const updatedLastInvalidAttemptTimestamp = Date.now();
        localStorage.setItem("loginAttempts", updatedLoginAttempts);
        localStorage.setItem("lastInvalidAttemptTimestamp", updatedLastInvalidAttemptTimestamp.toString());
        
        if (updatedLoginAttempts >= 5 && !timeWindowExpired) {
          const intervalId = setInterval(() => {
            const remainingTime = fifteenMinutes - (Date.now() - updatedLastInvalidAttemptTimestamp);
            if (remainingTime > 0) {
              const remainingMinutes = Math.floor(remainingTime / 60000);
              const remainingSeconds = Math.floor((remainingTime % 60000) / 1000);
      
              setErrorMessage(`You have attempted to log in with incorrect data five times. Please wait for ${remainingMinutes} minutes and ${remainingSeconds} seconds.`);
            } else {
              clearInterval(intervalId); 
              setErrorMessage("Countdown expired");
            }
          }, 1000);
        }
        
        console.log(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.response.data.Message });
        helpers.setSubmitting(false);
        
        setLoginAttempts(updatedLoginAttempts);
        setLastInvalidAttemptTimestamp(updatedLastInvalidAttemptTimestamp);
      }
    },
  });
  
  useEffect(() => {
    if (localStorage.getItem("loginAttempts") >= 5 && !timeWindowExpired) {
      const intervalId = setInterval(() => {
        const remainingTime = fifteenMinutes - (Date.now() - lastInvalidAttemptTimestamp);
        if (remainingTime > 0) {
          const remainingMinutes = Math.floor(remainingTime / 60000);
          const remainingSeconds = Math.floor((remainingTime % 60000) / 1000);
  
          setErrorMessage(`You have attempted to log in with incorrect data five times. Please wait for ${remainingMinutes} minutes and ${remainingSeconds} seconds.`);
        } else {
          clearInterval(intervalId); 
          setErrorMessage("Countdown expired");
        }
      }, 1000);
  
      return () => {
        clearInterval(intervalId);
      };
    }
  }, []);
  const handleMethodChange = useCallback(
    (event, value) => {
      setMethod(value);
    },
    []
  );

  return (
    <>
      <AuthLayout>

        <Box
          sx={{
            backgroundColor: 'background.paper',
            flex: '1 1 auto',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              maxWidth: 550,
              px: 3,
              py: '100px',
              width: '100%'
            }}
          >
            <ErrorMessageBox errorMessage={errorMessage} onClose={hideError} />
            <div>
              <Stack
                spacing={1}
                sx={{ mb: 3 }}
              >
                <Typography variant="h4">
                  Login
                </Typography>
                
              </Stack>
              <Tabs
                onChange={handleMethodChange}
                sx={{ mb: 3 }}
                value={method}
              >
              </Tabs>
              {method === 'email' && (
                <form
                  noValidate
                  onSubmit={formik.handleSubmit}
                >
                  <Stack spacing={3}>
                    <TextField
                      error={!!(formik.touched.email && formik.errors.email)}
                      fullWidth
                      helperText={formik.touched.email && formik.errors.email}
                      label="Email Address"
                      name="email"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="email"
                      // value={formik.values.email}
                    />
                    <TextField
                      error={!!(formik.touched.password && formik.errors.password)}
                      fullWidth
                      helperText={formik.touched.password && formik.errors.password}
                      label="Password"
                      name="password"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="password"
                      // value={formik.values.password}
                    />
                  </Stack>
                  {formik.errors.submit && (
                    <Typography
                      color="error"
                      sx={{ mt: 3 }}
                      variant="body2"
                    >
                      {formik.errors.submit}
                    </Typography>
                  )}
                  <Button
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    type="submit"
                    variant="contained"
                    disabled={parseInt(localStorage.getItem("loginAttempts")) >= 5 && !timeWindowExpired}
                  >
                    Login
                  </Button>

                  

                  <Alert
                    color="primary"
                    severity="info"
                    sx={{ mt: 3 }}
                  >
                    <div>
                      You can use <b>demo@demo.com</b> and password <b>demo!</b>
                    </div>
                  </Alert>
                </form>
              )}
            </div>
          </Box>
        </Box>
      </AuthLayout>
    </>
  );
};

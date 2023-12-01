import * as React from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter  } from 'react-router-dom';

import { HashRouter } from "react-router-dom";

import theme from '../themes';
import store from '../redux/Store';
import { Provider, useSelector } from 'react-redux';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const AppTheme = ({ children }) => {
  const customization = useSelector((state) => state.config);

  return (
    <StyledEngineProvider injectfirst>
      <ThemeProvider theme={theme(customization)}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <React.Suspense
            fallback={<div className="flex items-center justify-center w-screen h-screen"></div>}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
            {/* <HashRouter> */}
<>           {children}
</>
 
              {/* </HashRouter> */}

            </ErrorBoundary>
          </React.Suspense>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
const ErrorFallback = () => {
  return (
    <div
      className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
      role="alert">
      <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
    </div>
  );
};

export const AppProvider = (props) => {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppTheme children={props.children} />
      </QueryClientProvider>
    </Provider>
  );
};

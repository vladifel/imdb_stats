import React from 'react';
import './App.css';
import LandingPage from './features/LandingPage';
import { ThemeProvider } from '@material-ui/core';
import theme from './styles/theme';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <LandingPage />
    </ThemeProvider>
  );
}

export default App;

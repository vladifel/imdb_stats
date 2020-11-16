import React from 'react';
import './App.css';
import LandingPage from './features/LandingPage';
import { ThemeProvider } from '@material-ui/core';
import theme from './styles/theme';
import Paper from '@material-ui/core/Paper';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Paper style={{
        flexGrow: 1,
        height: '100vh',
        width: '100vw',
      }}>
        <LandingPage />
      </Paper>
    </ThemeProvider>
  );
}

export default App;

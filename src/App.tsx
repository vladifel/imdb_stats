import React from "react";
import { ThemeProvider } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

import theme from "./styles/theme";
import LandingPage from "./features/LandingPage/LandingPage";
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Paper
        style={{
          flexGrow: 1,
          height: "100vh",
          width: "100vw",
        }}
      >
        <LandingPage />
      </Paper>
    </ThemeProvider>
  );
}

export default App;

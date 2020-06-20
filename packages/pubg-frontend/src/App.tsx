import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Header } from "./components/Header";
import { theme, useStyles } from "./theme";
import { Player } from "./views/Player";
import { Start } from "./views/Start";

export const App = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <Router>
          <Header />
          <Switch>
            <Route exact path="/">
              <Start />
            </Route>
            <Route exact path="/players/:id">
              <Player />
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
};

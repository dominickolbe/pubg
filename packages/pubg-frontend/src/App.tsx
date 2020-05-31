import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { theme, useStyles } from "./theme";
import { Player } from "./views/Player";
import { PlayerNotFound } from "./views/PlayerNotFound";

export const App = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <Router>
          <Switch>
            <Route exact path="/">
              <p>home</p>
            </Route>
            <Route exact path="/players/:id">
              <Player />
            </Route>
            <Route exact path="/playernotfound">
              <PlayerNotFound />
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

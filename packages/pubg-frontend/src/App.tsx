import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { view } from "@risingstack/react-easy-state";
import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { AppDrawer } from "./components/AppDrawer";
import { AppHeader } from "./components/AppHeader";
import { theme, useStyles } from "./theme";
import { Player } from "./views/Player";
import { Start } from "./views/Start";

export const App = view(() => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className={classes.root}>
          <AppHeader />
          <AppDrawer />
          <main className={classes.content}>
            <Toolbar variant="dense" />
            <Switch>
              <Route path="/" exact>
                <Start />
              </Route>
              <Route path="/players/:id" exact>
                <Player />
              </Route>
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
});

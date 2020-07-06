import { CssBaseline } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import { ThemeProvider } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Alert from "@material-ui/lab/Alert";
import { view } from "@risingstack/react-easy-state";
import { cx } from "emotion";
import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { AppDrawer } from "./components/AppDrawer";
import { AppHeader } from "./components/AppHeader";
import { app } from "./components/store";
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
          <main
            className={cx(classes.content, {
              [classes.contentShift]: app.drawer,
            })}
          >
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
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={app.notification.show}
            autoHideDuration={app.notification.duration}
            onClose={() => (app.notification.show = false)}
          >
            <Alert severity={app.notification.type}>
              {app.notification.msg}
            </Alert>
          </Snackbar>
        </div>
      </Router>
    </ThemeProvider>
  );
});

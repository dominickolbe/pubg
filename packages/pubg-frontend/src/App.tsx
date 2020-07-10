import { Backdrop, CircularProgress, CssBaseline } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import { ThemeProvider } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Alert from "@material-ui/lab/Alert";
import { view } from "@risingstack/react-easy-state";
import { cx } from "emotion";
import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { AppDrawer } from "./components/AppDrawer";
import { AppHeader } from "./components/AppHeader";
import { SettingsDialog } from "./components/SettingsDialog";
import { rootstore } from "./components/store";
import { theme, useStyles } from "./theme";

const Start = React.lazy(() =>
  import("./views/Start").then((module) => ({ default: module.Start }))
);
const Player = React.lazy(() =>
  import("./views/Player").then((module) => ({ default: module.Player }))
);

const LazyPreloader = () => {
  const classes = useStyles();
  return (
    <Backdrop open className={classes.backdrop}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

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
              [classes.contentShift]: rootstore.drawer,
            })}
          >
            <Toolbar variant="dense" />
            <Suspense fallback={<LazyPreloader />}>
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
            </Suspense>
          </main>
          <SettingsDialog />
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={rootstore.notification.show}
            autoHideDuration={rootstore.notification.duration}
            onClose={() => (rootstore.notification.show = false)}
          >
            <Alert severity={rootstore.notification.type}>
              {rootstore.notification.msg}
            </Alert>
          </Snackbar>
        </div>
      </Router>
    </ThemeProvider>
  );
});

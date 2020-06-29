import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import { view } from "@risingstack/react-easy-state";
import React from "react";
import { useHistory } from "react-router-dom";
import { APP_TITLE } from "../../constants";
import { PlayerSearch } from "../PlayerSearch";
import { app } from "../store";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
  searchContainer: {
    width: "175px",
  },
}));

export const AppHeader = view(() => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => (app.drawer = !app.drawer)}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <div className={classes.title}>
          <Button onClick={() => history.push("/")}>
            <Typography variant="h4">{APP_TITLE}</Typography>
          </Button>
        </div>
        <div className={classes.searchContainer}>
          <PlayerSearch
            onSubmit={(value) => history.push(`/players/${value}`)}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
});

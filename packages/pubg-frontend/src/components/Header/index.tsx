import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { PlayerSearch } from "../PlayerSearch";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export const Header = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar variant="dense">
          <Typography variant="h6" className={classes.title}>
            pubg.
          </Typography>
          <PlayerSearch
            onSubmit={(value) => history.push(`/players/${value}`)}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
};

import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useHistory } from "react-router-dom";
import { APP_TITLE } from "../../constants";
import { PlayerSearch } from "../PlayerSearch";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  searchContainer: {
    width: "175px",
  },
}));

export const Header = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" className={classes.title}>
            {APP_TITLE}
          </Typography>
          <div className={classes.searchContainer}>
            <PlayerSearch
              onSubmit={(value) => history.push(`/players/${value}`)}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

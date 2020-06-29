import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
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
    </div>
  );
};

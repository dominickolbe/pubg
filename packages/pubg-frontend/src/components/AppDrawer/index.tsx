import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { view } from "@risingstack/react-easy-state";
import React from "react";
import { useHistory } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { useStyles } from "../../theme";
import { app } from "../store";

export const AppDrawer = view(() => {
  const classes = useStyles();
  const history = useHistory();

  const [favoritePlayers] = useLocalStorage<string[]>("favoritePlayers", []);

  return (
    <Drawer
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      variant="persistent"
      anchor="left"
      open={app.drawer}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List
          subheader={
            <ListSubheader component="div">Favorite players</ListSubheader>
          }
          dense
        >
          {favoritePlayers && favoritePlayers.length ? (
            favoritePlayers.map((player) => (
              <ListItem
                button
                key={player}
                onClick={() => history.push(`/players/${player}`)}
              >
                <ListItemText primary={player} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <Typography variant="caption">
                You don't have any favorite player yet.
              </Typography>
            </ListItem>
          )}
        </List>
      </div>
    </Drawer>
  );
});

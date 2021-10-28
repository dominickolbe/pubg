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
import { useStyles } from "../../theme";
import { rootstore } from "../store";

export const AppDrawer = view(() => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Drawer
      open={rootstore.drawer}
      variant="persistent"
      anchor="left"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerContainer}>
        <Toolbar />
        <List
          subheader={
            <ListSubheader component="div">Favorite players</ListSubheader>
          }
          dense
        >
          {rootstore.favoritePlayer.length ? (
            rootstore.favoritePlayer.map((player) => (
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

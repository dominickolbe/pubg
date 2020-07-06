import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { view } from "@risingstack/react-easy-state";
import React from "react";
import { PLAYER_VIEW_UPDATE_INTERVAL } from "../../constants";
import { rootstore } from "../store";

export const SettingsDialog = view(() => {
  const onChangePlayerIntervalUpdate = () => {
    rootstore.app.playerIntervalUpdate = !rootstore.app.playerIntervalUpdate;

    rootstore.notification.msg = `Player view interval updates ${
      rootstore.app.playerIntervalUpdate ? "activated" : "deactivated"
    }`;
    rootstore.notification.type = "success";
    rootstore.notification.show = true;
  };
  const onDeleteFavoritePlayers = () => {
    rootstore.favoritePlayer = [];

    rootstore.notification.msg = "Deleted all favorite player";
    rootstore.notification.type = "success";
    rootstore.notification.show = true;
  };
  const onDeleteLastVisitedPlayers = () => {
    rootstore.lastVisitedPlayer = [];

    rootstore.notification.msg = "Deleted all last visited players";
    rootstore.notification.type = "success";
    rootstore.notification.show = true;
  };
  const onDeleteAppData = () => {
    rootstore.favoritePlayer = [];
    rootstore.lastVisitedPlayer = [];
    localStorage.clear();

    rootstore.notification.msg = "Deleted all app data";
    rootstore.notification.type = "success";
    rootstore.notification.show = true;
  };

  return (
    <Dialog
      open={rootstore.dialog.settings.open}
      onClose={() => (rootstore.dialog.settings.open = false)}
      scroll="body"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle disableTypography style={{ paddingBottom: 0 }}>
        <Typography component="div" variant="h4">
          <Box fontWeight="fontWeightBold">Settings</Box>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Player auto refresh"
              secondary={`Players view updates automatically every ${
                PLAYER_VIEW_UPDATE_INTERVAL / 1000 / 60
              }min`}
            />
            <ListItemSecondaryAction>
              <Switch
                checked={rootstore.app.playerIntervalUpdate}
                onChange={() => onChangePlayerIntervalUpdate()}
                color="primary"
                size="small"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Clear favorite players"
              secondary="Deletes all your favorite players"
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onDeleteFavoritePlayers()}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Clear history"
              secondary="Deletes all your last visited players"
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => onDeleteLastVisitedPlayers()}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Clear all your app data"
              secondary="Deletes all data"
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onDeleteAppData()}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          color="inherit"
          onClick={() => (rootstore.dialog.settings.open = false)}
        >
          Close settings
        </Button>
      </DialogActions>
    </Dialog>
  );
});

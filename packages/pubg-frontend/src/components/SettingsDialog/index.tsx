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
import { app } from "../store";

export const SettingsDialog = view(() => {
  const onChangePlayerIntervalUpdate = () => {
    app.app.playerIntervalUpdate = !app.app.playerIntervalUpdate;
  };
  const onDeleteFavoritePlayers = () => {
    app.favoritePlayer = [];

    app.notification.msg = "Deleted all favorite player";
    app.notification.type = "success";
    app.notification.show = true;
  };
  const onDeleteLastVisitedPlayers = () => {
    app.lastVisitedPlayer = [];

    app.notification.msg = "Deleted all last visited players";
    app.notification.type = "success";
    app.notification.show = true;
  };
  const onDeleteAppData = () => {
    app.favoritePlayer = [];
    app.lastVisitedPlayer = [];
    localStorage.clear();

    app.notification.msg = "Deleted all app data";
    app.notification.type = "success";
    app.notification.show = true;
  };

  return (
    <Dialog
      open={app.dialog.settings.open}
      onClose={() => (app.dialog.settings.open = false)}
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
              primary="Update player automatically"
              secondary="You don't need to refresh!"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={app.app.playerIntervalUpdate}
                onChange={() => onChangePlayerIntervalUpdate()}
                color="primary"
                size="small"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Clear all your favorite players"
              secondary="Deletes all favorite players"
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
              primary="Clear all your last visited players"
              secondary="Deletes all last visited players"
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
          onClick={() => (app.dialog.settings.open = false)}
        >
          Close settings
        </Button>
      </DialogActions>
    </Dialog>
  );
});

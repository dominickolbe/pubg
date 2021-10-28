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
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { view } from "@risingstack/react-easy-state";
import React from "react";
import { rootstore } from "../store";

export const SettingsDialog = view(() => {
  const onDeleteFavoritePlayers = () => {
    rootstore.favoritePlayer = [];

    rootstore.notification.msg = "Successfully deleted all favorite player";
    rootstore.notification.type = "success";
    rootstore.notification.show = true;
  };
  const onDeleteLastVisitedPlayers = () => {
    rootstore.lastVisitedPlayer = [];

    rootstore.notification.msg =
      "Successfully deleted all last visited players";
    rootstore.notification.type = "success";
    rootstore.notification.show = true;
  };
  const onDeleteAppData = () => {
    rootstore.favoritePlayer = [];
    rootstore.lastVisitedPlayer = [];
    localStorage.clear();

    rootstore.notification.msg = "Successfully deleted all app data";
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
      <DialogTitle disableTypography>
        <Typography component="div" variant="h4">
          <Box fontWeight="fontWeightBold">Settings</Box>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <List dense>
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
              primary="Clear visited players"
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
              primary="Clear all app data"
              secondary="Deletes all data from local storage"
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
        <Button onClick={() => (rootstore.dialog.settings.open = false)}>
          close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

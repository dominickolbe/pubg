import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import HistoryIcon from "@material-ui/icons/History";
import Star from "@material-ui/icons/Star";
import { view } from "@risingstack/react-easy-state";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { rootstore } from "../../components/store";
import { usePageview } from "../../services/Tracking/usePageview";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(8),
  },
  title: {
    padding: theme.spacing(2, 2, 0),
  },
}));

export const Start = view(() => {
  const classes = useStyles();
  const history = useHistory();

  const [search, setSearch] = useState("");

  const onSubmit = () => {
    search && history.push(`/players/${search}`);
  };

  usePageview("/");

  useEffect(() => {
    rootstore.title = "";
  }, []);

  return (
    <Container maxWidth="sm">
      <Grid container className={classes.root} alignItems="center" spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h3">Search for player:</Typography>
        </Grid>
        <Grid item sm={8} xs={12}>
          <TextField
            label="Player name"
            variant="filled"
            fullWidth
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value.trim())}
            onKeyPress={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            autoFocus
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <Button variant="contained" fullWidth onClick={() => onSubmit()}>
            Search
          </Button>
        </Grid>
        <Grid item xs={12} style={{ marginTop: 32 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" style={{ marginBottom: 16 }}>
                Your favorite player:
              </Typography>
              <List component="nav">
                {rootstore.favoritePlayer.length ? (
                  rootstore.favoritePlayer.map((player) => (
                    <ListItem
                      button
                      key={player}
                      onClick={() => history.push(`/players/${player}`)}
                    >
                      <ListItemIcon>
                        <Star fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={player} />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <Typography variant="body1">
                      You don't have any favorite player yet.
                    </Typography>
                  </ListItem>
                )}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" style={{ marginBottom: 16 }}>
                Last visited players:
              </Typography>
              <List component="nav">
                {rootstore.lastVisitedPlayer.length ? (
                  rootstore.lastVisitedPlayer.map((player) => (
                    <ListItem
                      button
                      key={player}
                      onClick={() => history.push(`/players/${player}`)}
                    >
                      <ListItemIcon>
                        <HistoryIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={player} />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <Typography variant="body1">
                      You haven't visited any player yet.
                    </Typography>
                  </ListItem>
                )}
              </List>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
});

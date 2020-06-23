/* eslint-disable react-hooks/exhaustive-deps */

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Alert from "@material-ui/lab/Alert";
import Skeleton from "@material-ui/lab/Skeleton";
import { formatDistanceToNow, isBefore, parseISO, sub } from "date-fns";
import { MatchesRequest } from "pubg-model/types/Match";
import { PlayerRequest } from "pubg-model/types/Player";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { ApiController } from "../../components/ApiController";
import { PlayerMatchesList } from "../../components/PlayerMatchesList";
import {
  PlayerStatsCard,
  PlayerStatsCardLoading,
} from "../../components/PlayerStatsCard";
import { generateTotalStats } from "../../utils";

// TODO: remove
const matchRequestDefaults = {
  limit: 50,
  offset: 0,
};

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(8),
  },
  header: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    padding: theme.spacing(2, 2, 0),
  },
  favButton: {
    marginLeft: "auto",
    color: "red",
  },
  expansionPanelHeading: {
    fontSize: `${theme.typography.pxToRem(14)}!important`,
  },
  expansionPanelSecondaryHeading: {
    fontSize: `${theme.typography.pxToRem(13)}!important`,
    flexBasis: "55%",
    marginLeft: "auto",
    color: `${theme.palette.text.secondary}!important`,
    flexShrink: 0,
  },
}));

export const Player = () => {
  const { id } = useParams();
  const classes = useStyles();

  const [player, setPlayer] = useState<PlayerRequest | null>(null);
  const [matches, setMatches] = useState<MatchesRequest | null>([]);
  const [error, setError] = useState("");

  const [favoritePlayers, setFavoritePlayers] = useLocalStorage<String[]>(
    "favoritePlayers",
    []
  );

  const loadMatches = async () => {
    setMatches(null);
    const response = await ApiController.getPlayerMatches(
      id,
      matchRequestDefaults.limit,
      matchRequestDefaults.offset
    );
    if (response.ok) setMatches(response.val);
  };

  const loadPlayer = async () => {
    setPlayer(null);
    const response = await ApiController.getPlayer(id);
    if (response.ok) {
      loadMatches();
      setPlayer(response.val);
    } else {
      setError("Player not found!");
    }
  };

  useEffect(() => {
    setError("");
    loadPlayer();
  }, [id]);

  const totalStats =
    player && player.stats ? generateTotalStats(player.stats) : null;

  const isNewPlayer =
    player &&
    isBefore(sub(new Date(), { minutes: 60 }), parseISO(player.createdAt));

  const onChangeFavorite = () => {
    if (!favoritePlayers) return;
    if (favoritePlayers.includes(id)) {
      favoritePlayers.splice(favoritePlayers.indexOf(id));
      setFavoritePlayers([...favoritePlayers]);
    } else {
      setFavoritePlayers([...favoritePlayers, id]);
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12} className={classes.header}>
          <Typography className={classes.title} variant="h4" gutterBottom>
            {id}
          </Typography>
          <Tooltip
            title="Add to favorite"
            placement="left"
            enterDelay={500}
            enterNextDelay={500}
            disableFocusListener
          >
            <IconButton
              className={classes.favButton}
              size="medium"
              onClick={() => onChangeFavorite()}
            >
              {favoritePlayers && favoritePlayers.includes(id) ? (
                <FavoriteIcon fontSize="inherit" />
              ) : (
                <FavoriteBorderIcon fontSize="inherit" />
              )}
            </IconButton>
          </Tooltip>
        </Grid>

        {isNewPlayer && (
          <Grid item xs={12}>
            <Alert severity="info">
              Please wait up to 60 minutes to see all player stats and matches.
            </Alert>
          </Grid>
        )}

        <Grid item md={3} xs={12}>
          <Tooltip
            title={
              player && player.statsUpdatedAt
                ? "Updated " +
                  formatDistanceToNow(parseISO(player.statsUpdatedAt), {
                    addSuffix: true,
                  })
                : "Updated: never"
            }
            placement="top-start"
            enterDelay={500}
            enterNextDelay={500}
            disableFocusListener
          >
            <Typography variant="subtitle1">Total stats</Typography>
          </Tooltip>
          <List>
            {player && totalStats ? (
              <PlayerStatsCard stats={totalStats} />
            ) : (
              <PlayerStatsCardLoading />
            )}
          </List>
        </Grid>
        <Grid item md={9} xs={12}>
          <Tooltip
            title={
              player && player.matchesUpdatedAt
                ? "Updated " +
                  formatDistanceToNow(parseISO(player.matchesUpdatedAt), {
                    addSuffix: true,
                  })
                : "Updated: never"
            }
            placement="top-start"
            enterDelay={500}
            enterNextDelay={500}
            disableFocusListener
          >
            <Typography variant="subtitle1">Matches</Typography>
          </Tooltip>
          <List>
            {player && matches !== null ? (
              <PlayerMatchesList matches={matches} player={player} />
            ) : (
              <Skeleton variant="rect" height={56} />
            )}
          </List>
        </Grid>
      </Grid>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
};

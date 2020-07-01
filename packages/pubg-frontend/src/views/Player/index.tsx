/* eslint-disable react-hooks/exhaustive-deps */

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Star from "@material-ui/icons/Star";
import StarBorder from "@material-ui/icons/StarBorder";
import Alert from "@material-ui/lab/Alert";
import Skeleton from "@material-ui/lab/Skeleton";
import { view } from "@risingstack/react-easy-state";
import { formatDistanceToNow, isBefore, parseISO, sub } from "date-fns";
import { MatchesRequest } from "pubg-model/types/Match";
import { PlayerRequest } from "pubg-model/types/Player";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiController } from "../../components/ApiController";
import { PlayerMatchesList } from "../../components/PlayerMatchesList";
import {
  PlayerStatsCard,
  PlayerStatsCardLoading,
} from "../../components/PlayerStatsCard";
import { app } from "../../components/store";
import { matchRequestDefaults } from "../../constants";
import { generateTotalStats } from "../../utils";

const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    padding: theme.spacing(2, 2),
  },
  favButton: {
    marginLeft: "auto",
    color: "#DAA73A",
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

export const Player = view(() => {
  const { id } = useParams();
  const classes = useStyles();

  const [player, setPlayer] = useState<PlayerRequest | null>(null);
  const [matches, setMatches] = useState<MatchesRequest | null>([]);
  const [error, setError] = useState<string | null>(null);

  const abortCtrl = new AbortController();

  const loadMatches = async () => {
    setMatches(null);
    const response = await ApiController.getPlayerMatches(
      id,
      matchRequestDefaults.limit,
      matchRequestDefaults.offset
    );
    if (abortCtrl.signal.aborted) return;
    if (response.ok) setMatches(response.val);
  };

  const loadPlayer = async () => {
    setPlayer(null);
    app.title = id;
    const response = await ApiController.getPlayer(id);
    if (abortCtrl.signal.aborted) return;
    if (response.ok) {
      loadMatches();
      setPlayer(response.val);
      if (app.lastVisitedPlayer.indexOf(id) === -1)
        app.lastVisitedPlayer = [id, ...app.lastVisitedPlayer.slice(0, 9)];
    } else {
      setError("Player not found!");
      app.title = "player not found";
    }
  };

  useEffect(() => {
    setError(null);
    loadPlayer();

    return () => {
      abortCtrl.abort();
    };
  }, [id]);

  const totalStats =
    player && player.stats ? generateTotalStats(player.stats) : null;

  const isNewPlayer =
    player &&
    isBefore(sub(new Date(), { minutes: 60 }), parseISO(player.createdAt));

  const onChangeFavorite = () => {
    if (app.favoritePlayer.includes(id)) {
      app.favoritePlayer.splice(app.favoritePlayer.indexOf(id));
      app.favoritePlayer = [...app.favoritePlayer];
    } else {
      app.favoritePlayer = [...app.favoritePlayer, id];
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12} className={classes.header}>
          <Typography component="div" className={classes.title}>
            <Box fontWeight="fontWeightMedium" fontSize={26}>
              {id}
            </Box>
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
              {app.favoritePlayer.includes(id) ? (
                <Star fontSize="inherit" />
              ) : (
                <StarBorder fontSize="inherit" />
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
});

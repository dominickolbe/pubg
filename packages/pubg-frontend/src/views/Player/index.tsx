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
import { rootstore } from "../../components/store";
import {
  matchRequestDefaults,
  PLAYER_VIEW_UPDATE_INTERVAL,
} from "../../constants";
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
    color: "#F2D829",
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

  const [intervalFn, setIntervalFn] = useState<ReturnType<
    typeof setInterval
  > | null>(null);

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
    rootstore.title = id;
    const response = await ApiController.getPlayer(id);
    if (abortCtrl.signal.aborted) return;
    if (response.ok) {
      loadMatches();
      setPlayer(response.val);
      if (rootstore.lastVisitedPlayer.indexOf(id) === -1)
        rootstore.lastVisitedPlayer = [
          id,
          ...rootstore.lastVisitedPlayer.slice(0, 9),
        ];
    } else {
      if (response.err.response && response.err.response.status === 429) {
        setError("Too Many Requests. Please try later");
      } else {
        setError("Player not found");
        rootstore.title = "player not found";
      }
    }
  };

  useEffect(() => {
    setError(null);
    loadPlayer();

    return () => {
      abortCtrl.abort();
    };
  }, [id]);

  useEffect(() => {
    if (intervalFn && !rootstore.app.playerIntervalUpdate)
      clearInterval(intervalFn);
    if (rootstore.app.playerIntervalUpdate) {
      if (abortCtrl.signal.aborted) return;
      setIntervalFn(
        setInterval(() => {
          loadPlayer();
        }, PLAYER_VIEW_UPDATE_INTERVAL)
      );
    }
    return () => {
      if (intervalFn) clearInterval(intervalFn);
    };
  }, [rootstore.app.playerIntervalUpdate]);

  const totalStats = player ? generateTotalStats(player.stats) : null;

  const isNewPlayer =
    player &&
    isBefore(sub(new Date(), { minutes: 60 }), parseISO(player.createdAt));

  const onChangeFavorite = () => {
    if (rootstore.favoritePlayer.includes(id)) {
      rootstore.favoritePlayer.splice(rootstore.favoritePlayer.indexOf(id));
      rootstore.favoritePlayer = [...rootstore.favoritePlayer];
      rootstore.notification.msg = "Player removed from your favorites";
      rootstore.notification.type = "success";
      rootstore.notification.show = true;
    } else {
      rootstore.favoritePlayer = [...rootstore.favoritePlayer, id];
      rootstore.notification.msg = "Player added to your favorites";
      rootstore.notification.type = "success";
      rootstore.notification.show = true;
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
              {rootstore.favoritePlayer.includes(id) ? (
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

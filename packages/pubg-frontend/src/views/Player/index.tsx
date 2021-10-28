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
import { formatDistanceToNow, parseISO } from "date-fns";
import { MatchesRequest } from "pubg-model/types/Match";
import { PlayerRequest } from "pubg-model/types/Player";
import { PLAYER_MATCHES_REQUEST_DEFAULTS } from "pubg-utils/src";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiController } from "../../components/ApiController";
import { LastPlayedTeamCard } from "../../components/LastPlayedTeamCard";
import { MatchTable } from "../../components/MatchTable";
import {
  PlayerStatsCard,
  PlayerStatsCardLoading,
} from "../../components/PlayerStatsCard";
import { rootstore } from "../../components/store";
import { usePageview } from "../../services/Tracking/usePageview";
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
  // @ts-ignore
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
      PLAYER_MATCHES_REQUEST_DEFAULTS.LIMIT,
      PLAYER_MATCHES_REQUEST_DEFAULTS.OFFSET
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

  usePageview(`/players/${id}`);

  const totalStats = player ? generateTotalStats(player.stats) : null;

  const isNewPlayer =
    player?.matchesUpdatedAt === null || player?.statsUpdatedAt === null;

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
          <Grid container spacing={2}>
            <Grid item md={12} sm={6} xs={12}>
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
            <Grid item md={12} sm={6} xs={12}>
              <Typography variant="subtitle1">Recently Played With</Typography>
              <List>
                {player && matches !== null ? (
                  <>
                    <LastPlayedTeamCard matches={matches} player={player} />
                  </>
                ) : (
                  <PlayerStatsCardLoading />
                )}
              </List>
            </Grid>
          </Grid>
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
              <MatchTable matches={matches} player={player} />
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

/* eslint-disable react-hooks/exhaustive-deps */

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import Skeleton from "@material-ui/lab/Skeleton";
import { format, isBefore, parseISO, sub } from "date-fns";
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
  title: {
    padding: theme.spacing(2, 2, 0),
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

  const loadPlayer = async () => {
    setPlayer(null);
    const response = await ApiController.getPlayer(id);
    if (response.ok) {
      setPlayer(response.val);
    } else {
      setError("Player not found!");
    }
  };

  const loadMatches = async () => {
    setMatches(null);
    const response = await ApiController.getPlayerMatches(
      id,
      matchRequestDefaults.limit,
      matchRequestDefaults.offset
    );
    if (response.ok) setMatches(response.val);
  };

  useEffect(() => {
    setError("");
    loadPlayer();
    loadMatches();
  }, [id]);

  const totalStats =
    player && player.stats ? generateTotalStats(player.stats) : null;

  const isNewPlayer =
    player &&
    isBefore(sub(new Date(), { minutes: 60 }), parseISO(player.createdAt));

  return (
    <Container maxWidth="md">
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h4" gutterBottom>
            {id}
          </Typography>
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
                ? "Updated: " + format(parseISO(player.statsUpdatedAt), "PPpp")
                : "Updated: never"
            }
            placement="top-start"
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
                ? "Updated: " +
                  format(parseISO(player.matchesUpdatedAt), "PPpp")
                : "Updated: never"
            }
            placement="top-start"
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

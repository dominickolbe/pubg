import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import Skeleton from "@material-ui/lab/Skeleton";
import { MatchesRequest } from "pubg-model/types/Match";
import { PlayerRequest } from "pubg-model/types/Player";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ApiController } from "../../components/ApiController";
import { PlayerMatchesList } from "../../components/PlayerMatchesList";
import {
  PlayerStatsCard,
  PlayerStatsCardLoading,
} from "../../components/PlayerStatsCard";
import { generateTotalStats } from "../../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
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
  const history = useHistory();
  const classes = useStyles();

  const [player, setPlayer] = useState<PlayerRequest | null>(null);
  const [matches, setMatches] = useState<MatchesRequest>([]);

  const loadMatches = async () => {
    const response = await ApiController.getPlayerMatches(id);
    if (response.ok) setMatches(response.val);
  };
  const loadPlayer = async () => {
    const response = await ApiController.getPlayer(id);
    if (response.ok) {
      setPlayer(response.val);
    } else {
      history.push("/playernotfound");
    }
  };

  useEffect(() => {
    loadPlayer();
    loadMatches();
  }, []);

  const totalStats =
    player && player.stats ? generateTotalStats(player.stats) : null;

  return (
    <Container maxWidth="md">
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h4" gutterBottom>
            {id}
          </Typography>
        </Grid>
        <Grid item md={3} xs={12}>
          <Typography variant="subtitle1">Total stats</Typography>
          {/* <Typography variant="caption">{`updated: ${
            player.statsUpdatedAt
              ? formatDistanceToNow(parseISO(player.statsUpdatedAt), {
                  includeSeconds: true,
                  addSuffix: true,
                })
              : "never"
          }`}</Typography> */}
          <List>
            {player === null ? (
              <PlayerStatsCardLoading />
            ) : totalStats ? (
              <PlayerStatsCard stats={totalStats} />
            ) : (
              <Alert severity="info">not imported yet</Alert>
            )}
          </List>
        </Grid>
        <Grid item md={9} xs={12}>
          <Typography variant="subtitle1">Matches</Typography>
          {/* <Typography variant="caption">{`updated: ${
            player.matchesUpdatedAt
              ? formatDistanceToNow(parseISO(player.matchesUpdatedAt), {
                  includeSeconds: true,
                  addSuffix: true,
                })
              : "never"
          }`}</Typography> */}
          <List>
            {player === null || matches.length === 0 ? (
              <Skeleton variant="rect" height={48} />
            ) : (
              <PlayerMatchesList matches={matches} player={player} />
            )}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};

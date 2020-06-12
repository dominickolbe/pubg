import Container from "@material-ui/core/Container";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Alert from "@material-ui/lab/Alert";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import orderBy from "lodash/orderBy";
import { PlayerRequest } from "pubg-model/types/Player";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ApiController } from "../../components/ApiController";
import { PlayerStatsCard } from "../../components/PlayerStatsCard";
import { generateTotalStats, getMapName, getWinPlace } from "../../utils";

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

  const loadPlayer = async () => {
    const response = await ApiController.getPlayer(id, true, true);
    if (response.ok) {
      setPlayer(response.val);
    } else {
      history.push("/playernotfound");
    }
  };

  const [player, setPlayer] = useState<PlayerRequest | null>(null);

  useEffect(() => {
    loadPlayer();
  }, []);

  if (player === null) {
    return <div>Loading...</div>;
  }

  const totalStats = player.stats ? generateTotalStats(player.stats) : null;

  const matches = orderBy(player.matches, ["createdAt"], ["desc"]);

  return (
    <Container maxWidth="md">
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h4" gutterBottom>
            {player.name}
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
            {totalStats ? (
              <PlayerStatsCard stats={totalStats} />
            ) : (
              <Alert severity="info">not imported yet</Alert>
            )}
          </List>
        </Grid>
        <Grid item md={9} xs={12}>
          <Typography variant="subtitle1">Matches</Typography>
          <Typography variant="caption">{`updated: ${
            player.matchesUpdatedAt
              ? formatDistanceToNow(parseISO(player.matchesUpdatedAt), {
                  includeSeconds: true,
                  addSuffix: true,
                })
              : "never"
          }`}</Typography>
          <List>
            {matches.map((match) => (
              <ExpansionPanel
                key={match.matchId}
                TransitionProps={{ unmountOnExit: true }}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                  <Typography className={classes.expansionPanelHeading}>
                    {getMapName(match.mapName)}
                    {" - "}
                    {getWinPlace(match, player.pubgId)}
                  </Typography>
                  <Typography
                    className={classes.expansionPanelSecondaryHeading}
                  >
                    {format(parseISO(match.createdAt), "PPpp")}
                  </Typography>
                </ExpansionPanelSummary>
              </ExpansionPanel>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};

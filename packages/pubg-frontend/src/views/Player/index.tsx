import { Container, Grid, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { formatDistanceToNow, parseISO } from "date-fns";
import { PlayerRequest } from "pubg-model/types/Player";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ApiController } from "../../components/ApiController";
import { getTotalStats } from "../../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  },
  title: {
    padding: theme.spacing(2, 2, 0),
  },
}));

export const Player = () => {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();

  const loadPlayer = async () => {
    const response = await ApiController.getPlayer(id);
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

  const totalStats = player.stats ? getTotalStats(player.stats) : null;

  return (
    <Container maxWidth="md">
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h5" gutterBottom>
            {player.name}
          </Typography>
        </Grid>
        <Grid item md={4} xs={12}>
          <Card>
            <CardHeader
              title="Total stats"
              subheader={`updated: ${
                player.statsUpdatedAt
                  ? formatDistanceToNow(parseISO(player.statsUpdatedAt), {
                      includeSeconds: true,
                      addSuffix: true,
                    })
                  : "never"
              }`}
            />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemText primary="Kills" />
                  <ListItemSecondaryAction>
                    {totalStats?.kills || "-"}
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Damage" />
                  <ListItemSecondaryAction>
                    {totalStats?.damageDealt || "-"}
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Wins" />
                  <ListItemSecondaryAction>
                    {totalStats?.wins || "-"}
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Top 10" />
                  <ListItemSecondaryAction>
                    {totalStats?.top10s || "-"}
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Rounds played" />
                  <ListItemSecondaryAction>
                    {totalStats?.roundsPlayed || "-"}
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={8} xs={12}>
          <Card>
            <CardHeader
              title="Matches"
              subheader={`updated: ${
                player.matchesUpdatedAt
                  ? formatDistanceToNow(parseISO(player.matchesUpdatedAt), {
                      includeSeconds: true,
                      addSuffix: true,
                    })
                  : "never"
              }`}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

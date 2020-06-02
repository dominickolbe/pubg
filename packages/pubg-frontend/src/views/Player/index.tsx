import { Container, Grid, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { css } from "emotion";
import { PlayerRequest } from "pubg-model/types/Player";
import React, { ReactNode, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ApiController } from "../../components/ApiController";
import { getTotalStats } from "../../utils";

const SingleStatsListItem = (props: {
  label: string;
  value: () => ReactNode;
}) => {
  const { value, label, ...others } = props;
  return (
    <ListItem component="div" {...others}>
      <ListItemText primary={label} />
      <ListItemText
        className={css`
          display: flex;
          justify-content: flex-end;
        `}
        primary={value()}
      />
    </ListItem>
  );
};

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
    const response = await ApiController.getPlayer(id, true, true);
    if (response.ok) {
      setPlayer(response.val);
    } else {
      history.push("/playernotfound");
    }
  };

  const [player, setPlayer] = useState<PlayerRequest | null>(null);

  const [openStats, setOpenStats] = useState(false);

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
          <Card>
            <List component="div" dense>
              <SingleStatsListItem
                label="Kills"
                value={() => totalStats?.kills || "-"}
              />
              <SingleStatsListItem
                label="Damage"
                value={() => totalStats?.damageDealt || "-"}
              />
              <SingleStatsListItem
                label="Wins"
                value={() => totalStats?.wins || "-"}
              />
              <SingleStatsListItem
                label="Top 10"
                value={() => totalStats?.top10s || "-"}
              />
              <Divider light />
              <ListItem
                button
                onClick={() => setOpenStats(!openStats)}
                className={css`
                  display: flex;
                  justify-content: center;
                `}
              >
                {openStats ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Divider light />
              <Collapse in={openStats} timeout="auto">
                <SingleStatsListItem
                  label="dBNOs"
                  value={() => totalStats?.dBNOs || "-"}
                />
                <SingleStatsListItem
                  label="assists"
                  value={() => totalStats?.assists || "-"}
                />
                <SingleStatsListItem
                  label="revives"
                  value={() => totalStats?.revives || "-"}
                />
                <SingleStatsListItem
                  label="vehicleDestroys"
                  value={() => totalStats?.vehicleDestroys || "-"}
                />
              </Collapse>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Typography variant="subtitle1">Matches</Typography>
          <Card>
            <CardContent>{`${player.matches.length} found.`}</CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

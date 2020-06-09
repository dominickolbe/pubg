import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandLess from "@material-ui/icons/ExpandLess";
import {
  default as ExpandMore,
  default as ExpandMoreIcon,
} from "@material-ui/icons/ExpandMore";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { css } from "emotion";
import orderBy from "lodash/orderBy";
import { PlayerRequest } from "pubg-model/types/Player";
import React, { ReactNode, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ApiController } from "../../components/ApiController";
import { getMapName, getTotalStats, getWinPlace } from "../../utils";

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
        primary={
          <Typography component="div">
            <Box fontWeight="fontWeightMedium" fontSize={14}>
              {value()}
            </Box>
          </Typography>
        }
        disableTypography
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

  const [openStats, setOpenStats] = useState(false);

  useEffect(() => {
    loadPlayer();
  }, []);

  if (player === null) {
    return <div>Loading...</div>;
  }

  const totalStats = player.stats ? getTotalStats(player.stats) : null;

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
          <Typography variant="caption">{`updated: ${
            player.statsUpdatedAt
              ? formatDistanceToNow(parseISO(player.statsUpdatedAt), {
                  includeSeconds: true,
                  addSuffix: true,
                })
              : "never"
          }`}</Typography>
          <List>
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
                <Collapse in={openStats} timeout="auto">
                  <SingleStatsListItem
                    label="DBNOs"
                    value={() => totalStats?.dBNOs || "-"}
                  />
                  <SingleStatsListItem
                    label="Assists"
                    value={() => totalStats?.assists || "-"}
                  />
                  <SingleStatsListItem
                    label="Revives"
                    value={() => totalStats?.revives || "-"}
                  />
                  <SingleStatsListItem
                    label="Vehicle destroyed"
                    value={() => totalStats?.vehicleDestroys || "-"}
                  />
                </Collapse>
                <ListItem button onClick={() => setOpenStats(!openStats)}>
                  <ListItemText
                    primary={
                      <Typography component="div">
                        <Box fontWeight="fontWeightMedium" fontSize={14}>
                          {`Show ${openStats ? "less" : "more"}`}
                        </Box>
                      </Typography>
                    }
                    disableTypography
                  />
                  {openStats ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              </List>
            </Card>
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
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
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

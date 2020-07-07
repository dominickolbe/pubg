import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Skeleton from "@material-ui/lab/Skeleton";
import { css } from "emotion";
import { StatsObject } from "pubg-model/types/Stats";
import React, { ReactNode } from "react";
import { useLocalStorage } from "react-use";
import { formatNumber } from "../../utils";

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

export const PlayerStatsCard = (props: { stats: StatsObject }) => {
  const { stats } = props;
  const [expanded, setExpanded] = useLocalStorage(
    "PlayerStatsCard-expanded",
    false
  );

  return (
    <Card>
      <List component="div" dense>
        <SingleStatsListItem
          label="Wins"
          value={() => formatNumber(stats.wins)}
        />
        <SingleStatsListItem
          label="Kills"
          value={() => formatNumber(stats.kills)}
        />
        <SingleStatsListItem
          label="Avg. K/D"
          value={() => (stats.kills / stats.roundsPlayed).toFixed(1)}
        />
        <SingleStatsListItem
          label="Avg. Damage"
          value={() => (stats.damageDealt / stats.roundsPlayed).toFixed(0)}
        />
        <Collapse in={expanded} timeout="auto">
          <SingleStatsListItem
            label="Rounds played"
            value={() => formatNumber(stats.roundsPlayed)}
          />
          <SingleStatsListItem
            label="Time survived"
            value={() =>
              formatNumber(Math.ceil(stats.timeSurvived / 60 / 60)) + " h"
            }
          />
          <SingleStatsListItem
            label="Top 10"
            value={() => formatNumber(stats.top10s)}
          />
          <SingleStatsListItem
            label="Top 10 %"
            value={() =>
              ((stats.top10s / stats.roundsPlayed) * 100).toFixed(0) + "%"
            }
          />
          <SingleStatsListItem
            label="Wins %"
            value={() =>
              ((stats.wins / stats.roundsPlayed) * 100).toFixed(0) + "%"
            }
          />
          <SingleStatsListItem
            label="Damage"
            value={() => formatNumber(stats.damageDealt)}
          />
          <SingleStatsListItem
            label="Headshot kills"
            value={() => formatNumber(stats.headshotKills)}
          />
          <SingleStatsListItem
            label="DBNOs"
            value={() => formatNumber(stats.dBNOs)}
          />
          <SingleStatsListItem
            label="Assists"
            value={() => formatNumber(stats.assists)}
          />
          <SingleStatsListItem
            label="Revives"
            value={() => formatNumber(stats.revives)}
          />
          <SingleStatsListItem
            label="Team kills"
            value={() => formatNumber(stats.teamKills)}
          />
          <SingleStatsListItem
            label="Suicides"
            value={() => formatNumber(stats.suicides)}
          />
          <SingleStatsListItem
            label="Heals"
            value={() => formatNumber(stats.heals)}
          />
          <SingleStatsListItem
            label="Boosts"
            value={() => formatNumber(stats.boosts)}
          />
          <SingleStatsListItem
            label="Weapons acquired"
            value={() => formatNumber(stats.weaponsAcquired)}
          />
          <SingleStatsListItem
            label="Vehicle destroyed"
            value={() => formatNumber(stats.vehicleDestroys)}
          />
          <SingleStatsListItem
            label="Ride distance"
            value={() =>
              formatNumber(Math.ceil(stats.rideDistance / 1000)) + " km"
            }
          />
          <SingleStatsListItem
            label="Walk distance"
            value={() =>
              formatNumber(Math.ceil(stats.walkDistance / 1000)) + " km"
            }
          />
          <SingleStatsListItem
            label="Swim distance"
            value={() =>
              formatNumber(Math.ceil(stats.swimDistance / 1000)) + " km"
            }
          />
        </Collapse>
        <ListItem button onClick={() => setExpanded(!expanded)}>
          <ListItemText
            primary={
              <Typography component="div">
                <Box fontWeight="fontWeightMedium" fontSize={14}>
                  {`Show ${expanded ? "less" : "more"}`}
                </Box>
              </Typography>
            }
            disableTypography
          />
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </List>
    </Card>
  );
};

export const PlayerStatsCardLoading = () => {
  return <Skeleton variant="rect" height={201} />;
};

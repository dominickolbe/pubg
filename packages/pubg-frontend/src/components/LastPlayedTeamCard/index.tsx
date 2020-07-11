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
import { MatchesRequest } from "pubg-model/types/Match";
import { PlayerRequest } from "pubg-model/types/Player";
import React, { useState } from "react";
import { getRecentlyPlayedWith } from "../../utils";

export const LastPlayedTeamCard = (props: {
  player: PlayerRequest;
  matches: MatchesRequest;
}) => {
  const { player, matches } = props;

  const [expanded, setExpanded] = useState(true);

  const [recently] = useState(() =>
    getRecentlyPlayedWith(matches, player.pubgId, 5)
  );

  return (
    <Card>
      <List component="div" dense>
        <ListItem button onClick={() => setExpanded(!expanded)}>
          <ListItemText
            primary={
              <Typography component="div">
                <Box fontWeight="fontWeightMedium" fontSize={14}>
                  Recently Played With
                </Box>
              </Typography>
            }
            disableTypography
          />
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        {recently.length >= 1 ? (
          <Collapse in={expanded} timeout="auto">
            {recently.map((player) => (
              <ListItem key={player.name} component="div">
                <ListItemText primary={player.name} />
                <ListItemText
                  className={css`
                    display: flex;
                    justify-content: flex-end;
                  `}
                  primary={
                    <Typography component="div">
                      <Box fontWeight="fontWeightMedium" fontSize={14}>
                        {player.matches}
                      </Box>
                    </Typography>
                  }
                  disableTypography
                />
              </ListItem>
            ))}
          </Collapse>
        ) : (
          <ListItem component="div">
            <ListItemText primary="-" />
          </ListItem>
        )}
      </List>
    </Card>
  );
};

export const PlayerStatsCardLoading = () => {
  return <Skeleton variant="rect" height={201} />;
};

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { css } from "emotion";
import { MatchesRequest } from "pubg-model/types/Match";
import { PlayerRequest } from "pubg-model/types/Player";
import React from "react";
import { getRecentlyPlayedWith } from "../../utils";

export const LastPlayedTeamCard = (props: {
  player: PlayerRequest;
  matches: MatchesRequest;
}) => {
  const { player, matches } = props;

  const recently = getRecentlyPlayedWith(matches, player.pubgId, 5);

  return (
    <Card>
      <List component="div" dense>
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
      </List>
    </Card>
  );
};

export const PlayerStatsCardLoading = () => {
  return <Skeleton variant="rect" height={201} />;
};

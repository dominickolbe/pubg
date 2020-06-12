import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { format, parseISO } from "date-fns";
import orderBy from "lodash/orderBy";
import { MatchesRequest } from "pubg-model/types/Match";
import { PlayerRequest } from "pubg-model/types/Player";
import React from "react";
import { getMapName, getWinPlace } from "../../utils";

const useStyles = makeStyles((theme) => ({
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

export const PlayerMatchesList = (props: {
  player: PlayerRequest;
  matches: MatchesRequest;
}) => {
  const { player, matches } = props;
  const classes = useStyles();

  const orderedMatches = orderBy(matches, ["createdAt"], ["desc"]);

  return (
    <>
      {orderedMatches.map((match) => (
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
            <Typography className={classes.expansionPanelSecondaryHeading}>
              {format(parseISO(match.createdAt), "PPpp")}
            </Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      ))}
    </>
  );
};

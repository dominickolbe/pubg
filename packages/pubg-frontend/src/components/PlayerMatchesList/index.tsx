import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { formatDistanceToNow, parseISO } from "date-fns";
import orderBy from "lodash/orderBy";
import { MatchesRequest } from "pubg-model/types/Match";
import { PlayerRequest } from "pubg-model/types/Player";
import React from "react";
import {
  formatNumber,
  getGameMode,
  getMapName,
  getPlayerMatchStats,
} from "../../utils";

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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Mode</TableCell>
            <TableCell>Map</TableCell>
            <TableCell align="right">Kills</TableCell>
            <TableCell align="right">Damage</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderedMatches.map((match) => {
            const playerStats = getPlayerMatchStats(match, player.pubgId);
            return (
              <TableRow key={match.matchId} hover>
                <TableCell component="th" scope="row">
                  {playerStats.winPlace} / {match.teams.length}
                </TableCell>
                <TableCell component="th" scope="row">
                  {getGameMode(match.gameMode)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {getMapName(match.mapName)}
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  {playerStats.kills}
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  {formatNumber(Math.ceil(playerStats.damageDealt))}
                </TableCell>
                <TableCell align="right">
                  {" "}
                  {formatDistanceToNow(parseISO(match.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

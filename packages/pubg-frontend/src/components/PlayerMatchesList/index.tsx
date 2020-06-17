import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import orderBy from "lodash/orderBy";
import { MatchesRequest } from "pubg-model/types/Match";
import { PlayerRequest } from "pubg-model/types/Player";
import React, { useState } from "react";
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

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography component="div">
                  <Box fontWeight="fontWeightMedium" fontSize={13}>
                    Rank
                  </Box>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography component="div">
                  <Box fontWeight="fontWeightMedium" fontSize={13}>
                    Mode
                  </Box>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography component="div">
                  <Box fontWeight="fontWeightMedium" fontSize={13}>
                    Map
                  </Box>
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography component="div">
                  <Box fontWeight="fontWeightMedium" fontSize={13}>
                    Kills
                  </Box>
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography component="div">
                  <Box fontWeight="fontWeightMedium" fontSize={13}>
                    Damage
                  </Box>
                </Typography>
              </TableCell>
              <TableCell align="right" />
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {orderedMatches
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((match) => {
                const playerStats = getPlayerMatchStats(match, player.pubgId);
                return (
                  <TableRow
                    key={match.matchId}
                    hover
                    style={{
                      borderLeft:
                        playerStats.winPlace === 1
                          ? "1px solid #5D85D2"
                          : playerStats.winPlace <= 10
                          ? "1px solid #DAA73A"
                          : "none",
                    }}
                  >
                    <TableCell component="th" scope="row">
                      # {playerStats.winPlace}
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
                    <TableCell
                      component="th"
                      scope="row"
                      align="right"
                      style={{
                        minWidth: "150px",
                      }}
                    >
                      <Tooltip
                        title={format(parseISO(match.createdAt), "PPpp")}
                        placement="right"
                        disableFocusListener
                      >
                        <div>
                          {formatDistanceToNow(parseISO(match.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => {}}>
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage=""
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={matches.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={(event, newPage) => setPage(newPage)}
        onChangeRowsPerPage={(event) =>
          setRowsPerPage(parseInt(event.target.value, 10))
        }
      />
    </Paper>
  );
};

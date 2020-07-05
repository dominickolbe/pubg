/* eslint-disable react-hooks/exhaustive-deps */

import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
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
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import {
  format,
  formatDistance,
  formatDistanceToNow,
  parseISO,
} from "date-fns";
import orderBy from "lodash/orderBy";
import { MatchesRequest, MatchRequest } from "pubg-model/types/Match";
import { PlayerRequest } from "pubg-model/types/Player";
import React, { useEffect, useState } from "react";
import {
  formatNumber,
  getGameMode,
  getMapName,
  getPlayerMatchStats,
  parseTelemetry,
} from "../../utils";
import { ApiController } from "../ApiController";

const useStyles = makeStyles((theme) => ({
  tableRowRoot: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  matchRowDetailContainer: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
}));

const MatchRowDetail = (props: {
  match: MatchRequest;
  player: PlayerRequest;
}) => {
  const { match, player } = props;

  const classes = useStyles();

  const abortCtrl = new AbortController();

  const [loadingText, setLoadingText] = React.useState("Loading...");

  const [tab, setTab] = React.useState(0);

  const playerStats = getPlayerMatchStats(match, player.pubgId);

  const teams = orderBy(match.teams, ["rank"], ["asc"]);
  const players = match.players;

  const [telemetry, setTelemetry] = React.useState(() => ({
    kills: [],
    bots: [],
  }));

  const loadTelemetry = async () => {
    const telemetry = await ApiController.getTelemetry(match.telemetry);
    if (abortCtrl.signal.aborted) return;
    if (telemetry.ok) {
      setTelemetry(parseTelemetry(telemetry.val, player.pubgId));
      setLoadingText("");
    } else {
      setLoadingText("Coudln't load match telemetry data!");
    }
  };

  useEffect(() => {
    loadTelemetry();
    return () => {
      abortCtrl.abort();
    };
  }, []);

  return (
    <div className={classes.matchRowDetailContainer}>
      {loadingText ? (
        <Typography component="div">
          <Box fontWeight="fontWeightMedium" fontSize={13}>
            {loadingText}
          </Box>
        </Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card>
              <CardHeader
                title={
                  <Typography component="div">
                    <Box fontWeight="fontWeightBold">{players.length}</Box>
                  </Typography>
                }
                subheader="Total player"
                subheaderTypographyProps={{ variant: "h6" }}
              />
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardHeader
                title={
                  <Typography component="div">
                    <Box fontWeight="fontWeightBold">
                      {telemetry.bots.length}
                    </Box>
                  </Typography>
                }
                subheader="Total bots"
                subheaderTypographyProps={{ variant: "h6" }}
              />
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardHeader
                title={
                  <Typography component="div">
                    <Box fontWeight="fontWeightBold">
                      {(match.duration / 60).toFixed(0) + " min"}
                    </Box>
                  </Typography>
                }
                subheader="Match duration"
                subheaderTypographyProps={{ variant: "h6" }}
              />
            </Card>
          </Grid>
          <Grid item xs={12}>
            {telemetry.kills.length > 0 && (
              <List
                subheader={<ListSubheader component="div">Kills</ListSubheader>}
                dense
              >
                {telemetry.kills.map((kill) => (
                  <ListItem
                    key={
                      // @ts-ignore
                      kill.date
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography>
                          {
                            // @ts-ignore
                            kill.isBot && (
                              <FontAwesomeIcon
                                icon={faRobot}
                                style={{ paddingBottom: 2, marginRight: 8 }}
                                size="sm"
                              />
                            )
                          }
                          {
                            // @ts-ignore
                            kill.victim
                          }
                        </Typography>
                      }
                      secondary={
                        // @ts-ignore
                        kill.how
                      }
                    />
                    <ListItemSecondaryAction>
                      <ListItemText>
                        {
                          // @ts-ignore
                          formatDistance(
                            parseISO(match.createdAt),
                            // @ts-ignore
                            parseISO(kill.date)
                          )
                        }
                      </ListItemText>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>
        </Grid>
      )}
    </div>
  );

  // return (
  //   <>
  //     <Tabs
  //       indicatorColor="primary"
  //       textColor="primary"
  //       centered
  //       variant="fullWidth"
  //       value={tab}
  //       onChange={(e, newValue) => setTab(newValue)}
  //     >
  //       <Tab label="teams"></Tab>
  //       <Tab label="players" />
  //       <Tab label="general" />
  //     </Tabs>
  //     {tab === 0 && (
  //       <div>
  //         <List style={{ paddingTop: 0, paddingBottom: 0 }}>
  //           {teams.map((team) => {
  //             const players = team.players.map((player) =>
  //               getPlayerMatchStats2(match, player)
  //             );
  //             return (
  //               <ListItem
  //                 key={team.teamId}
  //                 selected={playerStats.winPlace === team.rank}
  //                 style={{ paddingLeft: 25 }}
  //               >
  //                 <ListItemIcon># {team.rank}</ListItemIcon>
  //                 <ListItemText
  //                   primary={
  //                     <Typography variant="body2">
  //                       {players.map((p) => p.name).join(", ")}
  //                     </Typography>
  //                   }
  //                 />
  //               </ListItem>
  //             );
  //           })}
  //         </List>
  //       </div>
  //     )}
  //     {tab === 1 && (
  //       <div>
  //         <List style={{ paddingTop: 0, paddingBottom: 0 }}>
  //           {players.map((player) => {
  //             return (
  //               <ListItem
  //                 key={player.id}
  //                 style={{ paddingLeft: 25 }}
  //                 selected={playerStats.name === player.stats.name}
  //               >
  //                 <ListItemText
  //                   primary={
  //                     <Typography variant="body1">
  //                       {player.stats.name}
  //                     </Typography>
  //                   }
  //                   secondary={
  //                     <Typography variant="body2">
  //                       Kills: {player.stats.kills}
  //                     </Typography>
  //                   }
  //                 />
  //               </ListItem>
  //             );
  //           })}
  //         </List>
  //       </div>
  //     )}
  //   </>
  // );
};

export const MatchRow = (props: {
  match: MatchRequest;
  player: PlayerRequest;
}) => {
  const classes = useStyles();
  const { match, player } = props;
  const playerStats = getPlayerMatchStats(match, player.pubgId);

  const [open, setOpen] = useState(false);

  return (
    <>
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
          backgroundColor: open ? "#515151" : "",
        }}
        className={open ? "" : classes.tableRowRoot}
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
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <MatchRowDetail player={player} match={match} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const PlayerMatchesList = (props: {
  player: PlayerRequest;
  matches: MatchesRequest;
}) => {
  const { player, matches } = props;

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
            {matches
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((match) => (
                <MatchRow key={match._id} match={match} player={player} />
              ))}
            {matches.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  no matches found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {
        // TODO: create global constant
        matches.length > 10 && (
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
        )
      }
    </Paper>
  );
};

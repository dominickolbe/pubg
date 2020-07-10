/* eslint-disable react-hooks/exhaustive-deps */

import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Tabs from "@material-ui/core/Tabs";
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
import { Link } from "react-router-dom";
import {
  formatNumber,
  generateTeamStats,
  getGameMode,
  getMapName,
  getPlayerMatchStats,
  parseMatchTelemetryByPlayer,
} from "../../utils";
import { ApiController } from "../ApiController";
import { ITelemtryPlayer } from "pubg-model/types/Telemtry";

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
  playerChip: {
    color: "white",
    background: "#3a3a3a",
    fontSize: "12px",
    marginRight: "5px",
    padding: "3px 5px",
    textDecoration: "none",
    transition: "background 200ms ease",
    "&:hover": {
      background: "#292929",
    },
  },
}));

const MatchRowDetail = (props: {
  match: MatchRequest;
  player: PlayerRequest;
}) => {
  const classes = useStyles();
  const { match, player } = props;

  const abortCtrl = new AbortController();

  const [message, setMessage] = React.useState("Loading...");
  const [tab, setTab] = React.useState(0);

  const [telemetry, setTelemetry] = React.useState<ITelemtryPlayer | null>(
    null
  );

  const loadTelemetry = async () => {
    const telemetry = await ApiController.getTelemetry(match.telemetry);
    if (abortCtrl.signal.aborted) return;
    if (telemetry.ok) {
      const parsed = parseMatchTelemetryByPlayer(telemetry.val, player.pubgId);
      setTelemetry(parsed);
    } else {
      setMessage("Coudln't load match telemetry data!");
    }
  };

  useEffect(() => {
    loadTelemetry();
    return () => {
      abortCtrl.abort();
    };
  }, []);

  const teams = generateTeamStats(match);
  const players = orderBy(match.players, ["stats.winPlace"], ["asc"]);

  return (
    <div className={classes.matchRowDetailContainer}>
      {telemetry === null ? (
        <Typography component="div">
          <Box fontWeight="fontWeightMedium" fontSize={13}>
            {message}
          </Box>
        </Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card>
              <CardHeader
                title={
                  <Typography component="div">
                    <Box fontWeight="fontWeightBold">
                      {match.players.length}
                    </Box>
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
                    <Box fontWeight="fontWeightBold">{telemetry.totalBots}</Box>
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
            <Tabs
              variant="fullWidth"
              centered
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
            >
              <Tab label="Your kills" />
              <Tab label="Teams" />
              <Tab label="Players" />
            </Tabs>
          </Grid>

          {tab === 0 && (
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  {telemetry.kills.length !== 0 && (
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>
                          <Typography component="div">
                            <Box fontWeight="fontWeightBold" fontSize={12}>
                              Player
                            </Box>
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component="div">
                            <Box fontWeight="fontWeightBold" fontSize={12}>
                              Weapon
                            </Box>
                          </Typography>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                  )}
                  <TableBody>
                    {telemetry.kills.map((kill) => (
                      <TableRow key={kill.timestamp}>
                        <TableCell style={{ width: 70 }}>
                          {kill.victim.isBot && (
                            <FontAwesomeIcon
                              icon={faRobot}
                              style={{ paddingBottom: 2, marginRight: 8 }}
                              size="sm"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {kill.victim.isBot ? (
                            <>{kill.victim.name}</>
                          ) : (
                            <Link
                              className={classes.playerChip}
                              to={`/players/${kill.victim.name}`}
                            >
                              {kill.victim.name}
                            </Link>
                          )}
                        </TableCell>
                        <TableCell>{kill.damageCauserName}</TableCell>
                        <TableCell align="right">
                          {formatDistance(
                            parseISO(match.createdAt),
                            parseISO(kill.timestamp)
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {telemetry.kills.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          You haven't killed anyone.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}

          {tab === 1 && (
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>
                        <Typography component="div">
                          <Box fontWeight="fontWeightBold" fontSize={12}>
                            Player
                          </Box>
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography component="div">
                          <Box fontWeight="fontWeightBold" fontSize={12}>
                            Kills
                          </Box>
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography component="div">
                          <Box fontWeight="fontWeightBold" fontSize={12}>
                            Damage
                          </Box>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow
                        key={team.id}
                        style={{
                          backgroundColor: team.players
                            .map((player) => player.name)
                            .includes(player.name)
                            ? "#515151"
                            : "",
                        }}
                      >
                        <TableCell style={{ width: 70 }}>
                          # {team.rank}
                        </TableCell>
                        <TableCell>
                          {team.players.map((player) => (
                            <Link
                              key={player.name}
                              className={classes.playerChip}
                              to={`/players/${player.name}`}
                            >
                              {player.name}
                            </Link>
                          ))}
                        </TableCell>
                        <TableCell align="right">
                          {team.players
                            .map((player) => player.kills)
                            .reduce((a, b) => a + b, 0)}
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(
                            Math.ceil(
                              team.players
                                .map((player) => player.damageDealt)
                                .reduce((a, b) => a + b, 0)
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}

          {tab === 2 && (
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>
                        <Typography component="div">
                          <Box fontWeight="fontWeightBold" fontSize={12}>
                            Player
                          </Box>
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography component="div">
                          <Box fontWeight="fontWeightBold" fontSize={12}>
                            Kills
                          </Box>
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography component="div">
                          <Box fontWeight="fontWeightBold" fontSize={12}>
                            Damage
                          </Box>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {players.map((p) => (
                      <TableRow
                        key={p.id}
                        style={{
                          backgroundColor:
                            p.stats.name === player.name ? "#515151" : "",
                        }}
                      >
                        <TableCell style={{ width: 70 }}>
                          # {p.stats.winPlace}
                        </TableCell>
                        <TableCell>
                          <Link
                            className={classes.playerChip}
                            to={`/players/${p.stats.name}`}
                          >
                            {p.stats.name}
                          </Link>
                        </TableCell>
                        <TableCell align="right">{p.stats.kills}</TableCell>
                        <TableCell align="right">
                          {formatNumber(Math.ceil(p.stats.damageDealt))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
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

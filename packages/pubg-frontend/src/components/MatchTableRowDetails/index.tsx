/* eslint-disable react-hooks/exhaustive-deps */

import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import { formatDistance, parseISO } from "date-fns";
import orderBy from "lodash/orderBy";
import { MatchRequest } from "pubg-model/types/Match";
import { PlayerRequest } from "pubg-model/types/Player";
import { ITelemtryPlayer } from "pubg-model/types/Telemtry";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  formatNumber,
  generateTeamStats,
  parseMatchTelemetryByPlayer,
} from "../../utils";
import { ApiController } from "../ApiController";

const useStyles = makeStyles((theme) => ({
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

export const MatchTableRowDetails = (props: {
  match: MatchRequest;
  player: PlayerRequest;
}) => {
  const classes = useStyles();
  const { match, player } = props;

  const abortCtrl = new AbortController();

  const [message, setMessage] = React.useState("Loading...");
  const [tab, setTab] = React.useState(0);

  const [telemetry, setTelemetry] =
    React.useState<ITelemtryPlayer | null>(null);

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
              <Tab label="Your stats" />
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

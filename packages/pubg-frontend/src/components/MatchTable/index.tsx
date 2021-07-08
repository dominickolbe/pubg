/* eslint-disable react-hooks/exhaustive-deps */

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { MatchesRequest } from "pubg-model/types/Match";
import { PlayerRequest } from "pubg-model/types/Player";
import React, { useState } from "react";
import { MatchTableRow } from "../MatchTableRow";

export const MatchTable = (props: {
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
                <MatchTableRow key={match._id} match={match} player={player} />
              ))}
            {matches.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  no matches found in the last 14 days
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
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) =>
              setRowsPerPage(parseInt(event.target.value, 10))
            }
          />
        )
      }
    </Paper>
  );
};

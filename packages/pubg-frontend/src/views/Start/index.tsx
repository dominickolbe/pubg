import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(8),
  },
  title: {
    padding: theme.spacing(2, 2, 0),
  },
}));

export const Start = () => {
  const classes = useStyles();
  const history = useHistory();

  const [search, setSearch] = useState("");

  const onSubmit = () => {
    search && history.push(`/players/${search}`);
  };

  return (
    <Container maxWidth="sm">
      <Grid container className={classes.root} alignItems="center" spacing={1}>
        <Grid item xs={12}>
          <Typography variant="body1">Search for player:</Typography>
        </Grid>
        <Grid item sm={8} xs={12}>
          <TextField
            label="Player name"
            variant="filled"
            fullWidth
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value.trim())}
            onKeyPress={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            autoFocus
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <Button variant="contained" fullWidth onClick={() => onSubmit()}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

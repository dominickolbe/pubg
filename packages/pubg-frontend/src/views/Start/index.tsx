import { Button, Container, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
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
      <Grid container className={classes.root} alignItems="center" spacing={2}>
        <Grid item xs={8}>
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
        <Grid item xs={4}>
          <Button variant="contained" fullWidth onClick={() => onSubmit()}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

import { createMuiTheme, makeStyles } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

import { createMuiTheme, makeStyles } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#2376E5",
    },
  },
});

export const useStyles = makeStyles((theme) => ({
  root: {},
}));

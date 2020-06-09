import { createMuiTheme, makeStyles } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#2376E5",
    },
  },
  typography: {
    fontFamily: [
      "Product Sans",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export const useStyles = makeStyles((theme) => ({
  root: {},
}));

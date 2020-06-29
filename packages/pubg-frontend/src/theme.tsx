import { createMuiTheme, makeStyles } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#2979ff",
    },
    secondary: {
      main: "#303f9f",
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
  overrides: {
    MuiButton: {
      root: {
        textTransform: "initial",
      },
    },
    MuiTypography: {
      h1: {
        fontSize: "2rem",
      },
      h2: {
        fontSize: "1.75rem",
      },
      h3: {
        fontSize: "1.3rem",
      },
      h4: {
        fontSize: "1.15rem",
      },
      h5: {
        fontSize: "1rem",
      },
    },
  },
});

export const useStyles = makeStyles((theme) => ({
  root: {},
}));

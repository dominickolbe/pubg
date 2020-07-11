import { createMuiTheme, makeStyles } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#2979ff",
    },
    secondary: {
      main: "#F2D829",
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
    MuiTab: {
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
      h6: {
        fontSize: ".8rem",
      },
    },
  },
});

const drawerWidth = 200;

export const useStyles = makeStyles((theme) => ({
  root: {},
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    position: "fixed",
    width: drawerWidth,
    zIndex: theme.zIndex.drawer,
  },
  drawerContainer: {
    overflow: "auto",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    minWidth: 300,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
}));

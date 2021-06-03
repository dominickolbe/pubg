import { createMuiTheme, makeStyles } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    common: {
      black: "#000",
      white: "#fff",
    },
    primary: {
      contrastText: "#ffffff",
      main: "#688eff",
      light: "rgb(134, 164, 255)",
      dark: "rgb(72, 99, 178)",
    },
    secondary: {
      light: "#ff4081",
      main: "#f50057",
      dark: "#c51162",
      contrastText: "#fff",
    },
    error: {
      contrastText: "#ffffff",
      main: "#f44336",
      light: "rgb(246, 104, 94)",
      dark: "rgb(170, 46, 37)",
    },
    warning: {
      contrastText: "#ffffff",
      main: "#ff9800",
      light: "rgb(255, 172, 51)",
      dark: "rgb(178, 106, 0)",
    },
    info: {
      light: "#64b5f6",
      main: "#2196f3",
      dark: "#1976d2",
      contrastText: "#fff",
    },
    success: {
      contrastText: "#ffffff",
      main: "#4caf50",
      light: "rgb(111, 191, 115)",
      dark: "rgb(53, 122, 56)",
    },
    grey: {
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#eeeeee",
      "300": "#e0e0e0",
      "400": "#bdbdbd",
      "500": "#9e9e9e",
      "600": "#757575",
      "700": "#616161",
      "800": "#424242",
      "900": "#212121",
      A100: "#d5d5d5",
      A200: "#aaaaaa",
      A400: "#303030",
      A700: "#616161",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    text: {
      primary: "#ffffff",
      secondary: "#919eab",
      disabled: "rgba(255, 255, 255, 0.5)",
    },
    divider: "rgba(145, 158, 171, 0.24)",
    background: {
      paper: "#222b36",
      default: "#171c24",
    },
    action: {
      active: "#fff",
      hover: "rgba(255, 255, 255, 0.08)",
      hoverOpacity: 0.08,
      selected: "rgba(255, 255, 255, 0.16)",
      selectedOpacity: 0.16,
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      disabledOpacity: 0.38,
      focus: "rgba(255, 255, 255, 0.12)",
      focusOpacity: 0.12,
      activatedOpacity: 0.24,
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
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#222B36",
      },
    },
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

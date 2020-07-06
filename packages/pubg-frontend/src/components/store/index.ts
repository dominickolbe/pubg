import { autoEffect, store } from "@risingstack/react-easy-state";

// TODO: refactor
const fromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const value = localStorage.getItem(key);
    if (value) return JSON.parse(value);
    return defaultValue;
  } catch {
    localStorage.removeItem(key);
    return defaultValue;
  }
};

export type NotificationType = "success" | "error" | "warning" | "info";

type rootstoreDefointion = {
  app: {
    playerIntervalUpdate: boolean;
  };
  drawer: boolean;
  title: string;
  favoritePlayer: string[];
  lastVisitedPlayer: string[];
  dialog: {
    settings: {
      open: boolean;
    };
  };
  notification: {
    show: boolean;
    msg: string;
    duration: number;
    type: NotificationType;
  };
};

const initalStore: rootstoreDefointion = {
  app: {
    playerIntervalUpdate: fromLocalStorage("playerIntervalUpdate", true),
  },
  drawer: false,
  title: "",
  favoritePlayer: fromLocalStorage("favoritePlayer", []),
  lastVisitedPlayer: fromLocalStorage("lastVisitedPlayer", []),
  dialog: {
    settings: {
      open: false,
    },
  },
  notification: {
    show: false,
    msg: "",
    duration: 2000,
    type: "info",
  },
};

export const rootstore = store(initalStore);

autoEffect(
  () =>
    (document.title = `pubg.lol ${
      rootstore.title ? " - " + rootstore.title : ""
    }`)
);

autoEffect(() => {
  localStorage.setItem(
    "playerIntervalUpdate",
    JSON.stringify(rootstore.app.playerIntervalUpdate)
  );
  localStorage.setItem(
    "favoritePlayer",
    JSON.stringify(rootstore.favoritePlayer)
  );
  localStorage.setItem(
    "lastVisitedPlayer",
    JSON.stringify(rootstore.lastVisitedPlayer)
  );
});

import { store, autoEffect } from "@risingstack/react-easy-state";

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

type store = {
  drawer: boolean;
  title: string;
  favoritePlayer: string[];
  lastVisitedPlayer: string[];
  notification: {
    show: boolean;
    msg: string;
    duration: number;
    type: NotificationType;
  };
};

const initalStore: store = {
  drawer: false,
  title: "",
  favoritePlayer: fromLocalStorage("favoritePlayer", []),
  lastVisitedPlayer: fromLocalStorage("lastVisitedPlayer", []),
  notification: {
    show: false,
    msg: "",
    duration: 2000,
    type: "info",
  },
};

export const app = store(initalStore);

autoEffect(
  () => (document.title = `pubg.lol ${app.title ? " - " + app.title : ""}`)
);

autoEffect(() => {
  localStorage.setItem("favoritePlayer", JSON.stringify(app.favoritePlayer));
  localStorage.setItem(
    "lastVisitedPlayer",
    JSON.stringify(app.lastVisitedPlayer)
  );
});

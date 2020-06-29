import { store, autoEffect } from "@risingstack/react-easy-state";

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

type store = {
  drawer: boolean;
  title: string;
  favoritePlayer: string[];
};

const initalStore: {
  drawer: boolean;
  title: string;
  favoritePlayer: string[];
  lastVisitedPlayer: string[];
} = {
  drawer: false,
  title: "",
  favoritePlayer: fromLocalStorage("favoritePlayer", []),
  lastVisitedPlayer: fromLocalStorage("lastVisitedPlayer", []),
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

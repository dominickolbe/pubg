import { store, autoEffect } from "@risingstack/react-easy-state";

const initalStore = {
  drawer: false,
  title: "",
};

export const app = store(initalStore);

autoEffect(
  () => (document.title = `pubg.lol ${app.title ? " - " + app.title : ""}`)
);

import Discord from "discord.js";
const DISCORD_NOTIFICATION_ENABLED =
  process.env.DISCORD_NOTIFICATION_ENABLED || false;
const DISCORD_ID = process.env.DISCORD_ID || "";
const DISCORD_TOKEN = process.env.DISCORD_TOKEN || "";

const hook = new Discord.WebhookClient(DISCORD_ID, DISCORD_TOKEN);

export const DiscordNotifier = (msg: string) => {
  if (DISCORD_NOTIFICATION_ENABLED != "true") return;

  hook.send(`${new Date().toISOString()} ${msg}`);
};

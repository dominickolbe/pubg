import * as Sentry from "@sentry/browser";
import { SENTRY_DSN } from "./config";

const init = () => {
  return {
    initialize: () => {
      if (process.env.NODE_ENV === "production") {
        if (SENTRY_DSN === null) return;
        Sentry.init({
          dsn: SENTRY_DSN,
        });
      }
    },
  };
};

export const SentryClient = init();

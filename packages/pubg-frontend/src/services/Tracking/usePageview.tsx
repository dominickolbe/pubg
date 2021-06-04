import { useEffect } from "react";
import { TrackingClient } from ".";

export function usePageview(path: string) {
  useEffect(() => {
    TrackingClient.pageview(path);
  }, [path]);
}

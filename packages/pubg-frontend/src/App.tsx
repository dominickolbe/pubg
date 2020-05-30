import { PlayerRequest } from "pubg-model/types/Player";
import React, { useState } from "react";
import { ApiController } from "./utils";

export const App = () => {
  const [value, setValue] = useState("");
  const [player, setPlayer] = useState<PlayerRequest | null>(null);

  const onClick = async () => {
    const result = await ApiController.getPlayer(value);
    if (result.ok) setPlayer(result.val);
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={() => onClick()}>search</button>

      <code>{player && JSON.stringify(player, null, 2)}</code>
    </div>
  );
};

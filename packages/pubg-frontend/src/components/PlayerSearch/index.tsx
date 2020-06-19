import React, { ReactNode, useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {
  Player,
  PlayersSearch,
  PlayersSearchSingle,
} from "pubg-model/types/Player";
import { ApiController } from "../ApiController";

export const PlayerSearch = (props: { onSubmit: (value: string) => void }) => {
  const [value, setValue] = useState<PlayersSearchSingle | null>(null);
  const [options, setOptions] = useState<PlayersSearch>([]);
  const [inputValue, setInputValue] = useState("");

  // TODO: add trottle and cache

  useEffect(() => {
    if (!inputValue) return;

    ApiController.search(inputValue).then((resp) => {
      if (resp.ok) {
        setOptions(resp.val);
      }
    });
  }, [inputValue]);

  useEffect(() => {
    if (value) props.onSubmit(value.name);
  }, [value]);

  return (
    <Autocomplete
      style={{ width: 200 }}
      value={value}
      options={options}
      getOptionLabel={(option) => option && option.name}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event: any, newValue) => {
        if (newValue) setValue(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search"
          variant="outlined"
          fullWidth
          size="small"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              // TODO
              // @ts-ignore
              props.onSubmit(e.target.value);
            }
          }}
        />
      )}
    />
  );
};

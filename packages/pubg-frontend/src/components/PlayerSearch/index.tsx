/* eslint-disable react-hooks/exhaustive-deps */

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { PlayersSearch, PlayersSearchSingle } from "pubg-model/types/Player";
import React, { useEffect, useState } from "react";
import { ApiController } from "../ApiController";

const cache = {};

export const PlayerSearch = (props: { onSubmit: (value: string) => void }) => {
  const [value, setValue] = useState<PlayersSearchSingle | null>(null);
  const [options, setOptions] = useState<PlayersSearch>([]);
  const [inputValue, setInputValue] = useState("");

  const [timeoutFn, setTimeoutFn] =
    useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!inputValue) return;

    if (timeoutFn) clearTimeout(timeoutFn);
    setTimeoutFn(setTimeout(() => search(), 500));
  }, [inputValue]);

  useEffect(() => {
    if (value) {
      props.onSubmit(value.name);
      setValue(null);
    }
  }, [value]);

  const search = async () => {
    const searchValue = inputValue.trim();
    if (!searchValue) return;

    if (searchValue in cache) {
      // @ts-ignore
      setOptions(cache[searchValue]);
      return;
    }

    const results = await ApiController.search(searchValue);
    if (results.ok) {
      setOptions(results.val);

      // @ts-ignore
      cache[searchValue] = results.val;
    }
  };

  return (
    <Autocomplete
      fullWidth
      value={value}
      options={options}
      getOptionLabel={(option) => option && option.name}
      noOptionsText="Type player name ..."
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
          variant="standard"
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

import React from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import {Collateral} from "./Customer";


function SearchComponent(props: SearchProp) {
  const {selectedValue, setValue} = props;
  const defaultProps = {
    options: props.values
    ,
    getOptionLabel: (option: Collateral) => option.targetName,
  };


  return (
      <div>
        <Stack spacing={1} sx={{width: 400}}
               alignSelf={"center"}
               textAlign={"center"}
               alignContent={"center"}>
          <Autocomplete
              {...defaultProps}
              id="disable-close-on-select"
              disableCloseOnSelect
              renderInput={(params) => (
                  <TextField {...params} label="항목 입력" variant="standard"/>
              )}
              value={selectedValue}
              onChange={(event: any, newValue: Collateral | null) => {
                setValue(newValue);
              }}

          />

        </Stack>
      </div>
  );
}

interface SearchProp {
  values: Collateral[];
  selectedValue: Collateral | null;
  setValue: (value: Collateral | null) => void;
}


export default SearchComponent;
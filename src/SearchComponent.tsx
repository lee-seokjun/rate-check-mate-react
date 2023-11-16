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
      <Stack spacing={1} sx={{width: 300}}>
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

  );
}

interface SearchProp {
  values: Collateral[];
  selectedValue: Collateral | null;
  setValue  : (value: Collateral | null ) => void;
}


export default SearchComponent;

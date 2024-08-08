import React, {useEffect, useImperativeHandle, useState} from 'react';
import '../../App.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import {Collateral} from "./Customer";
import instance from "../config/AxiosModule";


const SearchComponent = React.forwardRef((props: SearchProp, ref) => {
  const {selectedValue, setValue, type} = props;
  const [values, setValues] = useState<Collateral[]>([]);
  const defaultProps = {
    options: values
    ,
    getOptionLabel: (option: Collateral) => option.targetName,
  };

  useEffect(() => {
    if (values.length == 0) {
      searchCollateral('')
      .then(r => setValues(r))
    }

  }, [type])

  const reset = () => {
    setValues([]);
  }

  useImperativeHandle(ref, () => ({
    reset
  }));

  const removeOnlyConsonantsOrVowels = (text: string) => {
    // 정규식 패턴: 자음 또는 모음
    const pattern = /[ㄱ-ㅎㅏ-ㅣ]/g;
    // 문자열에서 자음 또는 모음만 있는 부분을 제거
    const result = text.replace(pattern, '');
    return result;
  }
  const onChange = (e: any) => {
    const search = removeOnlyConsonantsOrVowels(e.target.value);
    searchCollateral(search)
    .then(r => setValues(r));
  }

  async function searchCollateral(search: string) { // async, await을 사용하는 경우
    try {
      // GET 요청은 params에 실어 보냄
      const response = await instance.get(`/collateral?targetType=${type}&search=${search}`);
      return response.data;
      // setValues(response.data);
    } catch (e) {
      // 실패 시 처리
    }
  }

  return (
      <div>
        <Stack spacing={1} sx={{width: 350}}
               alignSelf={"center"}
               textAlign={"center"}
               alignContent={"center"}>
          <Autocomplete
              {...defaultProps}
              id="disable-close-on-select"
              disableCloseOnSelect
              renderInput={(params) => (
                  <TextField {...params} label="검색할 항목을 입력해 주세요." variant="standard"
                             onChange={onChange}/>
              )}
              value={selectedValue}
              onChange={(event: any, newValue: Collateral | null) => {
                setValue(newValue);
              }}

          />

        </Stack>
      </div>
  );
});

interface SearchProp {
  type: string;
  selectedValue: Collateral | null;
  setValue: (value: Collateral | null) => void;
}

export interface searchReset {
  reset: () => void;
}

export default SearchComponent;
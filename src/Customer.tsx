import React, {useState} from 'react';
import './App.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import {Stack} from '@mui/material';
import TextField from '@material-ui/core/TextField';
import RateCalculator from "./RateCalculator";


function CustomerPage() {
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [value, setValue] = React.useState<Collateral | null>(null);
  const [maxLoan, setMaxLoan] = React.useState(0);

  const changeTarget = (target: Collateral | null) => {
    setValue(target);
  }

  const changeLocation = (event: any) => {
    setSelectedLocation(event.target.value);
  }
  return (
      <div style={{width: '100%'}}>
        <header>
          <Stack
              direction="column"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
              width={"100%"}
              marginTop={5}
          >
            <RateCalculator selectedValue={value}
                            setValue={changeTarget}
                            maxLoan={maxLoan}
                            setMaxLoan={setMaxLoan}

            />
            {maxLoan !== 0 &&
                <Box>Step2 금리 비교하기
                  <Stack spacing={1} sx={{width: 400}}>
                    <TextField style={{width: '380'}} label={"대출 금액"}/>
                    <TextField style={{width: '100%'}} label={"대출 기간"}/>
                    <Select
                        sx={{
                          width: 400,
                          height: 50,
                        }}
                        value={selectedLocation}
                        onChange={changeLocation}
                    >
                      <MenuItem key={'ALL'}
                                value={'ALL'}
                      >지점, 모바일</MenuItem>
                      <MenuItem key={'OFFICE'}
                                value={'OFFICE'}
                      >지점</MenuItem>
                      <MenuItem key={'MOBILE'}
                                value={'MOBILE'}
                      >모바일</MenuItem>
                    </Select>
                  </Stack>
                </Box>}

          </Stack>
        </header>
      </div>
  );
}


export interface Collateral {
  collateralKey: string;
  companyKey: string;
  targetType: string;
  targetName: string;
  code: string;
  substitutePrice: string;
  marginRequirement: string;
}

export default CustomerPage;

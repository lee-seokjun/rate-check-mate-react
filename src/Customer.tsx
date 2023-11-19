import React, {useState} from 'react';
import './App.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import {Stack} from '@mui/material';
import TextField from '@material-ui/core/TextField';
import RateCalculator from "./RateCalculator";
import {Button} from "@material-ui/core";
import SearchIcon from '@mui/icons-material/Search';
import instance from "./AxiosModule";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function CustomerPage() {
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [value, setValue] = React.useState<Collateral | null>(null);
  const [maxLoan, setMaxLoan] = React.useState(0);
  const [loanSize, setLoanSize] = React.useState(0);
  const [loanDay, setLoanDay] = React.useState(0);
  const [searchList, setSearchList] = React.useState<ResponseRateConditionList[]>([]);

  async function search() { // async, await을 사용하는 경우
    try {
      if (value != null) {
        const response = await instance.get(`/condition?size=${loanSize}&day=${loanDay}&targetCode=${value.code}&loanLocationType=${selectedLocation}`);
        console.log(response);
        setSearchList(response.data);
        console.log(searchList);
      }
    } catch (e) {
      // 실패 시 처리
    }
  }

  const changeTarget = (target: Collateral | null) => {
    setValue(target);
  }
  const reset = () => {
    setMaxLoan(0);
    setLoanSize(0);
    setLoanDay(0);
    setSearchList([]);
  }
  const changeLocation = (event: any) => {
    setSelectedLocation(event.target.value);
  }
  const changeLoanSize = (event: any) => {
    if (event.target.value > maxLoan) {
      return;
    }
    setLoanSize(event.target.value);
  }
  const changeLoanDay = (event: any) => {
    setLoanDay(event.target.value);
  }

  return (
      <div style={{width: '100%'}}>
        <header>

        </header>
        <body>
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
                          reset ={reset}

          />
          {maxLoan !== 0 && <>
            <Box>Step2 금리 비교하기
              <Stack spacing={1} sx={{width: 350}}>
                <TextField type={"number"} style={{width: '380'}} label={"대출 금액"}
                           value={loanSize} onChange={changeLoanSize}/>
                <TextField type={"number"} style={{width: '100%'}} label={"대출 기간 (일) "}
                           value={loanDay} onChange={changeLoanDay}/>
                <Select
                    sx={{
                      width: 350,
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
                  <MenuItem key={'ONLINE'}
                            value={'ONLINE'}
                  >온라인</MenuItem>
                </Select>
              </Stack>
              <Button
                  style={{
                    width: 350,
                    height: 50,
                    marginTop: 10
                  }}
                  color={'inherit'} variant={'outlined'}
                  onClick={search}>
                조회하기 <SearchIcon/></Button>

            </Box>
            <Box>
              <TableContainer component={Paper}>
                <Table sx={{width: 350}} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow sx={{width: 350}}>
                      <TableCell>증권사 </TableCell>
                      <TableCell align="right">금리</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchList.length > 0 &&
                        searchList.map((v, i) => <>
                          {v.list.map((v2, i2) =>
                              <TableRow
                                  key={v2.rateConditionKey}
                                  sx={{'&:last-child td, &:last-child th': {border: 0}, width: 400}}
                              >
                                <TableCell component="th">
                                  {v2.companyName} {v2.loanLocationType === 'ALL' ? '' : v2.loanLocationType === 'ONLINE' ? '(온라인)' : '(지점)'}
                                </TableCell>
                                <TableCell align="right">{v2.rate}%</TableCell>
                              </TableRow>
                          )}</>)
                    }

                  </TableBody>
                </Table>
              </TableContainer>

            </Box>
          </>}

        </Stack>


        </body>
      </div>
  );
}

export interface ResponseRateCondition {
  companyId: string;
  companyName: string;
  loanLocationType: string;
  rate: number;
  rateConditionKey: string;
  targetType: string;
}

interface ResponseRateConditionList {
  list: ResponseRateCondition[];
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

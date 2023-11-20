import React, {useState} from 'react';
import './App.css';
import {
  Select,
  MenuItem,
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField, styled
} from '@mui/material';
import RateCalculator from "./RateCalculator";
import SearchIcon from '@mui/icons-material/Search';
import instance from "./AxiosModule";

const UpBox = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
        setSearchList(response.data);
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
    if (event.target.value > Number( maxLoan)) {
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
          <UpBox>
            <Box><RateCalculator selectedValue={value}
                                 setValue={changeTarget}
                                 maxLoan={maxLoan}
                                 setMaxLoan={setMaxLoan}
                                 reset={reset}

            /></Box>
          </UpBox>
          {maxLoan !== 0 && <UpBox style={{marginTop: 50}}>
            <Box>Step2 금리 비교하기
              <Stack spacing={2} sx={{width: 350}}>
                <TextField type={"number"} sx={{
                  width: 350,
                }} label={"대출 금액"}
                           value={loanSize} onChange={changeLoanSize}/>
                <TextField type={"number"} sx={{
                  width: 350,
                }} label={"대출 기간 (일) "}
                           value={loanDay} onChange={changeLoanDay}/>
                <Select
                    sx={{
                      width: 350,
                      height: 40,
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
                    marginTop: 10
                  }}
                  color={'inherit'} variant={'outlined'}
                  onClick={search}>
                조회하기 <SearchIcon/></Button>
            </Box>
            <Box>
              <TableContainer component={Paper} style={{marginTop: 50}}>
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
            <br/>
          </UpBox>}

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
  targetType: string;
  targetName: string;
  code: string;
}

export default CustomerPage;

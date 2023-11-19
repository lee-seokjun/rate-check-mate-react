import React, {useState} from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import {Collateral} from "./Customer";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import SearchComponent from "./SearchComponent";
import instance from "./AxiosModule";


function RateCalculator(props: CalculatorProp) {
  function createCalculateParam(
      cnt : number,
      price : number,
      bondCnt : number
  ): CalculateParam {
    return {
      cnt,
      price,
      bondCnt,
    };
  }
  const [selectedType, setSelectedType] = useState('STOCK');
  const [cnt, setCnt] = useState(0);
  const [price, setPrice] = useState(0);
  const [bondCnt, setBondCnt] = useState(0);
  const [values, setValues] = useState<Collateral[]>([]);

  if (values.length === 0) {
    getConditionByCompany(selectedType);
  }

  async function getConditionByCompany(type: string) { // async, await을 사용하는 경우
    try {
      // GET 요청은 params에 실어 보냄
      const response = await instance.get('/collateral?targetType=' + type);
      setValues(response.data);
    } catch (e) {
      // 실패 시 처리
    }
  }
  async function calculate(params : CalculateParam) { // async, await을 사용하는 경우
    const param = `collateralKey=${props.selectedValue?.collateralKey}&cnt=${params.cnt}&price=${params.price}&bondCnt=${params.bondCnt}`;
    try {
      // GET 요청은 params에 실어 보냄

      const response = await instance.get('/collateral/calculate?' + param);
      props.setMaxLoan(response.data);
    } catch (e) {
      alert('계산 중 에러 발생 관리자에게 문의해 주세요 \n ' + param)
      // 실패 시 처리
    }
  }
  const changeTarget = (target: Collateral | null) => {
    props.setValue(target);
    reset();
  }
  const changeType = (event: any) => {
    reset();
    setSelectedType(event.target.value);
    getConditionByCompany(event.target.value);
    props.setValue(null);
  }
  const reset = () => {
    setCnt(0);
    setPrice(0);
    setBondCnt(0);
    props.setMaxLoan(0);
  }
  const changeCnt = (event: any) => {
    setCnt(event.target.value);
    if (event.target.value <= 0 || price <= 0 || props.selectedValue === null) {
      props.setMaxLoan(0);
    } else {
      calculate(createCalculateParam(event.target.value, price, bondCnt));
    }

  }
  const changePrice = (event: any) => {
    setPrice(event.target.value);
    if (event.target.value <= 0 || cnt <= 0 || props.selectedValue === null) {
      props.setMaxLoan(0);
    } else {
      calculate(createCalculateParam(cnt, event.target.value, bondCnt));
    }
  }

  const changeBondCnt = (event: any) => {
    setBondCnt(event.target.value);
    if (event.target.value <= 0 && props.selectedValue !== null) {
      props.setMaxLoan(0);
    } else {
      calculate(createCalculateParam(cnt, price, event.target.value));
    }
  }


  return (
      <Stack
          direction="column"
          justifyContent="flex-end"
          alignItems="center"
          spacing={2}
          width={"100%"}
          marginTop={5}
      >
        <Box>Step1 최대 금액 계산하기</Box>
        <Box>
          <Select
              sx={{
                width: 400,
                height: 50,
              }}
              value={selectedType}
              onChange={changeType}
          >
            <MenuItem key={'STOCK'}
                      value={'STOCK'}
            >주식</MenuItem>
            <MenuItem key={'BOND'}
                      value={'BOND'}
            >채권</MenuItem>
            <MenuItem key={'FUND'}
                      value={'FUND'}
            >펀드</MenuItem>

          </Select>
        </Box>
        <Box>
          <div style={{width: '100%'}}>
            {selectedType !== '' &&
                <SearchComponent values={values} selectedValue={props.selectedValue}
                                 setValue={changeTarget}/>}
          </div>
        </Box>
        {selectedType === 'BOND' ?
            <Box>
              <TextField sx={{
                width: 400,
                height: 50,
                marginTop: 5
              }} label={"채"} type="number" name={'bondCnt'} value={bondCnt}
                         onChange={changeBondCnt}/>
            </Box>
            : <div>
              <Box>
                <TextField sx={{
                  width: 400,
                  height: 50,
                  marginTop: 5
                }} label={"전일 종가"} type="number" name={'price'} value={price}
                           onChange={changePrice}/>
              </Box>
              <Box>
                <TextField sx={{
                  width: 400,
                  height: 50,
                  marginTop: 5
                }}
                           type="number"
                           label={"보유 주 수"} name={'cnt'} value={cnt} onChange={changeCnt}/>
              </Box>
            </div>
        }

        <Box>고객님의 최대 대출 가능 금액은 {props.maxLoan} 만원 입니다.</Box>
      </Stack>

  );
}

interface CalculatorProp {
  selectedValue: Collateral | null;
  setValue: (value: Collateral | null) => void;
  maxLoan: number;
  setMaxLoan: (value: number) => void;
}
interface CalculateParam {
  cnt : number;
  price : number;
  bondCnt : number;
}


export default RateCalculator;

import React, {useRef, useState} from 'react';
import './App.css';
import {Collateral} from "./Customer";
import SearchComponent, {searchReset} from "./SearchComponent";
import instance from "./AxiosModule";
import {TextField, Stack, MenuItem, Select, Box} from "@mui/material";

function RateCalculator(props: CalculatorProp) {
  function createCalculateParam(
      cnt: number,
      price: number,
      bondCnt: number
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

  const searchRef = useRef<searchReset | null>(null);

  async function calculate(params: CalculateParam) { // async, await을 사용하는 경우
    const param = `collateralKey=${props.selectedValue?.collateralKey}&cnt=${params.cnt}&price=${params.price}&bondCnt=${params.bondCnt}`;
    try {
      // GET 요청은 params에 실어 보냄
      const response = await instance.get('/collateral/calculate?' + param);
      props.setMaxLoan(response.data.toFixed(2));
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
    searchRef.current?.reset();
    props.setValue(null);
  }
  const reset = () => {
    setCnt(0);
    setPrice(0);
    setBondCnt(0);
    props.setMaxLoan(0);
    props.reset();
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
    if (event.target.value <= 0 || props.selectedValue === null) {
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
          spacing={1}
          width={"100%"}
      >
        <Box>Step1 최대 금액 계산하기</Box>
        <Box>
          <Select
              sx={{
                width: 350,
                height: 40,
              }}
              name={'selectedType'}
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
                <SearchComponent type={selectedType}
                                 selectedValue={props.selectedValue}
                                 setValue={changeTarget}
                    // values={values} setValues={setValues}
                                 ref={(ref: searchReset | null) => (searchRef.current = ref)}/>}
          </div>
        </Box>
        {props.selectedValue === null ? <></> : selectedType === 'BOND' ?
            <Box>
              <TextField sx={{
                width: 350,
                marginTop: 2
              }} label={"채"} type="number" name={'bondCnt'} value={bondCnt}
                         onChange={changeBondCnt}/>
            </Box>
            : <div>
              <Box>
                <TextField sx={{
                  width: 350,
                  marginTop: 2
                }} label={"전일 종가"} type="number" name={'price'} value={price}
                           onChange={changePrice}/>
              </Box>
              <Box>
                <TextField sx={{
                  width: 350,
                  height: 50,
                  marginTop: 2
                }}
                           type="number"
                           label={"보유 주 수"} name={'cnt'} value={cnt} onChange={changeCnt}/>
              </Box>
            </div>
        }
        {props.maxLoan !== 0 &&
            <Box style={{marginTop: 20}}> 고객님의 최대 대출 가능 금액은 {props.maxLoan} 만원 입니다.</Box>}
        <br/>
      </Stack>

  )
      ;
}

interface CalculatorProp {
  selectedValue: Collateral | null;
  setValue: (value: Collateral | null) => void;
  maxLoan: number;
  setMaxLoan: (value: number) => void;
  reset: () => void;
}

interface CalculateParam {
  cnt: number;
  price: number;
  bondCnt: number;
}


export default RateCalculator;

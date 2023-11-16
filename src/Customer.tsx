import React, {useState} from 'react';
import './App.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SearchComponent from "./SearchComponent";
import instance from "./AxiosModule";


function CustomerPage() {
  const [selectedType, setSelectedType] = useState('');
  const [values, setValues] = useState<Collateral[]>([]);
  const [value, setValue] = React.useState<Collateral | null>( null);
  async function getConditionByCompany(type :string) { // async, await을 사용하는 경우
    try {
      // GET 요청은 params에 실어 보냄
      const response = await instance.get('/collateral?targetType=' + type);
      setValues(response.data);
    } catch (e) {
      // 실패 시 처리
    }
  }
  const changeTarget = (target : Collateral | null) => {
    setValue(target);
  }
  const changeType = (event : any) => {
    setSelectedType(event.target.value);
    getConditionByCompany(event.target.value);
    setValue(null);
  }

  return (
      <div className="App">
        <header>


        </header>
        <body>
        <Select
            sx={{
              width: 200,
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
        {selectedType !== '' && <SearchComponent values={values} selectedValue = {value} setValue={changeTarget}/>}
        </body>
      </div>
  )
      ;
}


export interface Collateral {
  collateralKey : string;
  companyKey: string;
  targetType: string;
  targetName: string;
  code: string;
  substitutePrice: string;
  marginRequirement: string;
}

export default CustomerPage;

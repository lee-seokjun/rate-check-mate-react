import React, {useState} from 'react';
import './App.css';
import axios from "axios";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Company from './App';
import EnhancedTable from "./TableComponent";


function AdminPage(props: AdminPageProps) {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [val, setVal] = useState<Condition[]>([]);

  async function getConditionByCompany(id: string) { // async, await을 사용하는 경우
    try {
      // GET 요청은 params에 실어 보냄
      const response = await axios.get('http://localhost:8080/condition/company/' + id);
      console.log(response.data);
      setVal(response.data);

    } catch (e) {
      // 실패 시 처리
      console.error(e);
    }
  }

  const changeCompany = (e: any): void => {
    setSelectedCompany(e.target.value);
    getConditionByCompany(e.target.value);
  }

  return (
      <div className="App">
        <header>
        </header>
        <div>

          <Select
              sx={{
                width: 200,
                height: 50,
              }}
              value={selectedCompany}
              onChange={changeCompany}
          >
            {
              props.companies.map((com) => (
                  <MenuItem key={com.securitiesCompanyKey}
                            value={com.securitiesCompanyKey || ''}
                  >{com.companyName}</MenuItem>))
            }
          </Select>
          <br/>
          {val && <EnhancedTable conditions={val}/>}
        </div>

      </div>
  );
}

interface Company {
  securitiesCompanyKey: string,
  companyName: string,
  availableKey: string

}

export interface Condition {
  rateConditionKey: string,
  companyId: string,
  companyName: string
  loanLocationType: string
  targetType: string
  minPeriod: number
  maxPeriod: number
  minSize: number
  maxSize: number
  rates: RateByGrade []

}

interface RateByGrade {
  grade: string,
  rate: number
}

interface AdminPageProps {
  companies: Company[]

}

export default AdminPage;

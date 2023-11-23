import React, {useState} from 'react';
import '../../App.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Company from '../../App';
import EnhancedTable, {Data} from "./TableComponent";
import instance from "../config/AxiosModule";

function createData(
    rateConditionKey: string,
    targetType: string,
    loanLocationType: string,
    loanPeriodMin: number,
    loanPeriodMax: number,
    loanSizeMin: number,
    loanSizeMax: number,
    standard: number,
    preferred: number,
    priority: number,
    topPriority: number,
): Data {
  return {
    rateConditionKey,
    targetType,
    loanLocationType,
    loanPeriodMin,
    loanPeriodMax,
    loanSizeMin,
    loanSizeMax,
    standard,
    preferred,
    priority,
    topPriority
  };
}

function AdminPage() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [val, setVal] = useState<Data[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isInit, setInit] = useState(false);

  async function getCompany() {
    try {
      if (!isInit) {
        const response = await instance.get('/company');
        setCompanies(response.data);
        setInit(true);
      }
    } catch (e) {
      // 실패 시 처리
      console.error(e);
    }
  }

  getCompany();

  async function getConditionByCompany(id: string) { // async, await을 사용하는 경우
    try {
      // GET 요청은 params에 실어 보냄
      const response = await instance.get('/condition/company/' + id);
      const conditions: Condition[] = response.data
      const initArr: Data[] = [];
      conditions.forEach(con => {
        const grade: GradeType = {STANDARD: 0, PREFERRED: 0, PRIORITY: 0, TOP_PRIORITY: 0};
        // @ts-ignore
        con.rates.forEach(rate => grade[rate.grade] = rate.rate)
        initArr.push(
            createData(
                con.rateConditionKey, con.targetType, con.loanLocationType,
                con.minPeriod, con.maxPeriod, con.minSize, con.maxSize,
                grade.STANDARD,
                grade.PREFERRED,
                grade.PRIORITY,
                grade.TOP_PRIORITY)
        )

      })
      setVal(initArr);

    } catch (e) {
      // 실패 시 처리
    }
  }

  async function register(dataArray: Data[]) { // async, await을 사용하는 경우
    try {
      // GET 요청은 params에 실어 보냄
      const registerArr: any[] = [];
      const companyId: string = selectedCompany;
      dataArray.forEach(d => {
        registerArr.push(
            {
              "companyId": companyId,
              "targetType": d.targetType,
              "loanLocationType": d.loanLocationType,
              "loanPeriod": {
                "minDay": d.loanPeriodMin,
                "maxDay": d.loanPeriodMax
              },
              "loanSize": {
                "minSize": d.loanSizeMin,
                "maxSize": d.loanSizeMax
              },
              "rates": [
                {"grade": "STANDARD", "rate": d.standard},
                {"grade": "PREFERRED", "rate": d.preferred},
                {"grade": "PRIORITY", "rate": d.priority},
                {"grade": "TOP_PRIORITY", "rate": d.topPriority},

              ]
            }
        )
      })
      if (dataArray.length === 0) {
        registerArr.push(
            {
              "companyId": companyId,
              "targetType": "STOCK",
              "loanLocationType": "ALL",
              "loanPeriod": {
                "minDay": -1,
                "maxDay": -1
              },
              "loanSize": {
                "minSize": -1,
                "maxSize": -1
              },
              "rates": [
                {"grade": "STANDARD", "rate": 0},
                {"grade": "PREFERRED", "rate": 0},
                {"grade": "PRIORITY", "rate": 0},
                {"grade": "TOP_PRIORITY", "rate": 0},

              ]
            }
        )
      }
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/condition',
        headers: {
          'Content-Type': 'application/json'
        },
        data: registerArr
      };
      await instance.request(config).then(() => getConditionByCompany(selectedCompany));

    } catch (e) {
      // 실패 시 처리
      console.error(e);
    }
  }

  async function update(dataArray: Data[]) { // async, await을 사용하는 경우
    try {
      // GET 요청은 params에 실어 보냄
      if (dataArray.length === 0) {
        return;
      }
      const registerArr: any[] = [];
      dataArray.forEach(d => {
        registerArr.push(
            {
              "conditionKey": d.rateConditionKey,
              "targetType": d.targetType,
              "loanLocationType": d.loanLocationType,
              "loanPeriod": {
                "minDay": d.loanPeriodMin,
                "maxDay": d.loanPeriodMax
              },
              "loanSize": {
                "minSize": d.loanSizeMin,
                "maxSize": d.loanSizeMax
              },
              "rates": [
                {"grade": "STANDARD", "rate": d.standard},
                {"grade": "PREFERRED", "rate": d.preferred},
                {"grade": "PRIORITY", "rate": d.priority},
                {"grade": "TOP_PRIORITY", "rate": d.topPriority},

              ]
            }
        )
      })

      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: '/condition',
        headers: {
          'Content-Type': 'application/json'
        },
        data: registerArr
      };
      await instance.request(config).then(() => getConditionByCompany(selectedCompany));

    } catch (e) {
      // 실패 시 처리
      console.error(e);
    }
  }

  async function remove(key: string) {
    try {

      let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: '/condition/' + key
      };
      await instance.request(config).then(() => getConditionByCompany(selectedCompany));

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
              companies.map((com) => (
                  <MenuItem key={com.securitiesCompanyKey}
                            value={com.securitiesCompanyKey || ''}
                  >{com.companyName}</MenuItem>))
            }
          </Select>
          <br/>
          {val && <EnhancedTable data={val} setData={setVal} register={register} remove={remove}
                                 update={update}
                                 companyId={selectedCompany}/>}
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

export interface GradeType {
  STANDARD: number,
  PREFERRED: number,
  PRIORITY: number,
  TOP_PRIORITY: number
}


export default AdminPage;

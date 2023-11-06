import React, {useState} from 'react';
import './App.css';
import {BrowserRouter, Routes} from 'react-router-dom';
import {Route} from 'react-router';
import {Button} from "@mui/material";
import axios from "axios";
import AdminPage from './Admin';

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isInit, setInit] = useState(false);

  async function getCompany() { // async, await을 사용하는 경우
    try {
      if (!isInit) {
        const response = await axios.get('http://localhost:8080/company');
        setCompanies(response.data);
        setInit(true);
      }

    } catch (e) {
      // 실패 시 처리
      console.error(e);
    }
  }

  getCompany();

  return (
      <BrowserRouter>
        <div className="App">
          <header>
          </header>
          <Routes>
            <Route path={"/"} element={
                companies&&
              <AdminPage companies={companies}/>
            }/>
            <Route path={"/test1"} element={<Button variant={"contained"}>test1</Button>}/>
            {/*<Route path={"/test2"} element={<AdminPage/>}/>*/}
          </Routes>

        </div>
      </BrowserRouter>
  );
}

interface Company {
  securitiesCompanyKey: string,
  companyName: string,
  availableKey: string

}

export default App;

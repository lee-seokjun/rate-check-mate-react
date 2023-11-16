import React, {useState} from 'react';
import './App.css';
import {BrowserRouter, Routes} from 'react-router-dom';
import {Route} from 'react-router';
import AdminPage from './Admin';
import CustomerPage from "./Customer";
import instance from "./AxiosModule";

function App() {
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

  return (
      <BrowserRouter>
        <div className="App">
          <header>
          </header>
          <Routes>
            <Route path={"/"} element={
                companies &&
                <AdminPage companies={companies}/>
            }/>
            <Route path={"/customer"} element={<CustomerPage/>}/>
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

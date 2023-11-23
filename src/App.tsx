import React from 'react';
import './App.css';
import {BrowserRouter, Routes} from 'react-router-dom';
import {Route} from 'react-router';
import AdminPage from './pages/admin/Admin';
import CustomerPage from "./pages/customer/Customer";

function App() {


  return (
      <BrowserRouter>
        <div className="App">
          <header>
          </header>
          <Routes>
            <Route path={"/admin/rateCondition"} element={
              <AdminPage/>
            }/>
            <Route path={"/customer"} element={<CustomerPage/>}/>
          </Routes>

        </div>
      </BrowserRouter>
  );
}


export default App;

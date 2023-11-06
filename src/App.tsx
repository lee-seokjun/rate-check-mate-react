import React from 'react';
import './App.css';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Route } from 'react-router';
import {Button} from "@mui/material";

function App() {
  return (
      <BrowserRouter>
        <div className="App">
          <header >
          </header>
          <Routes>
            <Route path={"/"} element={<h2>root</h2>}/>
            <Route path={"/test1"} element={<Button variant={"contained"}>test1</Button>}/>
            <Route path={"/test2"} element={<>test2</>}/>
          </Routes>

        </div>
      </BrowserRouter>
  );
}

export default App;

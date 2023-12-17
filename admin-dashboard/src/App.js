import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import AdminLoginPage from "./AdminLoginPage";
import AdminPage from "./AdminPage";


function App(props){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/todaysmeal" element={<MainPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-page" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

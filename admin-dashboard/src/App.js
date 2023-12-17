import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import AdminLoginPage from "./AdminLoginPage";
import AdminPage from "./AdminPage";
import RecipeManage from "./RecipeManage";
import AiManage from "./AiManage";

function App(props){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/todaysmeal" element={<MainPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-page" element={<AdminPage />} />
        <Route path="/admin-recipe" element={<RecipeManage />} />
        <Route path="/admin-ai" element={<AiManage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

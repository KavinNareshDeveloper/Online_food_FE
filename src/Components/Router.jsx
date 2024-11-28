import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react'
import Home from "./Home";
import Header from "./Header";
import FilterPage from "./FilterPage";
import DetailPage from "./Detailpage";


const Router = () => {
    return (
        <div>
            <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/filter" element={<FilterPage/>}/>
                <Route path="/detail" element={<DetailPage/>}/>
            </Routes>
            </BrowserRouter>

        </div>
    )
}

export default Router;
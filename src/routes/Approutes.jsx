import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from '../pages/register';
import Login from '../pages/login'
import Home from '../pages/Home'

const Approutes = () => {
  return (

 <Router>
    <Routes>

        <Route path="/" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/home" element={<Home/>} />





    </Routes>



 </Router>

    
 
  )
}

export default Approutes
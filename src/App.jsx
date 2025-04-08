import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './IndexComponent/Indexxx';
import RegisterPage from './UserCredentials/Register_page';
import LoginPage from './UserCredentials/Login_page';
import MainDashboard from './Main Mech Component/Dashboard';
// import Register from './fakeregister/Regisrer';
// import Login from './fakeregister/login';

import CoreLookupTable from './serverpractice/CoreLookUp';



function App() {
  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/registerpage" element={<RegisterPage/>}/>
            <Route path="/loginbilling" element={<LoginPage/>}/>
            {/* <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/> */}
            <Route path="/corelookup" element={<CoreLookupTable/>}/>
            <Route path="/dashboardbilling" element={<MainDashboard/>}/>
          </Routes>
        </Router>
      
    </>
  )
}

export default App;

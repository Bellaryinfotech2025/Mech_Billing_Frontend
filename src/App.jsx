import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './IndexComponent/Indexxx';
import RegisterPage from './UserCredentials/Register_page';
import LoginPage from './UserCredentials/Login_page';
import MainDashboard from './Main Mech Component/Dashboard';


function App() {
  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/registerpage" element={<RegisterPage/>}/>
            <Route path="/loginbilling" element={<LoginPage/>}/>
            <Route path="/dashboardbilling" element={<MainDashboard/>}/>
             


          </Routes>
        </Router>
      
    </>
  )
}

export default App;

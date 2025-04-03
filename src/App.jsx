import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './IndexComponent/Indexxx';
import MainDashboard from './Main Mech Component/Dashboard';

function App() {
  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/dashboardbilling" element={<MainDashboard/>}/>
          </Routes>
        </Router>
      
    </>
  )
}

export default App;

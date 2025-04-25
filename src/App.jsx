import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './IndexComponent/Indexxx';
import RegisterPage from './UserCredentials/Register_page';
import LoginPage from './UserCredentials/Login_page';
import MainDashboard from './Main Mech Component/Dashboard';
// import Register from './fakeregister/Regisrer';
// import Login from './fakeregister/login';

 

import OrderForm from './orderpractice/orderpracticedetails';

import BillingFrequencyForm from './orderpractice/billing_frequency';


import LookupTablePractice from './lookuppractice/lookuptablepractice';


// import OrderDatabaseSearch from './Main Mech Component/OrderDatabaseSearch';



//  import SidebarProfile from './Profile Component/Sidebar';

//  import CreateProfile from './Profile Component/CreateAccount';
//  import EditProfile from './Profile Component/EditProfile';

//  import Profiler from './Profile Component/Profilepage';



import Fake from './lookuppractice/FakeOrder';

import AccountCreation from './Profile Component/CreateAccount';

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
            {/* <Route path="/corelookup" element={<CoreLookupTable/>}/> */}

            <Route path="/orderdetails" element={<OrderForm/>}/>

            <Route path="/billingfrequency" element={<BillingFrequencyForm/>}/>

            <Route path="/lookuppractice" element={<LookupTablePractice/>}/>

            {/* <Route path="/orderdatabasesearch" element={<OrderDatabaseSearch/>}/> */}
{/* 
              <Route path="/user" element={<SidebarProfile/>}/>
              <Route path="/create-account" element={<CreateProfile/>}/>
              <Route path="/edit-profile" element={<EditProfile/>}/>
              <Route path="/ppp" element={<Profiler/>}/> */}



              <Route path="/fake" element={<Fake/>}/>

              <Route path="/signin" element={<AccountCreation/>}/>



            <Route path="/dashboardbilling" element={<MainDashboard/>}/>
          </Routes>
        </Router>
      
    </>
  )
}

export default App;

import React, { useContext, useEffect, useState } from 'react'
import SignInPage from './pages/SignInPage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import { UserContext } from './context/userContext';

const App = () => {

  const { user } = useContext(UserContext)

  useEffect(()=>{
    const token = localStorage.getItem('token')
  },[])

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={user? <Navigate to='/dashboard'/> : <SignInPage />} />
        <Route path="/dashboard/*" element={user ? <DashboardPage /> : <Navigate to='/signin'/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};


export default App

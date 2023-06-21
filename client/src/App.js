import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/homepage/homePage';
import LoginPage from './pages/login/loginPage';
import SearchPage from './pages/search/searchPage';
import { useSelector } from 'react-redux';

import Menu from './components/nav/navBar';

const App = () => {
  const userId = useSelector(state => state.login.id);

  console.log(userId);

  return (
    <BrowserRouter>
    <Menu />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            userId ? <HomePage /> : <Navigate to="/login" replace={true} />
          }
        />
        <Route
          path="/search"
          element={
            userId ? <SearchPage /> : <Navigate to="/login" replace={true} />
          }
        />
        <Route path="/*" element={<Navigate to="/login" replace={true} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
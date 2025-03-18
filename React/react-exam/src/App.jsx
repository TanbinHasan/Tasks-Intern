import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import './App.css';
import React from 'react';
import LogIn from './components/LogIn';
import { UserProvider } from './contexts/UserContext';
import Register from './components/Register';
import Feed from './components/Feed';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/feed" element={<Feed/>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
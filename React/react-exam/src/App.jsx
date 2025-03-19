import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import './App.css';
import React from 'react';
import LogIn from './components/LogIn';
import { UserProvider } from './contexts/UserContext';
import Register from './components/Register';
import Feed from './components/Feed';
import { PostProvider } from './contexts/PostContext';

function App() {
  return (
    <UserProvider>
      <PostProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/feed" element={<Feed/>} />
          </Routes>
        </BrowserRouter>
      </PostProvider>
    </UserProvider>
  );
}

export default App;
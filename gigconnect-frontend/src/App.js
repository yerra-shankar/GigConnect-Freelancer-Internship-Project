// App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Alert from './components/common/Alert';
import Loading from './components/common/Loading';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import GigsPage from './pages/GigsPage';
import MessagesPage from './pages/MessagesPage';
import AdminPage from './pages/AdminPage';

import { useAppContext } from './context/AppContext';

function App() {
  const { loading } = useAppContext();

  return (
    <div className="App">
      <Navbar />
      <Alert />
      {loading && <Loading />}
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/gigs" element={<GigsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/admin" element={<AdminPage />} />
  
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/layout/header.jsx';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import VehicleProfile from './pages/VehicleProfile';
import PartSearch from './pages/PartSearch';
import PartDetails from './pages/PartDetails';
import Checkout from './pages/Checkout';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register';
import { AuthProvider } from './pages/Auth/AuthContext';
import './styles/global.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vehicle-profile" element={<VehicleProfile />} />
              <Route path="/search" element={<PartSearch />} />
              <Route path="/parts/:partId" element={<PartDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
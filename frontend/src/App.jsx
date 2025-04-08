import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AddListingPage from './pages/AddListingPage';
import { AuthProvider } from './contexts/AuthContext';
import RoommatesPage from './pages/RoommatesPage';
import ApartmentsPage from './pages/ApartmentsPage';
import FAQPage from './pages/Help';
import ProfilePage from './pages/ProfilePage';
import ProfileIDPage from './pages/ProfileIDPage'
import AncetaPage from './pages/AncetaPage';
import MLQPage from './pages/MLQPage';
import useAuthCheck from './hooks/AuthCheck';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import NotFoundPage from './pages/NotFoundPage';
import ApartmentDetailsPage from './pages/ApartmentDetailsPage';


import './index.css';
import './styles/navbar.css';
import './styles/HomePage.css';
import './styles/ListingPage.css';
import './styles/LoginRegister.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthCheckWrapper />
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listing/:id" element={<ListingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/add-listing" element={<AddListingPage />} />
            <Route path="/roommates" element={<RoommatesPage />} />
            <Route path="/apartments" element={<ApartmentsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfileIDPage />} />
            <Route path="/anceta-page" element={<AncetaPage />} />
            <Route path="/*" element={<NotFoundPage />} />
            <Route path="/ml-questions" element={<MLQPage />} />
            <Route path="teams" element={<Teams />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            <Route path="/apartments/:id" element={<ApartmentDetailsPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

function AuthCheckWrapper() {
  useAuthCheck();
  return null;
}

export default App;

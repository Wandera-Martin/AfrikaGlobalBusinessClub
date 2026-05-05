import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { apiLogout } from './services/authApi';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import ServicesPage from './pages/ServicesPage';
import EventsPage from './pages/EventsPage';
import MessagesPage from './pages/MessagesPage';
import NetworkPage from './pages/NetworkPage';
import OnboardingPage from './pages/Onboarding';
import { fetchBusinessProfile } from './services/businessApi';
import ProtectedLayout from './components/Navigation/ProtectedLayout';

// ─── PROTECTED ROUTE ─────────────────────────────────────────────────────────
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const token = localStorage.getItem('access_token');
  return token ? element : <Navigate to="/login" replace />;
};

// ─── ROUTING WRAPPERS ────────────────────────────────────────────────────────
const LandingWrapper: React.FC = () => {
  const navigate = useNavigate();
  return <LandingPage onRegister={() => navigate('/register')} onLogin={() => navigate('/login')} />;
};

const RegisterWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <RegisterPage
      onBack={() => navigate('/login')}
      onVerifySuccess={() => navigate('/dashboard')}
    />
  );
};

const LoginWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <LoginPage
      onRegister={() => navigate('/register')}
      onLoginSuccess={() => navigate('/dashboard')}
      onHome={() => navigate('/')}
    />
  );
};

// ─── MAIN APP ROUTING LAYER ──────────────────────────────────────────────────
const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingWrapper />} />
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/register" element={<RegisterWrapper />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/onboarding" element={<ProtectedRoute element={<OnboardingPage />} />} />
          
          <Route element={<ProtectedRoute element={<ProtectedLayout />} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

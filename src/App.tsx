import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AccountSettings } from './components/UserProfile/AccountSettings';
import { MainLayout } from './components/Layout/MainLayout';
import { UserDashboard } from './components/Dashboard/UserDashboard';
import { AgentDetail } from './components/Agent/AgentDetail';
import { AgentList } from './components/Agents/AgentList';
import { useAgentStore } from './store/agentStore';
import { useLoadingToast } from './hooks/useLoadingToast';

function App() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { loadAgents } = useAgentStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoadingToast();
	const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

	const handleToggleAuthMode = () => {
  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
};
  useEffect(() => {
    const fetchAgents = async () => {
      showLoading('Loading agents...');
      try {
        if (user) {
          await loadAgents(user.id);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        hideLoading();
      }
    };

    fetchAgents();
  }, [user, loadAgents, showLoading, hideLoading]);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <UserDashboard />
          </MainLayout>
        }
      />
			<Route path="/auth" element={<AuthForm mode={authMode} onToggleMode={handleToggleAuthMode} />} />
      <Route path="/agent" element={<AgentList />} />
      <Route path="/agent/:agentId" element={<AgentDetail />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/settings" element={<AccountSettings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

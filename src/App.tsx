
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AccountSettingsContainer } from './components/UserProfile/AccountSettings/AccountSettingsContainer';
import { MainLayout } from './components/Layout/MainLayout';
import { UserDashboard } from './components/Dashboard/UserDashboard';
import { AgentDetail } from './components/Agent/AgentDetail';
import { AgentList } from './components/Agents/AgentList';
import { SubscriptionPage } from './components/Subscription/SubscriptionPage';
import { ModernLandingPage } from './components/Landing/ModernLandingPage';
import { PlanSelector } from './components/Subscription/Plans/PlanSelector';
import { AnalyticsDashboard } from './components/RealTime/Dashboard/AnalyticsDashboard';
import { ChatInterface } from './components/RealTime/Chat/ChatInterface';

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');

  const handleToggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<ModernLandingPage />} />
      <Route path="/plans" element={<PlanSelector />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/auth" element={<AuthForm mode={authMode} onToggleMode={handleToggleAuthMode} />} />

      {/* Authenticated Routes */}
      <Route
        path="/user"
        element={
          <PrivateRoute>
            <MainLayout>
              <UserDashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <MainLayout>
              <AnalyticsDashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <MainLayout>
              <ChatInterface />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/agent"
        element={
          <PrivateRoute>
            <MainLayout>
              <AgentList />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/agent/:agentId"
        element={
          <PrivateRoute>
            <MainLayout>
              <AgentDetail />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <MainLayout>
              <AccountSettingsContainer />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Redirect all other routes to the homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
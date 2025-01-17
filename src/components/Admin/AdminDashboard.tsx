import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Users, Settings, Database, CreditCard } from 'lucide-react';
import { UserList } from './UserList';
import { Analytics } from './Analytics';
import { User } from '../../types/auth';
import { FirebaseConfigTab } from './FirebaseConfigTab';
import { PaymentGatewaysTab } from './PaymentGatewaysTab';
import { APIKeysSection } from './APIKeysSection';
import { getAllUsers } from '../../services/firestore/users';
import { useLoadingToast } from '../../hooks/useLoadingToast';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('users');
  const { showLoading, hideLoading } = useLoadingToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify admin access
    if (!user || user.role !== 'admin') {
      navigate('/user');
      return;
    }

    const fetchUsers = async () => {
      showLoading('Loading users...');
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        hideLoading();
      }
    };
    fetchUsers();
  }, [showLoading, hideLoading, user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex gap-2 p-1 mb-6">
          <TabsTrigger value="users" className="tab-trigger">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="analytics" className="tab-trigger">
            <Settings className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="firebase" className="tab-trigger">
            <Database className="w-4 h-4" />
            Firebase Config
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="tab-trigger">
            <Database className="w-4 h-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="payment-gateway" className="tab-trigger">
            <CreditCard className="w-4 h-4" />
            Payment Gateway
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserList users={users} onUserUpdate={() => {}} />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics users={users} />
        </TabsContent>

        <TabsContent value="firebase">
          <FirebaseConfigTab />
        </TabsContent>

        <TabsContent value="api-keys">
          <APIKeysSection />
        </TabsContent>

        <TabsContent value="payment-gateway">
          <PaymentGatewaysTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Users, Settings, Database, CreditCard, BarChart2, Globe } from 'lucide-react';
import { UserList } from './UserList';
import { User } from '../../types/auth';
import { FirebaseConfigTab } from './FirebaseConfigTab';
import { PaymentGatewaysTab } from './PaymentGatewaysTab';
import { APIKeysSection } from './APIKeysSection';
import { getUsersWithSubscriptions } from '../../services/firestore/users';
import { useLoadingToast } from '../../hooks/useLoadingToast';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getPaymentStats } from '../../services/admin/paymentStats';
import { RealTimeStats } from './RealTimeStats';
import { PaymentAnalytics } from './PaymentAnalytics';
import { GlobalStats } from './GlobalStats';

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [paymentStats, setPaymentStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('users');
  const { showLoading, hideLoading } = useLoadingToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadPaymentStats = useCallback(async () => {
    try {
      const stats = await getPaymentStats();
      setPaymentStats(stats);
    } catch (error) {
      console.error('Error loading payment stats:', error);
    }
  }, []);

  useEffect(() => {
    // Verify admin access
    if (!user || user.role !== 'admin') {
      navigate('/user');
      return;
    }

    const fetchUsers = async () => {
      showLoading('Loading users...');
      try {
        const [usersData, stats] = await Promise.all([
          getUsersWithSubscriptions(),
          getPaymentStats()
        ]);
        setUsers(usersData);
        setPaymentStats(stats);
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
      <GlobalStats users={users} paymentStats={paymentStats} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex gap-2 p-1 mb-6">
          <TabsTrigger value="users" className="tab-trigger">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="realtime" className="tab-trigger">
            <BarChart2 className="w-4 h-4" />
            Real-Time
          </TabsTrigger>
          <TabsTrigger value="analytics" className="tab-trigger">
            <Globe className="w-4 h-4" />
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
        
        <TabsContent value="realtime">
          <RealTimeStats users={users} />
        </TabsContent>

        <TabsContent value="analytics">
          <PaymentAnalytics stats={paymentStats} />
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
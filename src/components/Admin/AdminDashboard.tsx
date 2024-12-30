import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Users, Settings, Database } from 'lucide-react';
import { UserList } from './UserList';
import { Analytics } from './Analytics';
import { User } from '../../types/auth';
import { FirebaseConfigTab } from './FirebaseConfigTab';
import { getAllUsers } from '../../services/firestore/users';
import { useLoadingToast } from '../../hooks/useLoadingToast';

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('users');
  const { showLoading, hideLoading } = useLoadingToast();

  useEffect(() => {
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
  }, [showLoading, hideLoading]);

  return (
    <div className="space-y-8">
      {users.length === 0 && (
        <div className="text-center text-gray-500">Loading users...</div>
      )}
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
      </Tabs>
    </div>
  );
}

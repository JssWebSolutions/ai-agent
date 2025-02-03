import { Users, CreditCard, TrendingUp, DollarSign } from 'lucide-react';
import { User } from '../../types/auth';
import { formatCurrency } from '../../utils/formatters';

interface GlobalStatsProps {
  users: User[];
  paymentStats: any;
}

export function GlobalStats({ users, paymentStats }: GlobalStatsProps) {
  const activeUsers = users.filter(user => user.subscription?.status === 'active').length;
  const totalRevenue = paymentStats?.totalRevenue || 0;
  const monthlyRevenue = paymentStats?.monthlyRevenue || 0;
  const subscriptionGrowth = paymentStats?.subscriptionGrowth || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold mt-1">{users.length}</p>
            <p className="text-sm text-gray-500 mt-1">
              {activeUsers} active subscriptions
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-gray-500 mt-1">
              Lifetime earnings
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(monthlyRevenue)}</p>
            <p className="text-sm text-gray-500 mt-1">
              Current month
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <CreditCard className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Growth Rate</p>
            <p className="text-2xl font-bold mt-1">{subscriptionGrowth}%</p>
            <p className="text-sm text-gray-500 mt-1">
              vs last month
            </p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
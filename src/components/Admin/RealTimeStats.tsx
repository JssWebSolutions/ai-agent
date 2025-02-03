import { useState, useEffect } from 'react';
import { User } from '../../types/auth';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, MessageSquare } from 'lucide-react';
import { onSnapshot, collection, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface RealTimeStatsProps {
  users: User[];
}

export function RealTimeStats({ users }: RealTimeStatsProps) {
  const [activeUsers, setActiveUsers] = useState(0);
  const [messageRate, setMessageRate] = useState(0);
  const [errorRate, setErrorRate] = useState(0);
  const [messageData, setMessageData] = useState<any[]>([]);
  const [userDistribution, setUserDistribution] = useState<any[]>([]);

  useEffect(() => {
    // Track active users (users who have logged in within the last 5 minutes)
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
    
    const usersRef = collection(db, 'users');
    const activeUsersQuery = query(
      usersRef,
      where('lastLogin', '>=', Timestamp.fromDate(fiveMinutesAgo))
    );

    const unsubscribeUsers = onSnapshot(activeUsersQuery, (snapshot) => {
      setActiveUsers(snapshot.size);
    });

    // Track message rate (messages in the last minute)
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const agentsRef = collection(db, 'agents');
    
    const unsubscribeMessages = onSnapshot(agentsRef, (snapshot) => {
      let totalMessages = 0;
      let errorCount = 0;
      
      snapshot.docs.forEach(doc => {
        const interactions = doc.data().analytics?.interactions || [];
        const recentInteractions = interactions.filter((int: any) => {
          const timestamp = int.timestamp?.toDate();
          return timestamp && timestamp >= oneMinuteAgo;
        });
        
        totalMessages += recentInteractions.length;
        errorCount += recentInteractions.filter((int: any) => !int.successful).length;
      });
      
      setMessageRate(totalMessages);
      setErrorRate(totalMessages > 0 ? (errorCount / totalMessages) * 100 : 0);
    });

    // Track message volume over time
    const unsubscribeMessageData = onSnapshot(agentsRef, (snapshot) => {
      const hourlyData: Record<string, number> = {};
      
      snapshot.docs.forEach(doc => {
        const interactions = doc.data().analytics?.interactions || [];
        interactions.forEach((int: any) => {
          const hour = int.timestamp?.toDate().getHours();
          if (hour !== undefined) {
            hourlyData[hour] = (hourlyData[hour] || 0) + 1;
          }
        });
      });

      const data = Object.entries(hourlyData)
        .map(([hour, count]) => ({
          hour: `${hour}:00`,
          messages: count
        }))
        .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

      setMessageData(data);
    });

    // Track user distribution by subscription type
    const unsubscribeUserDist = onSnapshot(usersRef, (snapshot) => {
      const distribution: Record<string, number> = {};
      
      snapshot.docs.forEach(doc => {
        const planId = doc.data().subscription?.planId || 'free';
        distribution[planId] = (distribution[planId] || 0) + 1;
      });

      const data = Object.entries(distribution).map(([plan, count]) => ({
        plan: plan.replace('plan_', '').toUpperCase(),
        users: count
      }));

      setUserDistribution(data);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeMessages();
      unsubscribeMessageData();
      unsubscribeUserDist();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Users</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{activeUsers}</p>
          <p className="text-sm text-gray-500 mt-2">Currently online</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Message Rate</h3>
            <MessageSquare className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">{messageRate}/min</p>
          <p className="text-sm text-gray-500 mt-2">Messages per minute</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Error Rate</h3>
            <Activity className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold">{errorRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-500 mt-2">Failed requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Message Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="messages" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
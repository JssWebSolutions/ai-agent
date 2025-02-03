import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

export async function getPaymentStats() {
  try {
    const now = Timestamp.now();
    const thirtyDaysAgo = Timestamp.fromMillis(now.toMillis() - 30 * 24 * 60 * 60 * 1000);

    // Get all transactions from the last 30 days
    const transactionsRef = collection(db, 'transactions');
    const recentTransactionsQuery = query(
      transactionsRef,
      where('createdAt', '>=', thirtyDaysAgo)
    );

    const transactionsSnapshot = await getDocs(recentTransactionsQuery);
    const transactions = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate revenue metrics
    const totalRevenue = transactions.reduce((sum, tx: any) => sum + (tx.amount || 0), 0);
    const monthlyRevenue = transactions
      .filter((tx: any) => tx.createdAt >= thirtyDaysAgo)
      .reduce((sum, tx: any) => sum + (tx.amount || 0), 0);

    // Calculate subscription metrics
    const subscriptionsRef = collection(db, 'subscriptions');
    const activeSubscriptionsQuery = query(
      subscriptionsRef,
      where('status', '==', 'active')
    );
    const subscriptionsSnapshot = await getDocs(activeSubscriptionsQuery);
    
    // Get subscription data with plan details
    const subscriptions = subscriptionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate plan distribution
    const planDistribution = subscriptions.reduce((acc: any, sub: any) => {
      const plan = sub.planId || 'free';
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {});

    // Calculate revenue trend (last 7 days)
    const revenueTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayTransactions = transactions.filter((tx: any) => {
        const txDate = tx.createdAt.toDate();
        return txDate.getDate() === date.getDate() &&
               txDate.getMonth() === date.getMonth() &&
               txDate.getFullYear() === date.getFullYear();
      });
      
      return {
        date: date.toLocaleDateString(),
        revenue: dayTransactions.reduce((sum, tx: any) => sum + (tx.amount || 0), 0)
      };
    }).reverse();

    // Calculate churn rate
    const canceledSubscriptionsQuery = query(
      subscriptionsRef,
      where('status', '==', 'canceled'),
      where('canceledAt', '>=', thirtyDaysAgo)
    );
    const canceledSnapshot = await getDocs(canceledSubscriptionsQuery);
    const churnRate = subscriptionsSnapshot.size > 0 
      ? (canceledSnapshot.size / subscriptionsSnapshot.size) * 100 
      : 0;

    return {
      totalRevenue,
      monthlyRevenue,
      subscriptionCount: subscriptionsSnapshot.size,
      churnRate: Math.round(churnRate * 100) / 100,
      revenueTrend,
      planDistribution: Object.entries(planDistribution).map(([plan, count]) => ({
        plan: plan.replace('plan_', '').toUpperCase(),
        users: count
      })),
      recentTransactions: transactions
        .sort((a: any, b: any) => b.createdAt.toMillis() - a.createdAt.toMillis())
        .slice(0, 10)
        .map((tx: any) => ({
          id: tx.id,
          date: tx.createdAt.toDate(),
          userName: tx.userName || 'Unknown User',
          plan: tx.planName || 'Unknown Plan',
          amount: tx.amount || 0,
          status: tx.status || 'completed'
        }))
    };
  } catch (error) {
    console.error('Error getting payment stats:', error);
    throw error;
  }
}
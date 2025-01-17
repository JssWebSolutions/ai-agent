import { Home, Users, Settings, CreditCard, Activity, MessageSquare } from 'lucide-react';

export const menuItems = [
  { icon: Home, label: 'Home', path: '/user' },
  { icon: Users, label: 'All Agents', path: '/agent' },
  { icon: Activity, label: 'Real-Time Analytics', path: '/analytics' },
  { icon: MessageSquare, label: 'Live Chat', path: '/chat' },
  { icon: CreditCard, label: 'Subscription', path: '/subscription' },
  { icon: Settings, label: 'Account Settings', path: '/settings' }
];
import { useState } from 'react';
import { Search, Settings } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ChatSidebarProps {
  activeUsers: string[];
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
}

export function ChatSidebar({ selectedChat, onSelectChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const chats = [
    {
      id: '1',
      name: 'Alene',
      role: 'Technical Department',
      lastMessage: 'Hey, how are you?',
      time: '2h ago',
      unread: 0,
      online: true,
    },
    {
      id: '2',
      name: 'Keefe',
      role: 'Support Executive',
      lastMessage: 'The meeting is scheduled for tomorrow',
      time: '1:20 AM',
      unread: 2,
      online: true,
    },
    {
      id: '3',
      name: 'Lazaro',
      role: 'Resource Investigator',
      lastMessage: 'Thanks for your help!',
      time: 'Yesterday',
      unread: 0,
      online: true,
    },
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              "w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors",
              selectedChat === chat.id && "bg-blue-50"
            )}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">{chat.name[0]}</span>
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium truncate">{chat.name}</h3>
                <span className="text-sm text-gray-500 flex-shrink-0">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-500">{chat.role}</p>
              <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">
                {chat.unread}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
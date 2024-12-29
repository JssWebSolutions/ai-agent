import React from 'react';
import { User } from 'lucide-react';

interface UserPresenceProps {
  users: string[];
}

export function UserPresence({ users }: UserPresenceProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {users.slice(0, 3).map((user, index) => (
          <div
            key={user}
            className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white"
          >
            <User className="w-4 h-4 text-blue-600" />
          </div>
        ))}
      </div>
      {users.length > 3 && (
        <span className="text-sm text-gray-500">
          +{users.length - 3} more
        </span>
      )}
      <span className="ml-2 text-sm text-gray-600">
        {users.length} {users.length === 1 ? 'user' : 'users'} online
      </span>
    </div>
  );
}
import { useState } from 'react';
import { AgentList } from './AgentList';
import { ChatWindow } from './ChatWindow';
import { useAgentStore } from '../../store/agentStore';

export function ChatLayout() {
  const { selectedAgent } = useAgentStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Agent List - Left Panel */}
      <div className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:block w-full md:w-80 bg-white border-r border-gray-200
      `}>
        <AgentList onAgentSelect={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Chat Window - Right Panel */}
      <div className="flex-1 flex flex-col">
        {!selectedAgent ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select an agent to start chatting
          </div>
        ) : (
          <ChatWindow 
            agent={selectedAgent}
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />
        )}
      </div>
    </div>
  );
}
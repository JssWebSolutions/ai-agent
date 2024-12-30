
import { Bot, MessageSquare, Zap, Shield } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { FeatureCard } from '../UI/FeatureCard';

const features = [
  {
    icon: <Bot className="w-6 h-6 text-blue-500" />,
    title: "AI-Powered Agents",
    description: "Create and customize intelligent AI agents that understand and respond to your users' needs"
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-green-500" />,
    title: "Natural Conversations",
    description: "Enable seamless, human-like interactions with advanced language processing"
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Real-time Responses",
    description: "Get instant, accurate responses to keep your users engaged and satisfied"
  },
  {
    icon: <Shield className="w-6 h-6 text-purple-500" />,
    title: "Enterprise Security",
    description: "Bank-grade encryption and security measures to protect your data"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Your AI Agents
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to create and manage intelligent AI assistants
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
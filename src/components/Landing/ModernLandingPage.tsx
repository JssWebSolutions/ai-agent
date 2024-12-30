
import { ArrowRight, Bot, CheckCircle, MessageSquare, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function ModernLandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                AI Agent
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
              <a href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8">
              Build Intelligent <br />
              <span className="text-blue-600">AI Agents</span> with Ease
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Create, deploy, and manage AI agents that understand your users and provide intelligent responses in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/demo')}
                className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all border border-gray-200 shadow-lg hover:shadow-xl"
              >
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
            {[
              {
                icon: <Bot className="w-6 h-6 text-blue-500" />,
                title: "AI-Powered Agents",
                description: "Create and customize intelligent AI agents that understand your users' needs"
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
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl border border-gray-200 hover:border-blue-500/50 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-300 opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 opacity-25 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600">
              Discover why businesses rely on our platform to drive innovation and growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform has transformed how we handle our AI operations. Couldn't be happier!",
                author: "Sarah Johnson",
                role: "CTO at TechCorp",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
              },
              {
                quote: "The best AI management solution we've used. Intuitive and powerful.",
                author: "Michael Chen",
                role: "Lead Developer at InnovateLabs",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
              },
              {
                quote: "Outstanding support and features. It's revolutionized our workflow.",
                author: "Emily Rodriguez",
                role: "AI Product Manager",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all relative"
              >
                <div className="absolute -top-6 left-6 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-lg text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-14 h-14 rounded-full object-cover shadow-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 opacity-25 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
            Ready to Transform Your AI Operations?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of companies already revolutionizing their workflows with our intuitive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/plans')}
              className="bg-white text-blue-600 border border-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              View Plans
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
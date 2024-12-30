
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  return (
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
  );
}
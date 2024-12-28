import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CTASection() {
  const navigate = useNavigate();

  return (
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
  );
}
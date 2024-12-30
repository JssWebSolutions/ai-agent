import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
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
];

export function TestimonialsSection() {
  return (
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
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all relative"
            >
              <div className="absolute -top-6 left-6 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                <Quote className="w-6 h-6" />
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
  );
}
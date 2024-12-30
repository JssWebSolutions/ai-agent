import React from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Github,
  X,
  Linkedin
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; 




export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated } = useAuth(); // Access authentication state and user
  const dashboardLink = '/user'; // Define the dashboard link for authenticated users

  const features = [
    { title: 'AI-Powered Insights', description: 'Get real-time analytics and insights powered by advanced AI algorithms' },
    { title: 'Seamless Integration', description: 'Integrate with your existing tools and workflows effortlessly' },
    { title: 'Enterprise Security', description: 'Bank-grade security with end-to-end encryption and compliance' },
    { title: '24/7 Support', description: 'Round-the-clock expert support to help you succeed' }
  ];

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
      quote: "This platform has transformed how we handle our AI operations. Couldn't be happier!",
      author: "Sarah Johnson",
      role: "CTO at TechCorp",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">AI Agent</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
              <a href="/plans" className="text-gray-600 hover:text-gray-900">Pricing</a>
              {/* Update the button dynamically */}
              {isAuthenticated ? (
                <a
                  href={dashboardLink}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Dashboard
                </a>
              ) : (
                <a
                  href="/auth"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? '✖️' : '☰'}
          </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Features</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Testimonials</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Pricing</a>
              {/* Update the button dynamically */}
              {isAuthenticated ? (
                <a
                  href={dashboardLink}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Dashboard
                </a>
              ) : (
                <a
                  href="/auth"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        )}
      </nav>

     {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 opacity-30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 opacity-20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              Manage Your AI Agents <br className="hidden sm:block" />
              <span className="text-indigo-600">with Confidence</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Seamlessly create, deploy, and manage AI agents at scale. Our intuitive platform empowers you to get started in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/plans" 
                className="bg-indigo-600 text-white px-8 py-4 rounded-full hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl"
              >
                Start Free Trial
                <ArrowRight className="w-6 h-6" />
              </a>
              <button 
                className="bg-white text-gray-900 px-8 py-4 rounded-full hover:bg-gray-100 transition-all border border-gray-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
              >
                Watch Demo
              </button>
            </div>
          </div>
          <div className="mt-20 relative">
            <div className="relative rounded-xl shadow-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop"
                alt="Platform Dashboard"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-xl" />
            </div>
            <div className="absolute top-10 right-10 p-4 bg-white/80 backdrop-blur-lg shadow-lg rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900">Featured Dashboard</h3>
              <p className="text-sm text-gray-600">A sneak peek of your AI management tools in action.</p>
            </div>
          </div>
        </div>
      </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-400 opacity-20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 opacity-25 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Unlock the full potential of AI with tools tailored to your needs. Manage, deploy, and scale effortlessly with our feature-rich platform.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-8 bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

          {/* About the Company Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Text Content */}
              <div>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                  Transforming the Future of <span className="text-blue-600">AI Operations</span>
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  At <span className="font-semibold text-blue-600">AI Agent Manager</span>, we are on a mission to empower businesses with cutting-edge AI technology. Our platform is designed to simplify AI management, enabling organizations to innovate and thrive in a competitive landscape.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Trusted by startups and industry leaders alike, we deliver solutions that enhance efficiency, streamline workflows, and drive outstanding results.
                </p>
                <p className="text-lg text-gray-700 mb-8">
                  Ready to redefine the way your business leverages AI? Join us and take the first step toward operational excellence.
                </p>
                <a 
                  href="/about"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-lg shadow-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2"
                >
                  Learn More About Us
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
              {/* Image Section */}
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&h=600&fit=crop" 
                  alt="Team collaboration"
                  className="rounded-lg shadow-lg object-cover w-full"
                />
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-600 rounded-full transform -translate-x-8 -translate-y-8 opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500 rounded-full transform translate-x-8 translate-y-8 opacity-20"></div>
              </div>
            </div>
          </section>


          {/* Testimonials Section */}
          <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-gray-50 relative">
            <div className="absolute top-0 left-0 w-80 h-80 bg-blue-300 opacity-20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 opacity-25 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
                  Trusted by Industry Leaders
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Discover why businesses rely on our platform to drive innovation and growth.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index} 
                    className="p-8 bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all relative"
                  >
                    <div className="absolute -top-6 left-6 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/></svg>
                    </div>
                    <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author}
                        className="w-14 h-14 rounded-full object-cover shadow-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{testimonial.author}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>


          {/* CTA Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 opacity-25 rounded-full blur-3xl"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                Ready to Transform Your AI Operations?
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
                Join thousands of companies already revolutionizing their workflows with our intuitive platform.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="/plans"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#features"
                  className="bg-white text-blue-600 border border-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>


              {/* Footer */}
          <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Documentation</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-blue-500 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Careers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Status</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Connect</h3>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    <X className="w-6 h-6" />
                  </a>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} AI Agent Manager. All rights reserved.
              </p>
              <p className="mt-4 text-sm">
                Built with ❤️ by <a href="#" className="hover:text-blue-500">JSS Web Solutions</a>
              </p>
            </div>
          </footer>

    </div>
  );
}
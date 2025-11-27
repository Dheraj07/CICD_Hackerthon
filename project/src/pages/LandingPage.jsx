import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Star, TrendingUp, Shield, Users, BarChart3 } from 'lucide-react';

const LandingPage = () => {
  const features = [
    { icon: MessageSquare, title: 'Easy Feedback Collection', description: 'Simple and intuitive interface for customers to share their thoughts and experiences.' },
    { icon: Star, title: 'Rating System', description: 'Comprehensive 5-star rating system with detailed review capabilities.' },
    { icon: BarChart3, title: 'Advanced Analytics', description: 'Powerful insights and reporting to understand customer sentiment trends.' },
    { icon: Shield, title: 'Secure & Private', description: 'Enterprise-grade security with options for anonymous feedback submission.' },
    { icon: TrendingUp, title: 'Business Growth', description: 'Turn customer feedback into actionable insights for continuous improvement.' },
    { icon: Users, title: 'Multi-Role Support', description: 'Separate dashboards for customers and administrators with role-based access.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6">
              <MessageSquare className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Customer Feedback into 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Business Growth</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Collect, analyze, and act on customer feedback with our comprehensive management system. 
              Turn insights into improvements and build stronger customer relationships.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg">Get Started Free</Link>
            <Link to="/login" className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-105">Sign In</Link>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need for Feedback Management</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our comprehensive platform provides all the tools you need to collect, analyze, and act on customer feedback effectively.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:translate-y-1">
                <div className="bg-blue-100 p-3 rounded-lg w-fit mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-16">Trusted by Businesses Worldwide</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-100">Customer Satisfaction</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100">Feedback Collected</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Improve Your Customer Experience?</h2>
          <p className="text-xl text-gray-600 mb-10">Join thousands of businesses using FeedbackPro to build better products and services.</p>
          <Link to="/register" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg">Start Your Free Trial</Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

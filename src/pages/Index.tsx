
import React, { useState } from 'react';
import { Shield, FileCheck, Users, Lock, CheckCircle, FileText, Search } from 'lucide-react';
import AuthForm from '../components/AuthForm';
import Dashboard from '../components/Dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-primary-500" />,
      title: "Blockchain Security",
      description: "Documents secured with cryptographic hashing and blockchain technology"
    },
    {
      icon: <FileCheck className="h-8 w-8 text-success-500" />,
      title: "Instant Verification",
      description: "Real-time document authenticity verification with tamper detection"
    },
    {
      icon: <Users className="h-8 w-8 text-primary-500" />,
      title: "Multi-Role Access",
      description: "Separate interfaces for citizens and government institutions"
    },
    {
      icon: <Lock className="h-8 w-8 text-success-500" />,
      title: "Secure Storage",
      description: "End-to-end encrypted document storage with immutable records"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Documents Verified", icon: <FileText className="h-6 w-6" /> },
    { number: "99.9%", label: "Uptime Guarantee", icon: <CheckCircle className="h-6 w-6" /> },
    { number: "500+", label: "Government Partners", icon: <Users className="h-6 w-6" /> },
    { number: "24/7", label: "Verification Service", icon: <Search className="h-6 w-6" /> }
  ];

  if (user) {
    return <Dashboard user={user} onLogout={() => setUser(null)} />;
  }

  if (showAuth) {
    return <AuthForm onAuthSuccess={setUser} onBack={() => setShowAuth(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-primary-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-500 to-success-500 p-2 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DocVerify</h1>
                <p className="text-xs text-gray-600">Blockchain Document Verification</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowAuth(true)}
                className="border-primary-200 text-primary-700 hover:bg-primary-50"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-primary-500 to-success-500 hover:from-primary-600 hover:to-success-600 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Secure Document
              <span className="bg-gradient-to-r from-primary-500 to-success-500 bg-clip-text text-transparent">
                {" "}Verification
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Revolutionary blockchain-based platform for uploading, storing, and verifying official documents. 
              Ensure authenticity with cryptographic security and immutable records.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-primary-500 to-success-500 hover:from-primary-600 hover:to-success-600 text-white px-8 py-3 text-lg"
              >
                Start Verifying Documents
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-200 text-primary-700 hover:bg-primary-50 px-8 py-3 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-success-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DocVerify?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of document verification with our cutting-edge blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-primary-100 to-success-100 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-success-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Secure Your Documents?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users and institutions already using DocVerify for secure document management
          </p>
          <Button
            size="lg"
            onClick={() => setShowAuth(true)}
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Get Started Today
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-primary-500 to-success-500 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">DocVerify</h3>
                <p className="text-sm text-gray-400">Blockchain Document Verification</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2024 DocVerify. Powered by blockchain technology.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Secure • Transparent • Immutable
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

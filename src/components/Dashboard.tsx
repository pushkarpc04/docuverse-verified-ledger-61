
import React, { useState } from 'react';
import { LogOut, Shield, Upload, Search, FileText, CheckCircle, AlertCircle, Clock, User, Building, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DocumentUpload from './DocumentUpload';
import DocumentVerify from './DocumentVerify';
import UserDocuments from './UserDocuments';
import InstituteDocuments from './InstituteDocuments';
import BlockchainLedger from './BlockchainLedger';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userTabs = [
    { id: 'overview', label: 'Overview', icon: <FileText className="h-4 w-4" /> },
    { id: 'upload', label: 'Upload Document', icon: <Upload className="h-4 w-4" /> },
    { id: 'verify', label: 'Verify Document', icon: <Search className="h-4 w-4" /> },
    { id: 'documents', label: 'My Documents', icon: <FileText className="h-4 w-4" /> },
    { id: 'blockchain', label: 'Blockchain Ledger', icon: <Shield className="h-4 w-4" /> },
  ];

  const instituteTabs = [
    { id: 'overview', label: 'Overview', icon: <FileText className="h-4 w-4" /> },
    { id: 'verify', label: 'Verify Document', icon: <Search className="h-4 w-4" /> },
    { id: 'pending', label: 'Pending Reviews', icon: <Clock className="h-4 w-4" /> },
    { id: 'blockchain', label: 'Blockchain Ledger', icon: <Shield className="h-4 w-4" /> },
  ];

  const tabs = user.role === 'institute' ? instituteTabs : userTabs;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview user={user} />;
      case 'upload':
        return <DocumentUpload user={user} />;
      case 'verify':
        return <DocumentVerify user={user} />;
      case 'documents':
        return <UserDocuments user={user} />;
      case 'pending':
        return <InstituteDocuments user={user} />;
      case 'blockchain':
        return <BlockchainLedger user={user} />;
      default:
        return <DashboardOverview user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-500 to-success-500 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">DocVerify</h1>
              <p className="text-xs text-gray-600">Dashboard</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              {user.role === 'institute' ? (
                <Building className="h-5 w-5 text-primary-600" />
              ) : (
                <User className="h-5 w-5 text-primary-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
              <div className="flex items-center space-x-2">
                <Badge variant={user.role === 'institute' ? 'default' : 'secondary'} className="text-xs">
                  {user.role === 'institute' ? 'Institution' : 'User'}
                </Badge>
                {user.verified && (
                  <CheckCircle className="h-3 w-3 text-success-500" />
                )}
              </div>
            </div>
          </div>
          {user.instituteName && (
            <p className="text-sm text-gray-600 mt-2">{user.instituteName}</p>
          )}
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <Button
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className={`w-full justify-start ${activeTab === tab.id ? 'bg-gradient-to-r from-primary-500 to-success-500 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4 lg:p-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 capitalize">
                  {activeTab === 'pending' ? 'Pending Reviews' : activeTab}
                </h1>
                <p className="text-sm text-gray-600">
                  {activeTab === 'overview' && 'Dashboard overview and statistics'}
                  {activeTab === 'upload' && 'Upload and secure your documents'}
                  {activeTab === 'verify' && 'Verify document authenticity'}
                  {activeTab === 'documents' && 'Manage your uploaded documents'}
                  {activeTab === 'pending' && 'Review and approve submitted documents'}
                  {activeTab === 'blockchain' && 'View blockchain transaction ledger'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="hidden sm:flex">
                {user.role === 'institute' ? 'Institution Access' : 'User Access'}
              </Badge>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const DashboardOverview: React.FC<{ user: any }> = ({ user }) => {
  const userStats = [
    { label: 'Total Documents', value: '0', icon: <FileText className="h-6 w-6" />, color: 'text-blue-600' },
    { label: 'Verified Documents', value: '0', icon: <CheckCircle className="h-6 w-6" />, color: 'text-green-600' },
    { label: 'Pending Reviews', value: '0', icon: <Clock className="h-6 w-6" />, color: 'text-yellow-600' },
    { label: 'Failed Verifications', value: '0', icon: <AlertCircle className="h-6 w-6" />, color: 'text-red-600' },
  ];

  const instituteStats = [
    { label: 'Documents Reviewed', value: '0', icon: <FileText className="h-6 w-6" />, color: 'text-blue-600' },
    { label: 'Approved Today', value: '0', icon: <CheckCircle className="h-6 w-6" />, color: 'text-green-600' },
    { label: 'Pending Reviews', value: '0', icon: <Clock className="h-6 w-6" />, color: 'text-yellow-600' },
    { label: 'Rejected Documents', value: '0', icon: <AlertCircle className="h-6 w-6" />, color: 'text-red-600' },
  ];

  const stats = user.role === 'institute' ? instituteStats : userStats;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-500 to-success-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user.firstName}!
        </h2>
        <p className="opacity-90">
          {user.role === 'institute' 
            ? 'Manage document verifications and approvals for your institution.'
            : 'Upload, verify, and manage your important documents securely.'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest document activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm">Upload or verify documents to see activity here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current blockchain and system status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Blockchain Network</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Document Storage</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Verification Service</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

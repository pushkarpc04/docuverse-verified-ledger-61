import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Hash, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface UserDocumentsProps {
  user: any;
}

const UserDocuments: React.FC<UserDocumentsProps> = ({ user }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDocuments = async () => {
      try {
        console.log('Fetching documents from localStorage for user:', user.id);
        // Get documents from localStorage instead of Firestore
        const storedDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
        console.log('All stored documents:', storedDocuments);
        
        // Filter documents for current user
        const userDocuments = storedDocuments.filter((doc: any) => doc.uploadedBy === user.id);
        console.log('User documents:', userDocuments);
        
        setDocuments(userDocuments);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserDocuments();
    }
  }, [user.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary-500" />
              <span>My Documents</span>
            </CardTitle>
            <CardDescription>Loading your documents...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary-500" />
              <span>My Documents</span>
            </CardTitle>
            <CardDescription>
              Manage and view all your uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Found</h3>
              <p className="text-gray-600 mb-6">
                You haven't uploaded any documents yet. Start by uploading your first document to secure it on the blockchain.
              </p>
              <Button className="bg-gradient-to-r from-primary-500 to-success-500 hover:from-primary-600 hover:to-success-600">
                Upload Your First Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary-500" />
            <span>My Documents</span>
          </CardTitle>
          <CardDescription>
            View and manage all your uploaded documents ({documents.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((document, index) => (
              <Card key={document.id || index} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-primary-100 rounded-lg">
                          <FileText className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {document.title}
                          </h3>
                          {getStatusIcon(document.status)}
                          {getStatusBadge(document.status)}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{document.fileName}</p>
                        
                        {document.description && (
                          <p className="text-sm text-gray-700 mb-3">{document.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Uploaded:</span>
                            <span className="text-gray-900">
                              {format(new Date(document.uploadedAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Size:</span>
                            <span className="text-gray-900">
                              {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1 flex items-center space-x-1">
                              <Hash className="h-3 w-3" />
                              <span>Document Hash</span>
                            </p>
                            <code className="text-xs bg-gray-100 p-2 rounded font-mono break-all block">
                              {document.documentHash}
                            </code>
                          </div>
                          
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">Transaction ID</p>
                            <code className="text-xs bg-green-100 p-2 rounded font-mono break-all block text-green-700">
                              {document.transactionId}
                            </code>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Block #{document.blockNumber}</span>
                            <span>•</span>
                            <span>Blockchain secured</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary-600 border-primary-200 hover:bg-primary-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 border-gray-200 hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDocuments;

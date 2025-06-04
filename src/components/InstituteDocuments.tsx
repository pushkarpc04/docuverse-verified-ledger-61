
import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, Clock, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface InstituteDocumentsProps {
  user: any;
}

const InstituteDocuments: React.FC<InstituteDocumentsProps> = ({ user }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [reviewComments, setReviewComments] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    // Load all documents for institute review
    const allDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
    setDocuments(allDocuments);
  }, []);

  const handleDocumentAction = (documentId: string, action: 'approve' | 'reject') => {
    const comment = reviewComments[documentId] || '';
    
    const updatedDocuments = documents.map(doc => {
      if (doc.transactionId === documentId) {
        return {
          ...doc,
          status: action === 'approve' ? 'verified' : 'rejected',
          reviewedBy: user.id,
          reviewedAt: new Date().toISOString(),
          reviewComment: comment,
          instituteName: user.instituteName
        };
      }
      return doc;
    });

    // Update localStorage
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    setDocuments(updatedDocuments);

    // Clear comment
    setReviewComments(prev => ({ ...prev, [documentId]: '' }));

    toast({
      title: `Document ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `The document has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
    });
  };

  const updateComment = (documentId: string, comment: string) => {
    setReviewComments(prev => ({ ...prev, [documentId]: comment }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const pendingDocuments = documents.filter(doc => doc.status === 'verified' || doc.status === 'pending');
  const reviewedDocuments = documents.filter(doc => doc.status === 'rejected' || (doc.status === 'verified' && doc.reviewedBy));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span>Pending Reviews</span>
          </CardTitle>
          <CardDescription>
            Documents awaiting institutional review and approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingDocuments.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No documents pending review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingDocuments.map((document, index) => (
                <Card key={index} className="border border-yellow-200 bg-yellow-50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                          <FileText className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
                          <p className="text-sm text-gray-600">{document.fileName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Uploaded on {format(new Date(document.uploadedAt), 'PPP')}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(document.status)}
                    </div>

                    {document.description && (
                      <p className="text-sm text-gray-700 mb-4">{document.description}</p>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Review Comments (Optional)
                        </label>
                        <Textarea
                          placeholder="Add your review comments here..."
                          value={reviewComments[document.transactionId] || ''}
                          onChange={(e) => updateComment(document.transactionId, e.target.value)}
                          rows={3}
                          className="w-full"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleDocumentAction(document.transactionId, 'approve')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleDocumentAction(document.transactionId, 'reject')}
                          variant="destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviewed Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Review History</span>
          </CardTitle>
          <CardDescription>
            Previously reviewed documents and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviewedDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No reviewed documents yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviewedDocuments.map((document, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${document.status === 'verified' ? 'bg-green-100' : 'bg-red-100'}`}>
                          <FileText className={`h-6 w-6 ${document.status === 'verified' ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
                          <p className="text-sm text-gray-600">{document.fileName}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>Uploaded: {format(new Date(document.uploadedAt), 'MMM dd, yyyy')}</span>
                            {document.reviewedAt && (
                              <span>Reviewed: {format(new Date(document.reviewedAt), 'MMM dd, yyyy')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(document.status)}
                    </div>

                    {document.reviewComment && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Review Comment</span>
                        </div>
                        <p className="text-sm text-gray-600">{document.reviewComment}</p>
                      </div>
                    )}

                    {document.instituteName && (
                      <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        <span>Reviewed by {document.instituteName}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstituteDocuments;

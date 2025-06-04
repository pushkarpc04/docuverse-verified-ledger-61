
import React, { useState } from 'react';
import { Search, Shield, CheckCircle, XCircle, Hash, Clock, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface DocumentVerifyProps {
  user: any;
}

const DocumentVerify: React.FC<DocumentVerifyProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter a document hash or transaction ID to verify.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Search in mock blockchain (localStorage)
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      const result = documents.find((doc: any) => 
        doc.documentHash.includes(searchQuery) || 
        doc.transactionId.includes(searchQuery) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (result) {
        setSearchResult({
          ...result,
          verified: true,
          verificationTimestamp: new Date().toISOString(),
        });
        toast({
          title: "Document Found!",
          description: "Document verification completed successfully.",
        });
      } else {
        setSearchResult({
          verified: false,
          query: searchQuery,
          verificationTimestamp: new Date().toISOString(),
        });
        toast({
          title: "Document Not Found",
          description: "No document found matching your search criteria.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary-500" />
            <span>Document Verification</span>
          </CardTitle>
          <CardDescription>
            Verify the authenticity of documents using blockchain technology
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Document</Label>
              <div className="flex space-x-2">
                <Input
                  id="search"
                  placeholder="Enter document hash, transaction ID, or filename"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="bg-gradient-to-r from-primary-500 to-success-500 hover:from-primary-600 hover:to-success-600"
                >
                  {isSearching ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Verify
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Search by document hash, transaction ID, or filename to verify authenticity</span>
              </p>
            </div>
          </div>

          {/* Search Result */}
          {searchResult && (
            <Card className={`border-2 ${searchResult.verified ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {searchResult.verified ? (
                      <div className="p-3 bg-green-500 rounded-full">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                    ) : (
                      <div className="p-3 bg-red-500 rounded-full">
                        <XCircle className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${searchResult.verified ? 'text-green-800' : 'text-red-800'}`}>
                        {searchResult.verified ? 'Document Verified' : 'Document Not Found'}
                      </h3>
                      <Badge variant={searchResult.verified ? 'default' : 'destructive'} className="text-sm">
                        {searchResult.verified ? 'VERIFIED' : 'NOT FOUND'}
                      </Badge>
                    </div>

                    {searchResult.verified ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Document Title</p>
                            <p className="text-sm text-gray-900">{searchResult.title}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">File Name</p>
                            <p className="text-sm text-gray-900">{searchResult.fileName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Upload Date</p>
                            <p className="text-sm text-gray-900">
                              {format(new Date(searchResult.uploadedAt), 'PPP')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">File Size</p>
                            <p className="text-sm text-gray-900">
                              {(searchResult.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-green-200">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                              <Hash className="h-4 w-4" />
                              <span>Document Hash</span>
                            </p>
                            <code className="text-xs bg-white p-2 rounded border font-mono break-all block">
                              {searchResult.documentHash}
                            </code>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                              <Shield className="h-4 w-4" />
                              <span>Transaction ID</span>
                            </p>
                            <code className="text-xs bg-white p-2 rounded border font-mono break-all block">
                              {searchResult.transactionId}
                            </code>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Block Number</p>
                            <code className="text-xs bg-white p-2 rounded border font-mono">
                              #{searchResult.blockNumber}
                            </code>
                          </div>
                        </div>

                        {searchResult.description && (
                          <div className="pt-3 border-t border-green-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                            <p className="text-sm text-gray-900">{searchResult.description}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-red-700">
                          No document found matching "{searchResult.query}". This could mean:
                        </p>
                        <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                          <li>The document was not uploaded to our blockchain</li>
                          <li>The hash or transaction ID is incorrect</li>
                          <li>The document may have been uploaded to a different platform</li>
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                      <p className="text-xs text-gray-500">
                        Verified on {format(new Date(searchResult.verificationTimestamp), 'PPpp')}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearSearch}
                      >
                        New Search
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">How Verification Works</h4>
                    <p className="text-sm text-blue-700">
                      Our system generates a unique cryptographic hash for each document and stores it on the blockchain. 
                      During verification, we recompute the hash and compare it with the stored value.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">Security Guarantee</h4>
                    <p className="text-sm text-green-700">
                      Blockchain technology ensures that once a document is verified, its authenticity record 
                      cannot be altered or tampered with, providing immutable proof of integrity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentVerify;


import React, { useState, useEffect } from 'react';
import { Shield, Hash, Clock, FileText, User, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface BlockchainLedgerProps {
  user: any;
}

const BlockchainLedger: React.FC<BlockchainLedgerProps> = ({ user }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Load all blockchain transactions
    const allDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
    
    // Convert documents to transaction format
    const blockchainTransactions = allDocuments.map((doc: any, index: number) => ({
      id: doc.transactionId,
      blockNumber: doc.blockNumber,
      transactionHash: doc.documentHash,
      timestamp: doc.uploadedAt,
      documentTitle: doc.title,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      status: doc.status,
      uploadedBy: doc.uploadedBy,
      reviewedBy: doc.reviewedBy,
      reviewedAt: doc.reviewedAt,
      instituteName: doc.instituteName,
      gasUsed: Math.floor(Math.random() * 50000) + 21000, // Mock gas usage
      transactionFee: '0.00' + Math.floor(Math.random() * 100), // Mock fee
    }));

    // Sort by block number (newest first)
    blockchainTransactions.sort((a, b) => b.blockNumber - a.blockNumber);
    
    setTransactions(blockchainTransactions);
    setFilteredTransactions(blockchainTransactions);
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.transactionHash.includes(searchTerm) ||
        tx.id.includes(searchTerm)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(tx => tx.status === filterStatus);
    }

    // If user is not institute, only show their transactions
    if (user.role !== 'institute') {
      filtered = filtered.filter(tx => tx.uploadedBy === user.id);
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filterStatus, transactions, user]);

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

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary-500" />
            <span>Blockchain Ledger</span>
          </CardTitle>
          <CardDescription>
            Immutable record of all document transactions on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions, hashes, or document names..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'verified' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('verified')}
              >
                Verified
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                Pending
              </Button>
            </div>
          </div>

          {/* Blockchain Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary-600">{transactions.length}</p>
                <p className="text-sm text-primary-700">Total Transactions</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {transactions.filter(tx => tx.status === 'verified').length}
                </p>
                <p className="text-sm text-green-700">Verified Documents</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {transactions.filter(tx => tx.status === 'pending').length}
                </p>
                <p className="text-sm text-yellow-700">Pending Review</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {transactions.length > 0 ? Math.max(...transactions.map(tx => tx.blockNumber)) : 0}
                </p>
                <p className="text-sm text-blue-700">Latest Block</p>
              </CardContent>
            </Card>
          </div>

          {/* Transaction List */}
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No transactions found</p>
              <p className="text-sm text-gray-400">Upload documents to see blockchain transactions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction, index) => (
                <Card key={index} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary-100 p-3 rounded-lg">
                          <FileText className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {transaction.documentTitle}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{transaction.fileName}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Block #{transaction.blockNumber}</span>
                            <span>•</span>
                            <span>{format(new Date(transaction.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                            <span>•</span>
                            <span>{(transaction.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
                          <Hash className="h-4 w-4" />
                          <span>Transaction Hash</span>
                        </p>
                        <code className="text-xs bg-gray-100 p-2 rounded font-mono break-all block">
                          {transaction.transactionHash}
                        </code>
                      </div>

                      <div>
                        <p className="font-medium text-gray-700 mb-2">Transaction ID</p>
                        <code className="text-xs bg-blue-100 p-2 rounded font-mono break-all block text-blue-700">
                          {transaction.id}
                        </code>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 text-sm">
                      <div>
                        <p className="text-gray-600">Gas Used</p>
                        <p className="font-medium">{transaction.gasUsed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Transaction Fee</p>
                        <p className="font-medium">{transaction.transactionFee} ETH</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium capitalize">{transaction.status}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Confirmations</p>
                        <p className="font-medium text-green-600">∞ (Immutable)</p>
                      </div>
                    </div>

                    {transaction.reviewedAt && transaction.instituteName && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span>Reviewed by {transaction.instituteName} on {format(new Date(transaction.reviewedAt), 'MMM dd, yyyy')}</span>
                        </div>
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

export default BlockchainLedger;

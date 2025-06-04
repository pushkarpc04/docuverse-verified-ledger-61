
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Shield, Hash, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import CryptoJS from 'crypto-js';

interface DocumentUploadProps {
  user: any;
}

interface UploadedFile {
  file: File;
  id: string;
  hash?: string;
  transactionId?: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ user }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const generateDocumentHash = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const wordArray = CryptoJS.lib.WordArray.create(event.target?.result as ArrayBuffer);
        const hash = CryptoJS.SHA256(wordArray).toString();
        resolve(hash);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const generateTransactionId = (): string => {
    return 'tx_' + CryptoJS.lib.WordArray.random(16).toString();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== acceptedFiles.length) {
      toast({
        title: "Invalid File Type",
        description: "Only PDF files are allowed for document upload.",
        variant: "destructive",
      });
    }

    const newFiles: UploadedFile[] = pdfFiles.map(file => ({
      file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    processFiles(newFiles);
  }, [toast]);

  const processFiles = async (newFiles: UploadedFile[]) => {
    setIsUploading(true);

    for (const fileObj of newFiles) {
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, progress } : f
          ));
        }

        // Update status to processing
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'processing' } : f
        ));

        // Generate blockchain hash
        const hash = await generateDocumentHash(fileObj.file);
        const transactionId = generateTransactionId();

        // Simulate blockchain processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Store document metadata in mock blockchain
        const blockchainEntry = {
          transactionId,
          documentHash: hash,
          fileName: fileObj.file.name,
          fileSize: fileObj.file.size,
          uploadedBy: user.id,
          uploadedAt: new Date().toISOString(),
          title: documentTitle || fileObj.file.name,
          description: documentDescription,
          status: 'verified',
          blockNumber: Math.floor(Math.random() * 1000000) + 500000,
        };

        // Store in localStorage (simulating blockchain storage)
        const existingDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
        existingDocuments.push(blockchainEntry);
        localStorage.setItem('documents', JSON.stringify(existingDocuments));

        // Update file status
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'completed', hash, transactionId, progress: 100 } 
            : f
        ));

        toast({
          title: "Document Uploaded Successfully!",
          description: `Document "${documentTitle || fileObj.file.name}" has been secured on the blockchain.`,
        });

      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'error' } : f
        ));

        toast({
          title: "Upload Failed",
          description: "There was an error uploading your document. Please try again.",
          variant: "destructive",
        });
      }
    }

    setIsUploading(false);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing on blockchain...';
      case 'completed':
        return 'Secured on blockchain';
      case 'error':
        return 'Upload failed';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary-500" />
            <span>Secure Document Upload</span>
          </CardTitle>
          <CardDescription>
            Upload your documents to be secured on the blockchain with cryptographic hashing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Document Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="Enter document title"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the document"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* File Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-primary-100 rounded-full">
                <Upload className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Drop your PDF files here' : 'Drag & drop PDF files here'}
                </p>
                <p className="text-sm text-gray-600">
                  or <span className="text-primary-600 font-medium">browse files</span> to upload
                </p>
              </div>
              <div className="text-xs text-gray-500">
                Only PDF files are supported • Max 50MB per file
              </div>
            </div>
          </div>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Uploaded Files</h3>
              <div className="space-y-3">
                {files.map((fileObj) => (
                  <Card key={fileObj.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(fileObj.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {fileObj.file.name}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(fileObj.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>{(fileObj.file.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span>{getStatusText(fileObj.status)}</span>
                          </div>
                          {fileObj.status !== 'completed' && (
                            <Progress value={fileObj.progress} className="w-full h-2" />
                          )}
                          {fileObj.status === 'completed' && (
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                              <div className="flex items-center space-x-2">
                                <Hash className="h-4 w-4 text-gray-400" />
                                <span className="text-xs text-gray-600">Hash:</span>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                  {fileObj.hash?.substring(0, 16)}...
                                </code>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Shield className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-gray-600">Transaction ID:</span>
                                <code className="text-xs bg-green-100 px-2 py-1 rounded font-mono text-green-700">
                                  {fileObj.transactionId}
                                </code>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;

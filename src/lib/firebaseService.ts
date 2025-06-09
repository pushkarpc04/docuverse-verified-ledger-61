
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import CryptoJS from 'crypto-js';

export interface DocumentData {
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  documentHash: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  transactionId: string;
  blockNumber: number;
  downloadUrl?: string;
}

export const uploadDocument = async (
  file: File, 
  metadata: Omit<DocumentData, 'fileName' | 'fileSize' | 'fileType' | 'documentHash' | 'uploadedAt' | 'transactionId' | 'blockNumber' | 'downloadUrl'>,
  userId: string
): Promise<string> => {
  try {
    // Generate document hash
    const arrayBuffer = await file.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    const documentHash = CryptoJS.SHA256(wordArray).toString();

    // Upload file to Firebase Storage
    const storageRef = ref(storage, `documents/${userId}/${file.name}-${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    // Mock blockchain transaction (in a real app, this would interact with actual blockchain)
    const transactionId = `0x${CryptoJS.SHA256(documentHash + Date.now()).toString().substring(0, 64)}`;
    const blockNumber = Math.floor(Math.random() * 1000000) + 1000000;

    // Save document metadata to Firestore
    const documentData: DocumentData = {
      ...metadata,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      documentHash,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      transactionId,
      blockNumber,
      downloadUrl
    };

    const docRef = await addDoc(collection(db, 'documents'), documentData);
    return docRef.id;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const getUserDocuments = async (userId: string): Promise<DocumentData[]> => {
  try {
    const documentsRef = collection(db, 'documents');
    const q = query(
      documentsRef, 
      where('uploadedBy', '==', userId),
      orderBy('uploadedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as DocumentData & { id: string }));
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const updateDocumentStatus = async (
  documentId: string, 
  status: 'verified' | 'rejected'
): Promise<void> => {
  try {
    const docRef = doc(db, 'documents', documentId);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error('Error updating document status:', error);
    throw error;
  }
};

export const verifyDocumentHash = async (hash: string): Promise<DocumentData | null> => {
  try {
    const documentsRef = collection(db, 'documents');
    const q = query(documentsRef, where('documentHash', '==', hash));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as DocumentData & { id: string };
  } catch (error) {
    console.error('Error verifying document:', error);
    throw error;
  }
};

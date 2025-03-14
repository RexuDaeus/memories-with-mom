import { db, getOrCreateUserId } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Firebase connection...');
    const userId = await getOrCreateUserId();
    console.log('Got user ID:', userId);
    
    // Try to write a test document to Firebase
    const testDocRef = doc(db, 'connection_test', 'test_doc');
    await setDoc(testDocRef, {
      timestamp: new Date().toISOString(),
      testValue: 'Connection successful'
    });
    
    console.log('Successfully wrote to Firebase!');
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

// Simple function to get Firebase config info
export const getFirebaseInfo = () => {
  try {
    // Check if Firebase is initialized by checking if the db object exists
    const isInitialized = !!db;
    
    return {
      isInitialized,
      message: isInitialized 
        ? 'Firebase appears to be initialized correctly' 
        : 'Firebase does not appear to be initialized'
    };
  } catch (error) {
    return {
      isInitialized: false,
      message: `Error checking Firebase status: ${error}`
    };
  }
}; 
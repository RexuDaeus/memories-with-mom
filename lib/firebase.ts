import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc,
  setDoc, 
  getDocs, 
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  Timestamp,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Firebase configuration for a demo project
// Note: This is a public demo project - DO NOT use for production
const firebaseConfig = {
  apiKey: "AIzaSyA5K8GtKbOv3yWR4gUQ6Ju97A3z3REJXX4",
  authDomain: "memories-with-mom-demo.firebaseapp.com",
  projectId: "memories-with-mom-demo",
  storageBucket: "memories-with-mom-demo.appspot.com",
  messagingSenderId: "246548016751",
  appId: "1:246548016751:web:a6e41a7a8b313717108cdd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export interface CardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  liked: boolean;
  date?: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    shadow: string;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Get or create user ID for session
export const getOrCreateUserId = async (): Promise<string> => {
  // Check if we have a user ID in localStorage
  const savedUserId = localStorage.getItem('memory-user-id');
  if (savedUserId) {
    return savedUserId;
  }
  
  // If not, create an anonymous user
  try {
    const userCredential = await signInAnonymously(auth);
    const userId = userCredential.user.uid;
    localStorage.setItem('memory-user-id', userId);
    return userId;
  } catch (error) {
    console.error('Error creating anonymous user:', error);
    // Fallback to a generated ID if Firebase auth fails
    const fallbackId = 'user-' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('memory-user-id', fallbackId);
    return fallbackId;
  }
};

// Save cards to Firestore
export const saveCardsToFirestore = async (cards: CardData[]): Promise<void> => {
  try {
    const userId = await getOrCreateUserId();
    const userDocRef = doc(db, 'users', userId);
    
    // Check if user document exists
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      // Create the user document if it doesn't exist
      await setDoc(userDocRef, {
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp()
      });
    }
    
    // Get a new batch
    const batch = writeBatch(db);
    
    // Update the lastUpdated field in the user document
    batch.update(userDocRef, { lastActive: serverTimestamp() });
    
    // Delete all existing cards for this user
    const cardsCollectionRef = collection(db, 'users', userId, 'cards');
    const existingCardsSnapshot = await getDocs(cardsCollectionRef);
    
    existingCardsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Add each card to the batch
    for (const card of cards) {
      const cardRef = doc(cardsCollectionRef, card.id.toString());
      batch.set(cardRef, {
        ...card,
        updatedAt: serverTimestamp()
      });
    }
    
    // Commit the batch
    await batch.commit();
    
    // Update the last sync timestamp
    localStorage.setItem('memory-cards-last-sync', new Date().toISOString());
    
    console.log('Cards saved to Firestore successfully');
  } catch (error) {
    console.error('Error saving cards to Firestore:', error);
    // Fall back to localStorage
    localStorage.setItem('memory-cards', JSON.stringify(cards));
  }
};

// Load cards from Firestore
export const loadCardsFromFirestore = async (): Promise<CardData[]> => {
  try {
    const userId = await getOrCreateUserId();
    const cardsCollectionRef = collection(db, 'users', userId, 'cards');
    const querySnapshot = await getDocs(query(cardsCollectionRef, orderBy('id')));
    
    const cards: CardData[] = [];
    querySnapshot.forEach((doc) => {
      const cardData = doc.data() as CardData;
      cards.push(cardData);
    });
    
    // Update the last sync timestamp
    localStorage.setItem('memory-cards-last-sync', new Date().toISOString());
    
    // Save a backup to localStorage in case offline
    localStorage.setItem('memory-cards', JSON.stringify(cards));
    
    console.log('Cards loaded from Firestore successfully');
    return cards;
  } catch (error) {
    console.error('Error loading cards from Firestore:', error);
    
    // Fall back to localStorage
    const savedCards = localStorage.getItem('memory-cards');
    if (savedCards) {
      try {
        return JSON.parse(savedCards) as CardData[];
      } catch (e) {
        console.error('Failed to parse saved cards:', e);
      }
    }
    
    return [];
  }
};

// Set up real-time listener for card changes
export const subscribeToCardChanges = (
  userId: string, 
  onCardsChanged: (cards: CardData[]) => void
): (() => void) => {
  try {
    const cardsCollectionRef = collection(db, 'users', userId, 'cards');
    const q = query(cardsCollectionRef, orderBy('id'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cards: CardData[] = [];
      querySnapshot.forEach((doc) => {
        const cardData = doc.data() as CardData;
        cards.push(cardData);
      });
      
      // Update the local state
      onCardsChanged(cards);
      
      // Save a backup to localStorage
      localStorage.setItem('memory-cards', JSON.stringify(cards));
      localStorage.setItem('memory-cards-last-sync', new Date().toISOString());
    }, (error) => {
      console.error('Error listening to card changes:', error);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up card subscription:', error);
    return () => {}; // Return a no-op function if subscription fails
  }
};

export { db }; 
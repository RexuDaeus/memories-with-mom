import { CardData } from '@/lib/firebase';

// Save cards to localStorage
export const saveCardsToLocalStorage = (cards: CardData[]): void => {
  try {
    localStorage.setItem('memory-cards', JSON.stringify(cards));
    localStorage.setItem('memory-cards-timestamp', new Date().toISOString());
    console.log('Cards saved to localStorage successfully');
  } catch (error) {
    console.error('Error saving cards to localStorage:', error);
  }
};

// Load cards from localStorage
export const loadCardsFromLocalStorage = (): CardData[] => {
  try {
    const savedCards = localStorage.getItem('memory-cards');
    if (savedCards) {
      const parsedCards = JSON.parse(savedCards) as CardData[];
      console.log('Cards loaded from localStorage successfully');
      return parsedCards;
    }
  } catch (error) {
    console.error('Error loading cards from localStorage:', error);
  }
  
  return [];
};

// Check if there are newer cards in localStorage
export const hasNewerCardsInLocalStorage = (): boolean => {
  try {
    const lastSyncTimestamp = localStorage.getItem('memory-cards-last-sync');
    const localTimestamp = localStorage.getItem('memory-cards-timestamp');
    
    if (!lastSyncTimestamp || !localTimestamp) return false;
    
    return new Date(localTimestamp) > new Date(lastSyncTimestamp);
  } catch (error) {
    console.error('Error checking for newer cards in localStorage:', error);
    return false;
  }
}; 
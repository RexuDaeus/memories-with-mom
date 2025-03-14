"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, type PanInfo, useReducedMotion } from "framer-motion"
import { Heart, Edit, Plus, Save, X, Image, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ColorThief from "colorthief"
import { useFirebase } from "@/components/firebase-provider"
import { 
  loadCardsFromFirestore, 
  saveCardsToFirestore, 
  subscribeToCardChanges,
  type CardData as FirebaseCardData
} from "@/lib/firebase"
import {
  saveCardsToLocalStorage,
  loadCardsFromLocalStorage,
  hasNewerCardsInLocalStorage
} from "@/lib/local-storage"

interface CardData {
  id: number
  title: string
  subtitle: string
  description: string
  imageUrl: string
  liked: boolean
  date?: string
  colors: {
    primary: string
    secondary: string
    text: string
    shadow: string
  }
}

// Initial cards with the provided images
const initialCards: CardData[] = [
  {
    id: 1,
    title: "FAMILY MEMORIES",
    subtitle: "Temple Visit",
    description: "Exploring beautiful temples together as a family, creating memories that will last a lifetime.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250314-WA0005.jpg-ZsjW2FUAezauEwcNt5jriCeKw2TxxH.jpeg",
    liked: false,
    date: "2024-03-10",
    colors: {
      primary: "#5a3a31",
      secondary: "#8c5b4a",
      text: "#ffffff",
      shadow: "rgba(90, 58, 49, 0.6)",
    },
  },
  {
    id: 2,
    title: "CITY ADVENTURES",
    subtitle: "Urban Exploration",
    description: "Discovering new places and experiencing the city life together.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250314-WA0002.jpg-Nqath6kUCDkjDbPJEFM46RdcromAEu.jpeg",
    liked: false,
    date: "2024-02-15",
    colors: {
      primary: "#1a3a5f",
      secondary: "#2d5f8a",
      text: "#ffffff",
      shadow: "rgba(26, 58, 95, 0.6)",
    },
  },
  {
    id: 3,
    title: "CAFE MOMENTS",
    subtitle: "Quality Time",
    description: "Enjoying the simple pleasures of good food and better company.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250314-WA0004.jpg-Eo5ghpMcHTmVdhrexnf8NTS5I0RX2q.jpeg",
    liked: false,
    date: "",
    colors: {
      primary: "#2d4a22",
      secondary: "#4a7a38",
      text: "#ffffff",
      shadow: "rgba(45, 74, 34, 0.6)",
    },
  },
  {
    id: 4,
    title: "STREET ART",
    subtitle: "Urban Beauty",
    description: "Finding art and beauty in unexpected places during our travels.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250314-WA0006.jpg-1iAGsQwb9uCwanL6eW2pNFS7HtVQXK.jpeg",
    liked: false,
    date: "",
    colors: {
      primary: "#0f2b46",
      secondary: "#1e4976",
      text: "#ffffff",
      shadow: "rgba(15, 43, 70, 0.6)",
    },
  },
  {
    id: 5,
    title: "JAPAN JOURNEY",
    subtitle: "Cultural Exploration",
    description: "Experiencing the rich culture and beautiful architecture of Japan together.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-14%20at%2011.02.54_20d62ce1.jpg-Azqwejs32YQonFgASkOkbAQPC9vs8X.jpeg",
    liked: false,
    date: "",
    colors: {
      primary: "#8c3a31",
      secondary: "#bf5b4a",
      text: "#ffffff",
      shadow: "rgba(140, 58, 49, 0.6)",
    },
  },
  {
    id: 6,
    title: "GRADUATION DAY",
    subtitle: "Proud Moments",
    description: "Celebrating achievements and milestones with the ones who matter most.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250314-WA0003.jpg-tGb3JjYFFzGHpPwzDx7VMKfmrTnxE0.jpeg",
    liked: false,
    date: "",
    colors: {
      primary: "#1a1a1a",
      secondary: "#333333",
      text: "#ffffff",
      shadow: "rgba(0, 0, 0, 0.5)",
    },
  },
  {
    id: 7,
    title: "COLORFUL CUISINE",
    subtitle: "Food Adventures",
    description: "Sharing delicious meals and creating memories around the table.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250314-WA0007.jpg-nur8mcXQHHInwAM57iKbYrdMlSjsLU.jpeg",
    liked: false,
    date: "",
    colors: {
      primary: "#4a3a7a",
      secondary: "#6a5a9a",
      text: "#ffffff",
      shadow: "rgba(74, 58, 122, 0.6)",
    },
  },
  {
    id: 8,
    title: "BEACH DAYS",
    subtitle: "Coastal Memories",
    description: "Enjoying the sun, sand, and sea with the people who make life special.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20220820_142931.jpg-4wdSp2fizrA2fyTVXAvaeyDwPrQZYR.jpeg",
    liked: false,
    date: "",
    colors: {
      primary: "#1a6a8a",
      secondary: "#2a8aaa",
      text: "#ffffff",
      shadow: "rgba(26, 106, 138, 0.6)",
    },
  },
]

// Add new card template
const addNewCardTemplate: CardData = {
  id: 999,
  title: "ADD NEW MEMORY",
  subtitle: "Create a Card",
  description: "Add a new memory to celebrate Mom's special day.",
  imageUrl: "/placeholder.svg?height=400&width=600",
  liked: false,
  date: "",
  colors: {
    primary: "#6d28d9",
    secondary: "#8b5cf6",
    text: "#ffffff",
    shadow: "rgba(109, 40, 217, 0.6)",
  },
}

// Default values for new cards
const DEFAULT_TITLE = "NEW MEMORY"
const DEFAULT_SUBTITLE = "Add Your Title"
const DEFAULT_DESCRIPTION = "Add your description here..."

// Helper function to extract colors from an image
const extractColors = async (
  imageUrl: string,
): Promise<{
  primary: string
  secondary: string
  text: string
  shadow: string
}> => {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.crossOrigin = "Anonymous"
    img.onload = () => {
      try {
        const colorThief = new ColorThief()
        const palette = colorThief.getPalette(img, 2)

        const primary = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`
        const secondary = `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`

        // Determine if we need light or dark text based on the brightness of the primary color
        const brightness = (palette[0][0] * 299 + palette[0][1] * 587 + palette[0][2] * 114) / 1000
        const text = brightness > 125 ? "#000000" : "#ffffff"

        // Create a shadow color from the primary
        const shadow = `rgba(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]}, 0.6)`

        resolve({ primary, secondary, text, shadow })
      } catch (_) {
        // Fallback colors if extraction fails
        resolve({
          primary: "#4a3a7a",
          secondary: "#6a5a9a",
          text: "#ffffff",
          shadow: "rgba(74, 58, 122, 0.6)",
        })
      }
    }
    img.onerror = () => {
      // Fallback colors if image loading fails
      resolve({
        primary: "#4a3a7a",
        secondary: "#6a5a9a",
        text: "#ffffff",
        shadow: "rgba(74, 58, 122, 0.6)",
      })
    }
    img.src = imageUrl
  })
}

// Add a new helper function to generate content based on image analysis
const generateCardContent = (colors: { primary: string; secondary: string }): {
  title: string;
  subtitle: string;
  description: string;
} => {
  // Get RGB values from the primary color
  const primaryRgb = colors.primary.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const [r, g, b] = primaryRgb;
  
  // Determine the dominant color tone
  const max = Math.max(r, g, b);
  let colorTone = '';
  let titlePrefix = '';
  let subtitlePrefix = '';
  
  if (r === max && r > g + 30 && r > b + 30) {
    colorTone = 'warm';
    titlePrefix = 'SUNSET';
    subtitlePrefix = 'Golden Moments';
  } else if (g === max && g > r + 30 && g > b + 30) {
    colorTone = 'natural';
    titlePrefix = 'NATURE';
    subtitlePrefix = 'Green Escapes';
  } else if (b === max && b > r + 30 && b > g + 30) {
    colorTone = 'cool';
    titlePrefix = 'OCEAN';
    subtitlePrefix = 'Blue Horizons';
  } else if (r > 200 && g > 200 && b > 200) {
    colorTone = 'bright';
    titlePrefix = 'BRIGHT DAY';
    subtitlePrefix = 'Sunny Memories';
  } else if (r < 100 && g < 100 && b < 100) {
    colorTone = 'dark';
    titlePrefix = 'EVENING';
    subtitlePrefix = 'Night Adventures';
  } else {
    colorTone = 'balanced';
    titlePrefix = 'SPECIAL DAY';
    subtitlePrefix = 'Precious Moments';
  }
  
  // Generate descriptions based on color tone
  const descriptions = {
    warm: "A beautiful moment captured in warm, golden tones. This memory reminds us of the special bond we share.",
    natural: "Surrounded by nature's beauty, this moment shows our connection to the world around us and to each other.",
    cool: "Cool, calming colors reflect the peaceful moments we cherish together. A perfect day to remember.",
    bright: "Bright and full of light, just like the joy we bring to each other's lives. A truly special memory.",
    dark: "A magical evening to remember, with deep colors that remind us of our adventures together.",
    balanced: "A perfectly balanced moment in time, capturing the essence of our relationship and shared experiences."
  };
  
  return {
    title: titlePrefix + " MEMORY",
    subtitle: subtitlePrefix,
    description: descriptions[colorTone as keyof typeof descriptions]
  };
};

function CardStackContent() {
  const [cards, setCards] = useState<CardData[]>(initialCards)
  const [loading, setLoading] = useState(true)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCard, setEditedCard] = useState<CardData | null>(null)
  const [showAddNewCard, setShowAddNewCard] = useState(false)
  const [newCardData, setNewCardData] = useState({
    title: DEFAULT_TITLE,
    subtitle: DEFAULT_SUBTITLE,
    description: DEFAULT_DESCRIPTION,
    imageUrl: "",
    date: "",
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [cardToDelete, setCardToDelete] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Detect if we're on a mobile device based on screen width
  const [isMobile, setIsMobile] = useState(false)
  
  // Get Firebase auth data
  const { userId, isAuthenticated, isLoading: authLoading } = useFirebase()
  
  const [isUsingFirebase, setIsUsingFirebase] = useState(true)
  const [firebaseError, setFirebaseError] = useState<string | null>(null)
  
  // Update isMobile state based on window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Set initial value
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Combine regular cards with the add new card template
  const allCards = [...cards, addNewCardTemplate]

  // Function to update Firestore when cards change
  const saveCardsToCloud = async (cardsToSave: CardData[]) => {
    // Always save to localStorage as a backup
    saveCardsToLocalStorage(cardsToSave);
    
    if (userId && isUsingFirebase) {
      try {
        await saveCardsToFirestore(cardsToSave);
        setFirebaseError(null);
      } catch (error) {
        console.error("Error saving cards to Firestore:", error);
        setFirebaseError(`Failed to save to Firebase: ${error}`);
        setIsUsingFirebase(false);
      }
    }
  };

  // Load cards on component mount
  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      
      try {
        let loadedCards: CardData[] = [];
        
        // If we have a user ID and Firebase is available, try loading from there first
        if (userId && isUsingFirebase) {
          try {
            loadedCards = await loadCardsFromFirestore();
            console.log('Successfully loaded cards from Firebase:', loadedCards.length);
            
            if (hasNewerCardsInLocalStorage()) {
              // If local cards are newer (offline edits), prefer those
              const localCards = loadCardsFromLocalStorage();
              if (localCards.length > 0) {
                console.log('Found newer cards in localStorage, using those instead');
                loadedCards = localCards;
                // Save these back to Firebase
                saveCardsToFirestore(localCards).catch(console.error);
              }
            }
          } catch (error) {
            console.error('Error loading from Firebase, falling back to localStorage:', error);
            setFirebaseError(`Failed to load from Firebase: ${error}`);
            setIsUsingFirebase(false);
            
            // Fall back to localStorage
            loadedCards = loadCardsFromLocalStorage();
          }
        } else {
          // Just use localStorage
          loadedCards = loadCardsFromLocalStorage();
        }
        
        // If we got cards, use them
        if (loadedCards && loadedCards.length > 0) {
          setCards(loadedCards);
        } else {
          // Use initial cards as a last resort
          console.log('No cards found, using initial cards');
          saveCardsToCloud(initialCards);
        }
      } catch (error) {
        console.error('Error loading cards:', error);
      } finally {
        // Set loading to false after a short delay to ensure smooth animation
        const timer = setTimeout(() => {
          setLoading(false);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    };
    
    fetchCards();
  }, [userId, authLoading, isUsingFirebase]);

  // Set up real-time subscription to card changes
  useEffect(() => {
    if (!userId || !isAuthenticated || !isUsingFirebase) return;
    
    try {
      // Subscribe to real-time updates
      const unsubscribe = subscribeToCardChanges(userId, (updatedCards) => {
        // Update local state with the latest cards from Firestore
        console.log('Received real-time update from Firebase:', updatedCards.length);
        setCards(updatedCards);
        setFirebaseError(null);
      });
      
      return () => {
        // Clean up subscription when component unmounts
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up Firebase subscription:', error);
      setFirebaseError(`Failed to subscribe to Firebase updates: ${error}`);
      setIsUsingFirebase(false);
      return () => {}; // Return empty cleanup function
    }
  }, [userId, isAuthenticated, isUsingFirebase]);

  // Save cards whenever they change
  useEffect(() => {
    // Skip initial load
    if (loading || authLoading) return;
    
    // Sort cards by date (oldest first)
    const sortedCards = [...cards].sort((a, b) => {
      // Cards without dates go to the end
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    // Only update if the order has changed
    if (JSON.stringify(sortedCards.map(c => c.id)) !== JSON.stringify(cards.map(c => c.id))) {
      setCards(sortedCards);
      return; // Skip saving as this will trigger another useEffect run with the sorted cards
    }
    
    // Save to storage
    saveCardsToCloud(cards);
    
  }, [cards, loading, authLoading, userId, isUsingFirebase]);

  const handleCardSwipe = (direction: number) => {
    if (direction < 0) {
      // Swiped left - go to next card (inverted as requested)
      goToNextCard()
    } else {
      // Swiped right - go to previous card (inverted as requested)
      goToPreviousCard()
    }
  }

  const goToNextCard = () => {
    setCurrentCardIndex((prevIndex) => {
      // If we're at the last card (add new card), cycle back to the first card
      if (prevIndex === allCards.length - 1) {
        return 0
      }
      return prevIndex + 1
    })
  }

  const goToPreviousCard = () => {
    setCurrentCardIndex((prevIndex) => {
      // If we're at the first card, cycle to the last card
      if (prevIndex === 0) {
        return allCards.length - 1
      }
      return prevIndex - 1
    })
  }

  const handleAddNewCardClick = () => {
    setShowAddNewCard(true)
  }

  const handleEditClick = (card: CardData) => {
    setEditedCard({ ...card })
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (editedCard) {
      setCards((prevCards) => prevCards.map((card) => (card.id === editedCard.id ? editedCard : card)))
      setIsEditing(false)
      setEditedCard(null)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedCard(null)
  }

  // Add delete card functionality
  const handleDeleteClick = (cardId: number) => {
    setCardToDelete(cardId)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteCard = () => {
    if (cardToDelete === null) return
    
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardToDelete))
    
    // If we're deleting the current card, adjust the current index
    if (currentCardIndex >= cards.length - 1) {
      setCurrentCardIndex(Math.max(0, cards.length - 2))
    }
    
    setShowDeleteConfirm(false)
    setCardToDelete(null)
  }

  const cancelDeleteCard = () => {
    setShowDeleteConfirm(false)
    setCardToDelete(null)
  }

  const handleAddNewCard = async () => {
    if (!newCardData.imageUrl) return

    const maxId = Math.max(...cards.map((card) => card.id), 0)

    // Extract colors from the uploaded image
    const colors = await extractColors(newCardData.imageUrl)
    
    // Check if the user left default values
    const titleIsDefault = newCardData.title === DEFAULT_TITLE
    const subtitleIsDefault = newCardData.subtitle === DEFAULT_SUBTITLE
    const descriptionIsDefault = newCardData.description === DEFAULT_DESCRIPTION
    
    let finalTitle = newCardData.title
    let finalSubtitle = newCardData.subtitle
    let finalDescription = newCardData.description
    
    // If any fields are left as default, generate content based on the image
    if (titleIsDefault || subtitleIsDefault || descriptionIsDefault) {
      const generatedContent = generateCardContent(colors)
      
      if (titleIsDefault) finalTitle = generatedContent.title
      if (subtitleIsDefault) finalSubtitle = generatedContent.subtitle
      if (descriptionIsDefault) finalDescription = generatedContent.description
    }

    const newCard: CardData = {
      id: maxId + 1,
      title: finalTitle,
      subtitle: finalSubtitle,
      description: finalDescription,
      imageUrl: newCardData.imageUrl,
      liked: false,
      date: newCardData.date || "",
      colors,
    }

    setCards((prevCards) => [...prevCards, newCard])
    setShowAddNewCard(false)
    setNewCardData({
      title: DEFAULT_TITLE,
      subtitle: DEFAULT_SUBTITLE,
      description: DEFAULT_DESCRIPTION,
      imageUrl: "",
      date: "",
    })

    // Go to the newly added card
    setCurrentCardIndex(cards.length)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          if (editedCard) {
            setEditedCard({
              ...editedCard,
              imageUrl: event.target.result as string,
            })
          } else {
            setNewCardData({
              ...newCardData,
              imageUrl: event.target.result as string,
            })
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Toggle like status for a card
  const toggleLike = (cardId: number) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId ? { ...card, liked: !card.liked } : card
      )
    )
  }

  // Reset to default values when canceling add new card
  const handleCancelAddNew = () => {
    setNewCardData({
      title: DEFAULT_TITLE,
      subtitle: DEFAULT_SUBTITLE,
      description: DEFAULT_DESCRIPTION,
      imageUrl: "",
      date: "",
    });
    setShowAddNewCard(false);
  };

  // Determine which cards to show
  const visibleCards = allCards.slice(currentCardIndex, currentCardIndex + (isMobile ? 2 : 3))

  return (
    <div className={`relative ${isMobile ? 'h-[450px]' : 'h-[600px]'} w-full`}>
      {/* Loading indicator */}
      {(loading || authLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            <p className="text-sm text-muted-foreground">Loading your memories...</p>
          </div>
        </div>
      )}
      
      {/* Firebase error indicator */}
      {firebaseError && (
        <div className="absolute top-0 right-0 m-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg max-w-xs z-50">
          <p className="text-sm font-semibold mb-1">Firebase Error:</p>
          <p className="text-xs">{firebaseError}</p>
          <p className="text-xs mt-2">Your cards are being saved locally only.</p>
        </div>
      )}

      {/* Card indicator dots - repositioned for better visibility */}
      <div className="absolute -bottom-28 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {allCards.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all shadow-md ${
              currentCardIndex === index 
                ? "bg-white w-6 border border-gray-300 dark:border-gray-700" 
                : "bg-white/70 hover:bg-white border border-gray-200 dark:border-gray-700"
            }`}
            onClick={() => setCurrentCardIndex(index)}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>

      {/* Cards */}
      <div className="relative h-full w-full">
        <AnimatePresence mode="popLayout">
          {visibleCards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              index={index}
              onSwipe={handleCardSwipe}
              onEdit={() => card.id !== 999 && handleEditClick(card)}
              onAddNew={handleAddNewCardClick}
              onToggleLike={toggleLike}
              onDelete={() => card.id !== 999 && handleDeleteClick(card.id)}
              isAddNewCard={card.id === 999}
              totalCards={visibleCards.length}
              isMobile={isMobile}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Card Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          {editedCard && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedCard.title}
                  onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={editedCard.subtitle}
                  onChange={(e) => setEditedCard({ ...editedCard, subtitle: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={editedCard.date || ""}
                  onChange={(e) => setEditedCard({ ...editedCard, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedCard.description}
                  onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="liked">Like Status</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={editedCard.liked ? "default" : "outline"}
                    onClick={() => setEditedCard({ ...editedCard, liked: !editedCard.liked })}
                    className={editedCard.liked ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${editedCard.liked ? "fill-white" : ""}`} />
                    {editedCard.liked ? "Liked" : "Not Liked"}
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image</Label>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={triggerFileInput}>
                    <Image className="mr-2 h-4 w-4" />
                    Change Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {editedCard.imageUrl && (
                  <div className="mt-2 rounded-md overflow-hidden">
                    <img
                      src={editedCard.imageUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Card Dialog */}
      <Dialog open={showAddNewCard} onOpenChange={setShowAddNewCard}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Memory Card</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={newCardData.title}
                onChange={(e) => setNewCardData({ ...newCardData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-subtitle">Subtitle</Label>
              <Input
                id="new-subtitle"
                value={newCardData.subtitle}
                onChange={(e) => setNewCardData({ ...newCardData, subtitle: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-date">Date</Label>
              <Input
                id="new-date"
                type="date"
                value={newCardData.date}
                onChange={(e) => setNewCardData({ ...newCardData, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                value={newCardData.description}
                onChange={(e) => setNewCardData({ ...newCardData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-image">Upload Image</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={triggerFileInput}>
                  <Image className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              {newCardData.imageUrl && (
                <div className="mt-2 rounded-md overflow-hidden">
                  <img
                    src={newCardData.imageUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={handleCancelAddNew}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleAddNewCard} disabled={!newCardData.imageUrl}>
                <Plus className="mr-2 h-4 w-4" />
                Add Card
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Card</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-slate-700 dark:text-slate-300">
              Are you sure you want to delete this memory card? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={cancelDeleteCard}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteCard}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Card
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CardProps {
  card: CardData
  index: number
  onSwipe: (direction: number) => void
  onEdit: () => void
  onAddNew: () => void
  onToggleLike: (cardId: number) => void
  onDelete: () => void
  isAddNewCard: boolean
  totalCards: number
  isMobile: boolean
}

function Card({
  card,
  index,
  onSwipe,
  onEdit,
  onAddNew,
  onToggleLike,
  onDelete,
  isAddNewCard,
  totalCards,
  isMobile,
}: CardProps) {
  // Use reduced motion if the user prefers it in their system settings
  const prefersReducedMotion = useReducedMotion()
  
  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = isMobile ? 50 : 100
    if (Math.abs(info.offset.x) > threshold) {
      onSwipe(info.offset.x)
    }
  }

  // Calculate z-index and offsets for stacked appearance
  const zIndex = totalCards - index
  const yOffset = isMobile ? index * 15 : index * 30
  const xOffset = isMobile ? index * 2 : index * 5
  // Reduced rotation on mobile for better performance
  const rotateZ = isMobile ? index * -1 : index * -2

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: yOffset,
        x: xOffset,
        rotateZ: prefersReducedMotion ? 0 : rotateZ,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2 },
      }}
      transition={{
        // Optimize transitions for mobile
        type: prefersReducedMotion ? "tween" : "spring",
        stiffness: isMobile ? 300 : 500,
        damping: isMobile ? 30 : 50,
        mass: isMobile ? 0.8 : 1,
      }}
      style={{
        boxShadow: `0 ${isMobile ? 5 + index * 3 : 10 + index * 5}px ${isMobile ? 15 + index * 5 : 30 + index * 10}px ${card.colors.shadow}`,
        backgroundColor: card.colors.primary,
        zIndex,
        // Add will-change to optimize rendering
        willChange: 'transform',
      } as any}
      className={`absolute left-0 top-0 h-full w-full cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl dark:border dark:border-slate-700`}
      drag={!prefersReducedMotion} // Disable drag if user prefers reduced motion
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={isMobile ? 0.4 : 0.6} // Reduce elasticity on mobile
      onDragEnd={handleDragEnd}
      whileDrag={{
        scale: isMobile ? 1.02 : 1.05, // Smaller scale change on mobile
      }}
    >
      <motion.div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl"
        style={{ color: card.colors.text } as any}
      >
        {/* Card Header - smaller padding on mobile */}
        <div className={`flex items-center justify-between ${isMobile ? 'p-4' : 'p-4'}`}>
          {/* Only show the heart button if it's not the Add New Memory card */}
          {!isAddNewCard && (
            <button 
              className={`rounded-full bg-opacity-20 ${isMobile ? 'p-1.5' : 'p-2'}`}
              style={{ backgroundColor: `${card.colors.text}20` }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(card.id);
              }}
            >
              {card.liked ? (
                <Heart className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} fill-red-500 text-red-500`} />
              ) : (
                <Heart className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
              )}
            </button>
          )}
          {/* Add an empty div for spacing when the heart is not shown */}
          {isAddNewCard && <div></div>}
          
          {!isAddNewCard && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size={isMobile ? "sm" : "icon"}
                className="rounded-full bg-opacity-20 hover:bg-opacity-30"
                style={{ backgroundColor: `${card.colors.text}20` }}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
              >
                <Edit className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} style={{ color: card.colors.text }} />
                <span className="sr-only">Edit</span>
              </Button>
              
              <Button
                variant="ghost"
                size={isMobile ? "sm" : "icon"}
                className="rounded-full bg-opacity-20 hover:bg-opacity-30"
                style={{ backgroundColor: `${card.colors.text}20` }}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} style={{ color: card.colors.text }} />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )}
        </div>

        {/* Card Title - smaller text on mobile */}
        <div className={`${isMobile ? 'px-4 py-2' : 'px-4 py-2'}`}>
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>{card.title}</h2>
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium`} style={{ color: `${card.colors.text}99` }}>
            {card.subtitle}
          </h3>
        </div>

        {/* Card Image */}
        <div className={`${isMobile ? 'mt-2' : 'mt-2'} overflow-hidden ${isMobile ? 'px-4' : 'px-4'}`}>
          <div
            className="aspect-video w-full overflow-hidden rounded-xl bg-cover bg-center"
            style={{
              backgroundImage: `url(${card.imageUrl})`,
              boxShadow: `0 ${isMobile ? '5px 15px' : '10px 30px'} ${card.colors.shadow}`,
            }}
          />
        </div>

        {/* Card Footer - smaller padding on mobile */}
        <div className={`${isMobile ? 'mt-2 p-4' : 'mt-2 p-4'}`}>
          {isAddNewCard ? (
            <Button
              className="w-full"
              size={isMobile ? "sm" : "default"}
              onClick={(e) => {
                e.stopPropagation()
                onAddNew()
              }}
            >
              <Plus className={`mr-2 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              Add New Memory
            </Button>
          ) : (
            <>
              <div
                className={`rounded-full ${isMobile ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
                style={{
                  backgroundColor: `${card.colors.text}20`,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                {card.liked ? (
                  <Heart className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} fill-red-500 text-red-500`} />
                ) : (
                  <Heart className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                )}
                {card.date || "No date"}
              </div>
              <p className={`${isMobile ? 'mt-1 text-xs leading-tight' : 'mt-2 text-sm'} opacity-80`}>{card.description}</p>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CardStack() {
  // Use the CardStackContent directly
  const cardStackContent = CardStackContent()
  return cardStackContent
}


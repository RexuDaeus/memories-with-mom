"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { Heart, Edit, Plus, Save, X, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CardStackProvider, useCardStack } from "./card-stack-context"
import ColorThief from "colorthief"

interface CardData {
  id: number
  title: string
  subtitle: string
  description: string
  imageUrl: string
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
  colors: {
    primary: "#6d28d9",
    secondary: "#8b5cf6",
    text: "#ffffff",
    shadow: "rgba(109, 40, 217, 0.6)",
  },
}

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

function CardStackContent() {
  const [cards, setCards] = useState<CardData[]>(initialCards)
  const [loading, setLoading] = useState(true)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCard, setEditedCard] = useState<CardData | null>(null)
  const [showAddNewCard, setShowAddNewCard] = useState(false)
  const [newCardData, setNewCardData] = useState({
    title: "NEW MEMORY",
    subtitle: "Add Your Title",
    description: "Add your description here...",
    imageUrl: "",
  })
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isRearranging } = useCardStack()

  // Combine regular cards with the add new card template
  const allCards = [...cards, addNewCardTemplate]

  useEffect(() => {
    // Set loading to false after a short delay to ensure smooth animation
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

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

  const handleAddNewCard = async () => {
    if (!newCardData.imageUrl) return

    const maxId = Math.max(...cards.map((card) => card.id), 0)

    // Extract colors from the uploaded image
    const colors = await extractColors(newCardData.imageUrl)

    const newCard: CardData = {
      id: maxId + 1,
      title: newCardData.title,
      subtitle: newCardData.subtitle,
      description: newCardData.description,
      imageUrl: newCardData.imageUrl,
      colors,
    }

    setCards((prevCards) => [...prevCards, newCard])
    setShowAddNewCard(false)
    setNewCardData({
      title: "NEW MEMORY",
      subtitle: "Add Your Title",
      description: "Add your description here...",
      imageUrl: "",
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

  const handleDragStart = (index: number) => {
    setDraggedCardIndex(index)
  }

  const handleDragOver = (index: number) => {
    if (draggedCardIndex === null || draggedCardIndex === index) return

    // Reorder the cards
    setCards((prevCards) => {
      const newCards = [...prevCards]
      const [draggedCard] = newCards.splice(draggedCardIndex, 1)
      newCards.splice(index, 0, draggedCard)
      return newCards
    })

    // Update the current index if needed
    if (currentCardIndex === draggedCardIndex) {
      setCurrentCardIndex(index)
    } else if (currentCardIndex === index) {
      setCurrentCardIndex(draggedCardIndex > index ? index + 1 : index - 1)
    }

    setDraggedCardIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedCardIndex(null)
  }

  if (loading) {
    return <div className="flex h-96 w-full items-center justify-center">Loading cards...</div>
  }

  // Determine which cards to show
  const visibleCards = isRearranging ? cards : allCards.slice(currentCardIndex, currentCardIndex + 3)

  return (
    <div className="relative h-[600px] w-full">
      {/* Card indicator dots - repositioned for better visibility */}
      <div className="absolute -bottom-20 left-1/2 z-20 flex -translate-x-1/2 gap-2">
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
      <div
        className={`relative h-full w-full ${isRearranging ? "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 overflow-auto pb-8" : ""}`}
      >
        <AnimatePresence mode="popLayout">
          {visibleCards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              index={isRearranging ? 0 : index}
              onSwipe={handleCardSwipe}
              onEdit={() => card.id !== 999 && handleEditClick(card)}
              onAddNew={handleAddNewCardClick}
              isAddNewCard={card.id === 999}
              isRearranging={isRearranging}
              onDragStart={() => handleDragStart(index)}
              onDragOver={() => handleDragOver(index)}
              onDragEnd={handleDragEnd}
              isDragging={draggedCardIndex === index}
              totalCards={visibleCards.length}
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedCard.description}
                  onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                />
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
              <Button variant="outline" onClick={() => setShowAddNewCard(false)}>
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
    </div>
  )
}

interface CardProps {
  card: CardData
  index: number
  onSwipe: (direction: number) => void
  onEdit: () => void
  onAddNew: () => void
  isAddNewCard: boolean
  isRearranging: boolean
  onDragStart: () => void
  onDragOver: () => void
  onDragEnd: () => void
  isDragging: boolean
  totalCards: number
}

function Card({
  card,
  index,
  onSwipe,
  onEdit,
  onAddNew,
  isAddNewCard,
  isRearranging,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  totalCards,
}: CardProps) {
  const handleDragEnd = (_: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element> | React.PointerEvent, info: PanInfo) => {
    if (isRearranging) return

    const threshold = 100
    if (Math.abs(info.offset.x) > threshold) {
      onSwipe(info.offset.x)
    }
  }

  // Calculate z-index and offsets for stacked appearance
  const zIndex = totalCards - index
  const yOffset = index * 30
  const xOffset = index * 5

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: isRearranging ? 0.9 : 1,
        y: isRearranging ? 0 : yOffset,
        x: isRearranging ? 0 : xOffset,
        rotateZ: isRearranging ? 0 : index * -2,
        zIndex: isDragging ? 50 : zIndex,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2 },
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 50,
        mass: 1,
      }}
      style={{
        boxShadow: `0 ${10 + index * 5}px ${30 + index * 10}px ${card.colors.shadow}`,
        backgroundColor: card.colors.primary,
      }}
      className={`${
        isRearranging ? "h-64 cursor-move" : "absolute left-0 top-0 h-full w-full cursor-grab active:cursor-grabbing"
      } overflow-hidden rounded-2xl dark:border dark:border-slate-700`}
      drag={!isRearranging}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      whileDrag={{
        scale: 1.05,
        boxShadow: `0 ${15 + index * 5}px ${40 + index * 10}px ${card.colors.shadow}`,
      }}
      draggable={isRearranging}
      onDragStart={isRearranging ? onDragStart : undefined}
      onDragOver={isRearranging ? onDragOver : undefined}
      onDragEndCapture={isRearranging ? onDragEnd : undefined}
    >
      <motion.div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl"
        style={{ color: card.colors.text }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between p-4">
          <div className="rounded-full bg-opacity-20 p-2" style={{ backgroundColor: `${card.colors.text}20` }}>
            <Heart className="h-5 w-5" />
          </div>
          {!isAddNewCard && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-opacity-20 hover:bg-opacity-30"
              style={{ backgroundColor: `${card.colors.text}20` }}
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Edit className="h-4 w-4" style={{ color: card.colors.text }} />
              <span className="sr-only">Edit</span>
            </Button>
          )}
        </div>

        {/* Card Title */}
        <div className="px-4 py-2">
          <h2 className="text-3xl font-bold">{card.title}</h2>
          <h3 className="text-xl font-medium" style={{ color: `${card.colors.text}99` }}>
            {card.subtitle}
          </h3>
        </div>

        {/* Card Image */}
        <div className="mt-2 overflow-hidden px-4">
          <div
            className="aspect-video w-full overflow-hidden rounded-xl bg-cover bg-center"
            style={{
              backgroundImage: `url(${card.imageUrl})`,
              boxShadow: `0 10px 30px ${card.colors.shadow}`,
            }}
          />
        </div>

        {/* Card Footer */}
        <div className="mt-auto p-4">
          {isAddNewCard ? (
            <Button
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                onAddNew()
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Memory
            </Button>
          ) : (
            <>
              <div
                className="rounded-full px-3 py-1 text-sm"
                style={{
                  backgroundColor: `${card.colors.text}20`,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <Heart className="h-4 w-4" />
                {card.subtitle}
              </div>
              <p className="mt-3 text-sm opacity-80">{card.description}</p>
            </>
          )}
        </div>

        {/* Drag indicator for the top card */}
        {index === 0 && !isRearranging && !isAddNewCard && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center">
            <motion.div
              className="h-1 w-10 rounded-full"
              style={{ backgroundColor: `${card.colors.text}40` }}
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function CardStack() {
  return (
    <CardStackProvider>
      <CardStackContent />
    </CardStackProvider>
  )
}


"use client"

import React, { createContext, useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import { MoveVertical } from "lucide-react"
import { createPortal } from "react-dom"

interface CardStackContextType {
  isRearranging: boolean
  toggleRearrangeMode: () => void
}

const CardStackContext = createContext<CardStackContextType | undefined>(undefined)

export function useCardStack() {
  const context = useContext(CardStackContext)
  if (context === undefined) {
    throw new Error("useCardStack must be used within a CardStackProvider")
  }
  return context
}

export function CardStackProvider({ children }: { children: React.ReactNode }) {
  const [isRearranging, setIsRearranging] = useState(false)

  const toggleRearrangeMode = () => {
    setIsRearranging(!isRearranging)
  }

  return (
    <CardStackContext.Provider value={{ isRearranging, toggleRearrangeMode }}>
      {children}
      <RearrangeButton isRearranging={isRearranging} toggleRearrangeMode={toggleRearrangeMode} />
    </CardStackContext.Provider>
  )
}

function RearrangeButton({
  isRearranging,
  toggleRearrangeMode,
}: {
  isRearranging: boolean
  toggleRearrangeMode: () => void
}) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  const controlsContainer = document.getElementById("card-stack-controls")
  if (!controlsContainer) return null

  return createPortal(
    <Button
      variant="outline"
      className="flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-sm"
      onClick={toggleRearrangeMode}
    >
      <MoveVertical className="h-4 w-4" />
      <span>{isRearranging ? "Done Rearranging" : "Rearrange Cards"}</span>
    </Button>,
    controlsContainer,
  )
}


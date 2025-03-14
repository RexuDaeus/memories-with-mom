"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, orientation = "horizontal", ...props }, ref) => {
  const isVertical = orientation === "vertical"
  
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex touch-none select-none",
        isVertical ? "h-full flex-col items-center" : "w-full items-center",
        className
      )}
      orientation={orientation}
      {...props}
    >
      <SliderPrimitive.Track 
        className={cn(
          "relative overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700",
          isVertical ? "h-full w-1.5" : "h-1.5 w-full grow"
        )}
      >
        <SliderPrimitive.Range 
          className={cn(
            "absolute bg-slate-900 dark:bg-slate-400",
            isVertical ? "w-full" : "h-full"
          )}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-slate-200 bg-white shadow-sm ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300" />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider } 
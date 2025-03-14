"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<any>(null)

  // Track if YouTube API is loaded
  const [ytApiLoaded, setYtApiLoaded] = useState(false)

  // Load YouTube API
  useEffect(() => {
    if (typeof window !== "undefined" && !window.YT) {
      // Add YouTube API script
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      // Callback when YouTube API is ready
      window.onYouTubeIframeAPIReady = () => {
        setYtApiLoaded(true)
      }
    } else if (typeof window !== "undefined" && window.YT) {
      setYtApiLoaded(true)
    }

    // Listen for user interaction
    const handleInteraction = () => {
      setUserInteracted(true)
    }

    window.addEventListener("click", handleInteraction)
    window.addEventListener("keydown", handleInteraction)
    window.addEventListener("touchstart", handleInteraction)

    return () => {
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("keydown", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
      
      // Clean up YouTube API callback
      if (typeof window !== "undefined") {
        window.onYouTubeIframeAPIReady = null
      }
    }
  }, [])

  // Initialize player when API is loaded and user has interacted
  useEffect(() => {
    if (ytApiLoaded && userInteracted && !playerRef.current) {
      playerRef.current = new window.YT.Player("youtube-audio", {
        videoId: "neV3EPgvZ3g", // Video ID from the provided YouTube URL
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: (event) => {
            // Set volume to 40%
            event.target.setVolume(40)
            // Don't autoplay initially
          },
        },
      })
    }
  }, [ytApiLoaded, userInteracted])

  const togglePlayback = () => {
    if (!playerRef.current) return

    if (playing) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }

    setPlaying(!playing)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Hidden iframe for YouTube player */}
      <div className="hidden">
        <div id="youtube-audio"></div>
      </div>
      
      <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 rounded-full p-2 backdrop-blur-sm shadow-md">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-white/90 dark:bg-slate-700/90 hover:bg-white dark:hover:bg-slate-600"
          onClick={togglePlayback}
          disabled={!userInteracted || !ytApiLoaded}
          title={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause className="h-5 w-5 text-slate-900 dark:text-white" />
          ) : (
            <Play className="h-5 w-5 text-slate-900 dark:text-white" />
          )}
        </Button>
        <Volume2 className="h-4 w-4 text-slate-600 dark:text-slate-300 mr-1" />
      </div>
    </div>
  )
}

// Add TypeScript declarations for YouTube API
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string
          playerVars?: {
            autoplay?: number
            controls?: number
            disablekb?: number
            fs?: number
            iv_load_policy?: number
            modestbranding?: number
            rel?: number
            showinfo?: number
          }
          events?: {
            onReady?: (event: { target: any }) => void
          }
        }
      ) => {
        pauseVideo: () => void
        playVideo: () => void
        setVolume: (volume: number) => void
      }
    }
    onYouTubeIframeAPIReady: (() => void) | null
  }
} 
"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Volume1 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const [volume, setVolume] = useState(40) // Initial volume 40%
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<any>(null)
  const volumeControlRef = useRef<HTMLDivElement>(null)

  // Track if YouTube API is loaded
  const [ytApiLoaded, setYtApiLoaded] = useState(false)

  // Handle click outside volume controls
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target as Node)) {
        setShowVolumeSlider(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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

    // Simulate user interaction to enable autoplay
    const simulateUserInteraction = () => {
      setUserInteracted(true)
    }

    // Listen for real user interaction as backup
    window.addEventListener("click", simulateUserInteraction)
    window.addEventListener("keydown", simulateUserInteraction)
    window.addEventListener("touchstart", simulateUserInteraction)

    // Automatically set userInteracted to true after a short delay
    // Some browsers will still require a real interaction
    const timer = setTimeout(simulateUserInteraction, 1000)

    return () => {
      window.removeEventListener("click", simulateUserInteraction)
      window.removeEventListener("keydown", simulateUserInteraction)
      window.removeEventListener("touchstart", simulateUserInteraction)
      clearTimeout(timer)
      
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
          autoplay: 1, // Try to autoplay
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
            event.target.setVolume(volume)
            // Try to play automatically
            event.target.playVideo()
            setPlaying(true)
          },
          onStateChange: (event) => {
            // Update playing state based on player state
            setPlaying(event.data === window.YT.PlayerState.PLAYING)
          },
        },
      })
    }
  }, [ytApiLoaded, userInteracted, volume])

  // Update volume when slider changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume)
    }
  }, [volume])

  const togglePlayback = () => {
    if (!playerRef.current) return

    if (playing) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }

    setPlaying(!playing)
  }

  const toggleVolumeControls = () => {
    setShowVolumeSlider(!showVolumeSlider)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  // Get the appropriate volume icon based on level
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4 text-slate-600 dark:text-slate-300" />
    if (volume < 50) return <Volume1 className="h-4 w-4 text-slate-600 dark:text-slate-300" />
    return <Volume2 className="h-4 w-4 text-slate-600 dark:text-slate-300" />
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
        
        {/* Volume controls */}
        <div ref={volumeControlRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={toggleVolumeControls}
            title="Adjust Volume"
          >
            <VolumeIcon />
          </Button>
          
          {showVolumeSlider && (
            <div className="absolute -top-24 -left-12 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md">
              <div className="w-32 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 dark:text-slate-300">Volume: {volume}%</span>
                  {volume > 0 ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setVolume(0)}
                      title="Mute"
                    >
                      <VolumeX className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setVolume(40)}
                      title="Unmute"
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
          )}
        </div>
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
            onStateChange?: (event: { data: number }) => void
          }
        }
      ) => {
        pauseVideo: () => void
        playVideo: () => void
        setVolume: (volume: number) => void
      }
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
        BUFFERING: number
      }
    }
    onYouTubeIframeAPIReady: (() => void) | null
  }
} 
import CardStack from "@/components/card-stack"
import { ThemeToggle } from "@/components/theme-toggle"
import AudioPlayer from "@/components/audio-player"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Enhanced background patterns with animation */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-slate-950 dark:to-purple-950">
        {/* Enhanced animated floating elements - light mode - faster and wider movement */}
        <div className="animate-float-fast animate-pulse absolute -top-40 -right-40 h-120 w-120 rounded-full bg-pink-200 opacity-70 blur-2xl dark:hidden"></div>
        <div className="animate-float-medium animate-pulse absolute top-1/4 -left-40 h-100 w-100 rounded-full bg-purple-200 opacity-70 blur-2xl dark:hidden"></div>
        <div className="animate-float-fast animate-pulse absolute bottom-0 right-1/4 h-110 w-110 rounded-full bg-blue-200 opacity-70 blur-2xl dark:hidden"></div>

        {/* Enhanced animated floating elements - dark mode - faster and wider movement */}
        <div className="animate-float-fast animate-pulse absolute -top-40 -right-40 hidden h-120 w-120 rounded-full bg-purple-700 opacity-30 blur-2xl dark:block"></div>
        <div className="animate-float-medium animate-pulse absolute top-1/4 -left-40 hidden h-100 w-100 rounded-full bg-pink-700 opacity-30 blur-2xl dark:block"></div>
        <div className="animate-float-fast animate-pulse absolute bottom-0 right-1/4 hidden h-110 w-110 rounded-full bg-indigo-700 opacity-30 blur-2xl dark:block"></div>

        {/* Additional enhanced floating elements - visible in both themes - faster and wider movement */}
        <div className="animate-float-fast animate-pulse absolute top-1/3 right-1/3 h-80 w-80 rounded-full bg-pink-300 opacity-60 blur-2xl dark:bg-pink-800 dark:opacity-20"></div>
        <div className="animate-float-medium animate-pulse absolute bottom-1/4 left-1/4 h-90 w-90 rounded-full bg-purple-300 opacity-50 blur-2xl dark:bg-purple-800 dark:opacity-20"></div>
        
        {/* New floating elements for additional motion and color - faster and wider movement */}
        <div className="animate-float-fast animate-pulse absolute top-2/3 right-1/4 h-70 w-70 rounded-full bg-indigo-200 opacity-60 blur-2xl dark:bg-indigo-800 dark:opacity-20"></div>
        <div className="animate-float-fast animate-pulse absolute top-1/2 left-1/2 h-75 w-75 rounded-full bg-rose-200 opacity-50 blur-2xl dark:bg-rose-800 dark:opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Rearrange button moved to top */}
        <div className="absolute top-4 left-4 z-50">
          <CardStackControls />
        </div>

        <h1 className="mb-8 font-cursive text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
          Memories with Mom
        </h1>
        <div className="w-full max-w-md">
          <CardStack />
        </div>
      </div>

      {/* Add Audio Player */}
      <AudioPlayer />
    </main>
  )
}

// Separate component for card stack controls
function CardStackControls() {
  // This will be populated by the card stack component using React Context
  return <div id="card-stack-controls"></div>
}


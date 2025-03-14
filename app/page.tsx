import CardStack from "@/components/card-stack"
import { ThemeToggle } from "@/components/theme-toggle"
import AudioPlayer from "@/components/audio-player"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Enhanced background patterns with animation */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-slate-950 dark:to-purple-950">
        {/* Enhanced animated floating elements - light mode */}
        <div className="animate-float-slow animate-pulse absolute -top-24 -right-24 h-96 w-96 rounded-full bg-pink-200 opacity-70 blur-2xl dark:hidden"></div>
        <div className="animate-float-medium animate-pulse absolute top-1/4 -left-24 h-80 w-80 rounded-full bg-purple-200 opacity-70 blur-2xl dark:hidden"></div>
        <div className="animate-float-fast animate-pulse absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-200 opacity-70 blur-2xl dark:hidden"></div>

        {/* Enhanced animated floating elements - dark mode */}
        <div className="animate-float-slow animate-pulse absolute -top-24 -right-24 hidden h-96 w-96 rounded-full bg-purple-700 opacity-30 blur-2xl dark:block"></div>
        <div className="animate-float-medium animate-pulse absolute top-1/4 -left-24 hidden h-80 w-80 rounded-full bg-pink-700 opacity-30 blur-2xl dark:block"></div>
        <div className="animate-float-fast animate-pulse absolute bottom-0 right-1/4 hidden h-96 w-96 rounded-full bg-indigo-700 opacity-30 blur-2xl dark:block"></div>

        {/* Additional enhanced floating elements - visible in both themes */}
        <div className="animate-float-slow animate-pulse absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-pink-300 opacity-60 blur-2xl dark:bg-pink-800 dark:opacity-20"></div>
        <div className="animate-float-medium animate-pulse absolute bottom-1/4 left-1/4 h-72 w-72 rounded-full bg-purple-300 opacity-50 blur-2xl dark:bg-purple-800 dark:opacity-20"></div>
        
        {/* New floating elements for additional motion and color */}
        <div className="animate-float-fast animate-pulse absolute top-2/3 right-1/4 h-48 w-48 rounded-full bg-indigo-200 opacity-60 blur-2xl dark:bg-indigo-800 dark:opacity-20"></div>
        <div className="animate-float-slow animate-pulse absolute top-1/2 left-1/2 h-56 w-56 rounded-full bg-rose-200 opacity-50 blur-2xl dark:bg-rose-800 dark:opacity-20"></div>
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


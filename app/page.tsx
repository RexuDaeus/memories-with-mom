import CardStack from "@/components/card-stack"
import { ThemeToggle } from "@/components/theme-toggle"
import AudioPlayer from "@/components/audio-player"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background patterns with animation */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-slate-950 dark:to-purple-950">
        {/* Animated floating elements - light mode */}
        <div className="animate-float-slow absolute -top-24 -right-24 h-96 w-96 rounded-full bg-pink-100 opacity-60 blur-3xl dark:hidden"></div>
        <div className="animate-float-medium absolute top-1/4 -left-24 h-64 w-64 rounded-full bg-purple-100 opacity-60 blur-3xl dark:hidden"></div>
        <div className="animate-float-fast animate-pulse absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-blue-100 opacity-60 blur-3xl dark:hidden"></div>

        {/* Animated floating elements - dark mode */}
        <div className="animate-float-slow absolute -top-24 -right-24 hidden h-96 w-96 rounded-full bg-purple-900 opacity-20 blur-3xl dark:block"></div>
        <div className="animate-float-medium absolute top-1/4 -left-24 hidden h-64 w-64 rounded-full bg-pink-900 opacity-20 blur-3xl dark:block"></div>
        <div className="animate-float-fast animate-pulse absolute bottom-0 right-1/4 hidden h-80 w-80 rounded-full bg-indigo-900 opacity-20 blur-3xl dark:block"></div>

        {/* Additional floating elements */}
        <div className="animate-float-slow animate-pulse absolute top-1/3 right-1/3 h-48 w-48 rounded-full bg-yellow-100 opacity-40 blur-3xl dark:hidden dark:bg-yellow-900 dark:opacity-10"></div>
        <div className="animate-float-medium absolute bottom-1/4 left-1/4 h-56 w-56 rounded-full bg-teal-100 opacity-30 blur-3xl dark:hidden dark:bg-teal-900 dark:opacity-10"></div>
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


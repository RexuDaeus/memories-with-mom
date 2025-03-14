import CardStack from "@/components/card-stack"
import { ThemeToggle } from "@/components/theme-toggle"
import AudioPlayer from "@/components/audio-player"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background patterns with animation */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-slate-950 dark:to-purple-950">
        {/* Animated floating elements - light mode */}
        <div className="animate-float-slow animate-pulse absolute -top-40 -right-40 h-96 w-96 rounded-full bg-pink-200 opacity-70 blur-2xl dark:hidden"></div>
        <div className="animate-float-medium animate-pulse absolute top-1/4 -left-40 h-96 w-96 rounded-full bg-purple-200 opacity-70 blur-2xl dark:hidden"></div>
        <div className="animate-float-slow animate-pulse absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-200 opacity-70 blur-2xl dark:hidden"></div>

        {/* Animated floating elements - dark mode */}
        <div className="animate-float-slow animate-pulse absolute -top-40 -right-40 hidden h-96 w-96 rounded-full bg-purple-700 opacity-30 blur-2xl dark:block"></div>
        <div className="animate-float-medium animate-pulse absolute top-1/4 -left-40 hidden h-96 w-96 rounded-full bg-pink-700 opacity-30 blur-2xl dark:block"></div>
        <div className="animate-float-slow animate-pulse absolute bottom-0 right-1/4 hidden h-96 w-96 rounded-full bg-indigo-700 opacity-30 blur-2xl dark:block"></div>

        {/* Additional floating elements - visible in both themes */}
        <div className="animate-float-medium animate-pulse absolute top-1/3 right-1/3 h-80 w-80 rounded-full bg-pink-300 opacity-60 blur-2xl dark:bg-pink-800 dark:opacity-20"></div>
        <div className="animate-float-slow animate-pulse absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-purple-300 opacity-50 blur-2xl dark:bg-purple-800 dark:opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
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


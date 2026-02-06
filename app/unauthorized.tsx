"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Lock, LogIn, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Unauthorized() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-100 to-white dark:from-indigo-950 dark:via-slate-950 dark:to-black px-4">

      {/* Ambient glow */}
      <div className="absolute -top-32 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-400/10" />

      <Card
        className={`
          relative w-full max-w-md
          border border-white/20 dark:border-white/10
          bg-white/70 dark:bg-slate-900/70
          backdrop-blur-xl
          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
          transition-all duration-700
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        <CardContent className="px-8 py-10 text-center space-y-8">

          {/* Icon */}
          <div
            className={`
              mx-auto flex h-16 w-16 items-center justify-center rounded-full
              bg-gradient-to-br from-indigo-600 to-blue-600
              shadow-lg shadow-indigo-500/30
              transition-all duration-700 delay-150
              ${mounted ? "scale-100 opacity-100" : "scale-75 opacity-0"}
            `}
          >
            <Lock className="h-8 w-8 text-white" />
          </div>

          {/* Heading */}
          <div
            className={`
              space-y-2 transition-all duration-700 delay-300
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
            `}
          >
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Access Restricted
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              You don’t have permission to view this page.  
              Please sign in with an authorized account.
            </p>
          </div>

          {/* Actions */}
          <div
            className={`
              flex flex-col gap-3 transition-all duration-700 delay-500
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
            `}
          >
            <Link href="/login">
              <Button
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/30"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Button>
            </Link>

            <Link href="/">
              <Button
                size="lg"
                variant="ghost"
                className="w-full text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Button>
            </Link>
          </div>

          {/* Footer hint */}
          <p
            className={`
              text-xs text-slate-500 transition-all duration-700 delay-700
              ${mounted ? "opacity-100" : "opacity-0"}
            `}
          >
            If you believe this is a mistake, contact your administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

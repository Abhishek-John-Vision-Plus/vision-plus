'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl overflow-hidden">
        <div className="h-2 bg-amber-500" />
        <CardHeader className="text-center pt-10 pb-6">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-amber-600" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
            Something went wrong!
          </CardTitle>
          <p className="text-slate-500 mt-2 font-medium">
            An unexpected error occurred. Our team has been notified and we are working to fix it.
          </p>
          {error.digest && (
            <p className="text-[10px] text-slate-400 mt-2 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </CardHeader>
        <CardContent className="px-10 pb-10 space-y-4">
          <Button 
            onClick={() => reset()}
            className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-lg shadow-lg transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try again
          </Button>
          <Button asChild variant="outline" className="w-full h-14 border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-2xl text-lg transition-all active:scale-95">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

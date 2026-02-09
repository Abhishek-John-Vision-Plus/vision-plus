'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Home } from "lucide-react"
import Link from "next/link"
import Image from 'next/image'

interface ErrorDisplayProps {
  error: Error | string;
  reset?: () => void;
  digest?: string;
  title?: string;
  message?: string;
}

export default function ErrorDisplay({ 
  error, 
  reset, 
  digest, 
  title = "Something went wrong!",
  message
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : (message || error.message || "An unexpected error occurred.");
  const errorDigest = digest || (typeof error !== 'string' ? (error as any).digest : undefined);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl overflow-hidden">
        <div className="h-2 bg-amber-500" />
        <CardHeader className="text-center pt-10 pb-6">
          <div className="  flex items-center justify-center  -mb6 ">
            <Image 
              src="/er.gif" 
              alt="Error" 
              width={180} 
              height={160} 
              className="object-contain"
              unoptimized={true} // GIFs often need this in Next.js Image
            />
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </CardTitle>
          <p className="text-slate-500 mt-2 font-medium px-4">
            {errorMessage}
          </p>
          {errorDigest && (
            <p className="text-[10px] text-slate-400 mt-2 font-mono">
              Error ID: {errorDigest}
            </p>
          )}
        </CardHeader>
        <CardContent className="px-10 pb-10 space-y-4">
          {reset ? (
            <Button 
              onClick={() => reset()}
              className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-lg shadow-lg transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try again
            </Button>
          ) : (
            <Button 
              onClick={() => window.location.reload()}
              className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-lg shadow-lg transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Refresh Page
            </Button>
          )}
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

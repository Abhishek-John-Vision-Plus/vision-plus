'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion, Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl overflow-hidden">
        <div className="h-2 bg-indigo-500" />
        <CardHeader className="text-center pt-10 pb-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-10 h-10 text-indigo-600" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
            Page Not Found
          </CardTitle>
          <p className="text-slate-500 mt-2 font-medium">
            Oops! The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </CardHeader>
        <CardContent className="px-10 pb-10 space-y-4">
          <Button asChild className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-lg shadow-lg transition-all active:scale-95">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </Button>
          <div className="pt-4 text-center">
            <p className="text-sm text-slate-400 font-medium flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              Try checking the URL or return to dashboard
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

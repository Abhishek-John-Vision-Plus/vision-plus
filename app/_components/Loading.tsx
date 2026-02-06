'use client'

import React from 'react'
import Image from 'next/image'

interface LoadingProps {
  message?: string
  fullScreen?: boolean
}

export default function Loading({ message = "Loading...", fullScreen = true }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-[9999] ${fullScreen ? 'fixed inset-0' : 'w-full py-12'}`}>
      <div className="relative w-24 h-24 mb-4">
        {/* You can replace '/loading.gif' with your actual GIF path in the public folder */}
        <Image 
          src="/loading.gif" 
          alt="Loading..." 
          fill
          className="object-contain"
          unoptimized // Required for GIFs in Next.js Image component
          onError={(e) => {
            // Fallback if GIF is missing: show a stylish spinner
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const spinner = document.createElement('div');
              spinner.className = 'w-16 h-16 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin';
              parent.appendChild(spinner);
            }
          }}
        />
      </div>
      <div className="flex flex-col items-center">
        <p className="text-slate-900 font-black text-xl tracking-tight uppercase italic animate-pulse">
          {message}
        </p>
        <div className="flex gap-1 mt-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}

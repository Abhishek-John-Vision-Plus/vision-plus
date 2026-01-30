'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import Image from 'next/image'
import { MapPin, ArrowRight, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Carasoul from './Carasoul'
import { Badge } from '@/components/ui/badge'
import { UserDetailsForm } from './UserDetails'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

function Hero({ webData, style }: any) {
  const { user } = useAuth();
  const router = useRouter()
  const [showDetailsForm, setShowDetailsForm] = useState(false)

  const currentStyle = webData?.style || style || {
    primary_color: "#1e3a8a",
    secondary_color: "#475569",
    accent_color: "#f8fafc"
  };

  const handleAssessmentClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowDetailsForm(true)
  }

  const handleFormSubmit = (details: any) => {
    setShowDetailsForm(false)
    router.push('/Test')
  }

  return (
    <section className="relative w-full max-h-6xl p-6 overflow-hidden bg-slate-950">
      {/* User Details Modal */}
      <AnimatePresence>
        {showDetailsForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <UserDetailsForm 
              onSubmit={handleFormSubmit}
              onCancel={() => setShowDetailsForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Carousel - Full screen */}
      <div className="absolute inset-0 z-0 h-5xl">
        <Carasoul images={webData?.images} style={currentStyle} />
      </div>

      {/* Content Container - Cinematic Layout */}
      <div className="relative z-20 h-full w-full flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-24">
        <div className="max-w-4xl space-y-12 md:space-y-16">
          {/* Top Section: Logo & Status */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-5"
          >
            {webData?.images?.logo && (
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl backdrop-blur-xl border border-white/10   shadow-2xl isolate overflow-hidden">
                <div className="relative w-full h-full mix-blend-multiply">
                  <Image 
                    src={webData.images.logo } 
                    alt="Logo" 
                    fill
                    className="object-fill  contrast-[1.1] brightness-[1.2] saturate-[1.2] rounded-3xl "
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Badge 
                className="w-fit bg-white/20 hover:bg-white/20 text-white/80 border-white/10 px-3 py-0.5 text-[10px] uppercase tracking-[0.2em] font-black"
              >
                Official Portal
              </Badge>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase">
                {webData?.name}
              </h3>
            </div>
          </motion.div>

          {/* Main Hero Text */}
          <div className="space-y-6 md:space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl"
            >
              {webData?.headings?.hero_title || webData?.name}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl lg:text-3xl text-white max-w-2xl font-bold  leading-tight" 
          
            >
              {webData?.headings?.hero_subtitle || webData?.description}
            </motion.p>

            {/* CTA Buttons - Stacked on mobile, row on desktop */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              
              {!user ? (
                <Button 
                  onClick={() => router.push('/login')}
                  className="h-14 md:h-16 px-10 rounded-full font-black text-base md:text-lg transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl group"
                  style={{ 
                    backgroundColor: currentStyle.primary_color,
                    color: currentStyle.accent_color,
                  }}
                >
                  Login to your Department
                  <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              ) : (
                user?.role !== 'SUPER_ADMIN' && user?.role !== 'ADMIN' && webData?.links?.website && (
                  <Button 
                    onClick={handleAssessmentClick}
                    className="h-14 md:h-16 px-10 rounded-full font-black text-base md:text-lg transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl group"
                    style={{ 
                      backgroundColor: currentStyle.primary_color,
                      color: currentStyle.accent_color,
                    }}
                  >
                    Start Assessment
                    <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                )
              )}
             
              <Button 
                variant="outline"
                className="h-14 md:h-16 px-10 rounded-full bg-white/5 hover:bg-white/10 border-white/20 text-white font-black text-base md:text-lg backdrop-blur-xl transition-all duration-500 hover:scale-105 active:scale-95 group"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Details
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
          </div>

          {/* Location Badge - Enhanced pill design showing all locations */}
          {/* {webData?.locations && webData.locations.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl border border-white/10 p-1.5 pr-8 rounded-full w-fit group hover:bg-white/10 transition-all duration-500 shadow-2xl"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-[360deg]"
                style={{ backgroundColor: currentStyle.primary_color }}
              >
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1">
                  Service Locations
                </span>
                <span className="text-xl font-black text-white uppercase tracking-tighter leading-none flex items-center gap-2">
                  {webData?.locations?.join(' | ')}
                </span>
                

              </div>
            </motion.div>
          )} */}
            {webData?.locations && webData.locations.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-wrap gap-3"
                >
                  {webData.locations.map((location: string, idx: number) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 px-5 py-3 rounded-full transition-all duration-300 shadow-lg"
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: currentStyle.primary_color }}
                      >
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-base font-bold text-white">
                        {location}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
        </div>
      </div>

      {/* Vertical Scroll Indicator - Bottom Right */}
      <div className="absolute bottom-12 right-6 md:right-12 flex flex-col items-center gap-4 z-30">
        <div className="relative h-24 w-px bg-white/20 overflow-hidden">
          <motion.div 
            animate={{ y: [0, 96] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-white to-transparent"
          />
        </div>
        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] [writing-mode:vertical-lr]">
          Scroll
        </span>
      </div>

      {/* Subtle vignette for depth */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.3)] z-10" />
    </section>
  )
}

export default Hero
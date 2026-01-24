import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Autoplay from "embla-carousel-autoplay"
import { motion, AnimatePresence } from 'framer-motion'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from '@/lib/utils'

function Carasoul({ images, style }: any) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [progress, setProgress] = useState(0)

  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  )

  const imagesArray = Array.isArray(images) 
    ? images 
    : typeof images === 'object' && images !== null
      ? Object.entries(images)
          .filter(([key]) => key !== 'logo')
          .map(([key, value]) => ({
            url: typeof value === 'string' ? value : (value as any)?.url,
            alt: key
          }))
      : [];

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
      setProgress(0)
    })
  }, [api])

  useEffect(() => {
    if (!api || !plugin.current) return
    const interval = setInterval(() => {
      if (plugin.current.isPlaying()) {
        setProgress((prev) => {
          if (prev >= 100) return 0
          return prev + (100 / (6000 / 100))
        })
      }
    }, 100)
    return () => clearInterval(interval)
  }, [api])

  if (imagesArray.length === 0) return null;

  return (
    <div className="relative w-full h-auto group">
      <Carousel 
        setApi={setApi}
        className="w-full h-full"
        plugins={[plugin.current]}
        opts={{
          loop: true,
          align: "start",
          duration: 30,
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-auto blur-xs">
          {imagesArray.map((image: any, index: number) => (
            <CarouselItem key={index} className="pl-0 h-full relative">
              <div className="relative w-full h-full min-h-screen">
                <AnimatePresence mode="wait">
                  {current === index && (
                    <motion.div
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute inset-0"
                    >
                      <Image 
                        src={image?.url || '/placeholder.svg'} 
                        alt={image?.alt || `Slide ${index + 1}`} 
                        fill
                        priority={index === 0}
                        className="object-fill  "
                        sizes="100vw"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Optimized gradient - Images highly visible */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {/* Left gradient for text readability */}
                  <div 
                    className="absolute inset-y-0 left-0 w-full lg:w-3/5"
                    style={{
                      background: `linear-gradient(to right, ${style?.primary_color || '#1e3a8a'}99 0%, ${style?.primary_color || '#1e3a8a'}66 20%, ${style?.primary_color || '#1e3a8a'}33 40%, transparent 60%)`,
                    }}
                  />
                  
                  {/* Bottom gradient for bottom content */}
                  <div 
                    className="absolute inset-x-0 bottom-0 h-1/4"
                    style={{
                      background: `linear-gradient(to top, ${style?.primary_color || '#1e3a8a'}99 0%, ${style?.primary_color || '#1e3a8a'}66 50%, transparent)`,
                    }}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Cinematic Navigation Controls - Right Side */}
        <div className="absolute bottom-12 right-6 md:right-12 lg:right-16 flex flex-col items-end gap-6 z-30">
          {/* Progress Bars - Horizontal Lines */}
          <div className="flex gap-2 items-center">
            {imagesArray.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-1 rounded-full transition-all duration-500 relative overflow-hidden",
                  current === i ? "w-12 bg-white" : "w-6 bg-white/20 hover:bg-white/40"
                )}
              >
                {current === i && (
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Navigation Arrows - Rounded Glassmorphism */}
          <div className="flex gap-3">
            <CarouselPrevious 
              className="static translate-y-0 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl" 
            />
            <CarouselNext 
              className="static translate-y-0 h-12 w-12 rounded-full border-none text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95" 
              style={{
                backgroundColor: style?.primary_color || '#1e3a8a',
              }}
            />
          </div>
        </div>

        {/* Counter Overlay - Refined */}
        {/* <div className="absolute top-12 right-6 md:right-12 lg:right-16 z-30">
          <div className="flex items-baseline gap-2 font-black tracking-tighter">
            <span className="text-5xl md:text-7xl text-white drop-shadow-2xl">
              {String(current + 1).padStart(2, '0')}
            </span>
            <span className="text-xl md:text-2xl text-white/30">
              / {String(count).padStart(2, '0')}
            </span>
          </div>
        </div> */}
      </Carousel>
    </div>
  )
}

export default Carasoul
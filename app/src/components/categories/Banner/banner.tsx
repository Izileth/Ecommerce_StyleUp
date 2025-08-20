import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "~/src/lib/utils"

interface CategoryBannerProps {
  category: string
  title?: string
  description?: string
  imageUrl?: string
  videoUrl?: string
  overlayOpacity?: number
  textPosition?: "left" | "center" | "right"
  textColor?: "light" | "dark"
  className?: string
  children?: React.ReactNode
  videoOptions?: {
    muted?: boolean
    controls?: boolean
    playbackRate?: number
  }
}

export function CategoryBanner({
  category,
  title,
  description,
  imageUrl,
  videoUrl,
  overlayOpacity = 0.3,
  textPosition = "left",
  textColor = "light",
  className = "",
  children,
  videoOptions = {
    muted: true,
    controls: false,
    playbackRate: 1
  }
}: CategoryBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Fallback for title and description if not provided
  const bannerTitle = title || `Our ${category} Collection`
  const bannerDescription = description || `Discover premium quality ${category.toLowerCase()}`

  // Text positioning classes
  const textAlignments = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }

  // Text color classes
  const textColors = {
    light: "text-white",
    dark: "text-gray-900",
  }

  // Handle media loading
  useEffect(() => {
    if (videoUrl && videoRef.current) {
      const video = videoRef.current
      
      const handleLoadedData = () => {
        setIsLoaded(true)
        // Set playback rate if specified
        if (videoOptions.playbackRate) {
          video.playbackRate = videoOptions.playbackRate
        }
      }

      const handleCanPlay = () => {
        // Attempt to play the video
        video.play().catch(error => {
          console.log("Autoplay prevented:", error)
        })
      }

      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('canplay', handleCanPlay)

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('canplay', handleCanPlay)
      }
    } else if (imageUrl) {
      const img = new Image()
      img.src = imageUrl
      img.onload = () => setIsLoaded(true)
    } else {
      setIsLoaded(true)
    }
  }, [videoUrl, imageUrl, videoOptions.playbackRate])

  // Trigger visibility animation after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={cn("w-full max-w-full", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full overflow-hidden rounded-none"
        style={{
          height: "clamp(240px, 80vh, 880px)",
        }}
      >
        {/* Background video or image with loading state */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{
            scale: isLoaded ? 1 : 1.1,
            opacity: isLoaded ? 1 : 0,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {videoUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted={videoOptions.muted}
              controls={videoOptions.controls}
              playsInline
              preload="metadata"
            >
              <source src={videoUrl} type="video/mp4" />
              {/* Fallback para browsers que não suportam o vídeo */}
              {imageUrl && (
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              )}
            </video>
          ) : imageUrl ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          ) : (
            <div 
              className="w-full h-full"
              style={{ backgroundColor: "#f5f5f5" }}
            />
          )}
        </motion.div>

        {/* Gradient overlay instead of solid color */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              textPosition === "left"
                ? `linear-gradient(90deg, rgba(0,0,0,${overlayOpacity + 0.2}) 0%, rgba(0,0,0,${overlayOpacity}) 50%, rgba(0,0,0,${overlayOpacity - 0.1}) 100%)`
                : textPosition === "right"
                  ? `linear-gradient(270deg, rgba(0,0,0,${overlayOpacity + 0.2}) 0%, rgba(0,0,0,${overlayOpacity}) 50%, rgba(0,0,0,${overlayOpacity - 0.1}) 100%)`
                  : `linear-gradient(180deg, rgba(0,0,0,${overlayOpacity - 0.1}) 0%, rgba(0,0,0,${overlayOpacity}) 50%, rgba(0,0,0,${overlayOpacity - 0.1}) 100%)`,
          }}
        />

        {/* Content container */}
        <div
          className={cn(
            "relative z-20 h-full flex flex-col justify-center p-6 sm:p-8 md:p-12",
            textAlignments[textPosition],
            textColors[textColor],
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 15 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            {/* Category label with line decoration */}
            <div className="flex items-center gap-3 mb-3">
              {textPosition !== "right" && <div className="h-px w-8 bg-current opacity-60" />}
              <span className="text-xs font-medium uppercase tracking-wider">{category}</span>
              {textPosition !== "left" && <div className="h-px w-8 bg-current opacity-60" />}
            </div>
          </motion.div>

          {/* Title with staggered animation */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-2xl sm:text-3xl md:text-4xl font-light leading-tight tracking-tight mb-3"
          >
            {bannerTitle}
          </motion.h1>

          {/* Description with staggered animation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg font-light max-w-md md:max-xl opacity-90"
          >
            {bannerDescription}
          </motion.p>

          {/* Children content with staggered animation */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="mt-6"
            >
              {children}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
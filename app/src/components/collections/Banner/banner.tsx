import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "~/src/lib/utils"

interface CollectionBannerProps {
    collection: string
    title?: string
    description?: string
    imageUrl?: string
    overlayOpacity?: number
    textPosition?: "left" | "center" | "right"
    textColor?: "light" | "dark"
    className?: string
    children?: React.ReactNode
    season?: string // Novo campo específico para coleções
    year?: number // Novo campo para ano da coleção
}    
export function CollectionBanner({
    collection,
    title,
    description,
    imageUrl,
    overlayOpacity = 0.3,
    textPosition = "left",
    textColor = "light",
    className = "",
    children,
    season,
  year = new Date().getFullYear(),
}: CollectionBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    // Fallback para título e descrição
    const bannerTitle = title || `${collection} Collection`
    const bannerDescription = description || 
        (season 
        ? `Discover our ${season.toLowerCase()} ${year} collection` 
        : `Explore premium ${collection.toLowerCase()} pieces`)

    // Classes de alinhamento e cor
    const textAlignments = {
        left: "text-left items-start",
        center: "text-center items-center",
        right: "text-right items-end",
    }

    const textColors = {
        light: "text-white",
        dark: "text-gray-900",
    }

    // Efeitos de carregamento
    useEffect(() => {
        if (imageUrl) {
        const img = new Image()
        img.src = imageUrl
        img.onload = () => setIsLoaded(true)
        } else {
        setIsLoaded(true)
        }

        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [imageUrl])

    return (
        <div className={cn("w-full ", className)}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full overflow-hidden rounded-none"
            style={{ height: "clamp(240px, 80vh, 880px)" }}
        >
            {/* Imagem de fundo */}
            <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: isLoaded ? 1 : 1.1, opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
                backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                backgroundColor: !imageUrl ? "#f5f5f5" : "transparent",
            }}
            />

            {/* Overlay gradiente */}
            <div
            className="absolute inset-0"
            style={{
                background:
                textPosition === "left"
                    ? `linear-gradient(90deg, rgba(0,0,0,${overlayOpacity + 0.2}) 0%, rgba(0,0,0,${overlayOpacity}) 50%, rgba(0,0,0,${overlayOpacity - 0.1}) 100%)`
                    : textPosition === "right"
                    ? `linear-gradient(270deg, rgba(0,0,0,${overlayOpacity + 0.2}) 0%, rgba(0,0,0,${overlayOpacity}) 50%, rgba(0,0,0,${overlayOpacity - 0.1}) 100%)`
                    : `radial-gradient(circle, rgba(0,0,0,${overlayOpacity - 0.2}) 0%, rgba(0,0,0,${overlayOpacity}) 70%)`,
            }}
            />

            {/* Conteúdo */}
            <div
            className={cn(
                "relative h-full flex flex-col justify-center p-6 sm:p-8 md:p-12",
                textAlignments[textPosition],
                textColors[textColor],
            )}
            >
            {/* Cabeçalho com animação */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 15 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="flex flex-col items-start gap-2"
            >
                {/* Tag de coleção e temporada */}
                <div className="flex items-center gap-3">
                {textPosition !== "right" && (
                    <div className="h-px w-8 bg-current opacity-60" />
                )}
                <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wider">
                    {collection}
                    </span>
                    {season && (
                    <span className="text-xs font-light opacity-80">
                        {season} {year}
                    </span>
                    )}
                </div>
                {textPosition !== "left" && (
                    <div className="h-px w-8 bg-current opacity-60" />
                )}
                </div>
            </motion.div>

            {/* Título */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="text-2xl sm:text-3xl md:text-4xl font-light leading-tight tracking-tight my-3"
            >
                {bannerTitle}
            </motion.h1>

            {/* Descrição */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="text-sm sm:text-base md:text-lg font-light max-w-md md:max-w-xl opacity-90"
            >
                {bannerDescription}
            </motion.p>

            {/* Conteúdo adicional */}
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
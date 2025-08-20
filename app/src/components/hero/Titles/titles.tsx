import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "~/src/lib/utils"

interface SectionTitleProps {
    title: string
    subtitle?: string
    align?: "left" | "center" | "right"
    variant?: "default" | "minimal" | "decorative"
    color?: "primary" | "secondary" | "dark" | "light" | "custom"
    customColor?: string
    divider?: boolean
    dividerWidth?: "sm" | "md" | "lg" | "full"
    dividerColor?: string
    className?: string
    titleClassName?: string
    subtitleClassName?: string
    animated?: boolean
    }

    export function Title({
    title,
    subtitle,
    align = "left",
    variant = "default",
    color = "dark",
    customColor,
    divider = true,
    dividerWidth = "md",
    dividerColor,
    className = "",
    titleClassName = "",
    subtitleClassName = "",
    animated = true,
    }: SectionTitleProps) {
    const [isVisible, setIsVisible] = useState(false)
    const titleRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
            }
        },
        { threshold: 0.1 },
        )

        if (titleRef.current) {
        observer.observe(titleRef.current)
        }

        return () => {
        observer.disconnect()
        }
    }, [])

    // Variant styles
    const variantStyles = {
        default: {
        title: "text-3xl uppercase sm:text-3xl md:text-6xl font-light tracking-tight",
        subtitle: "text-base sm:text-lg mt-2 sm:mt-3",
        },
        minimal: {
        title: "text-3xl uppercase sm:text-3xl md:text-6xl font-light tracking-tight",
        subtitle: "text-sm sm:text-base mt-1 sm:mt-2",
        },
        decorative: {
        title: "text-3xl uppercase sm:text-3xl md:text-6xl font-light italic",
        subtitle: "text-xs sm:text-sm uppercase tracking-widest mt-3 sm:mt-4",
        },
    }

    // Color styles
    const colorStyles = {
        primary: {
        title: "text-blue-600 dark:text-blue-400",
        subtitle: "text-blue-500/80 dark:text-blue-400/80",
        divider: "bg-blue-400 dark:bg-blue-500",
        },
        secondary: {
        title: "text-purple-600 dark:text-purple-400",
        subtitle: "text-purple-500/80 dark:text-purple-400/80",
        divider: "bg-purple-400 dark:bg-purple-500",
        },
        dark: {
        title: "text-gray-900 dark:text-gray-50",
        subtitle: "text-gray-600 dark:text-gray-400",
        divider: "bg-gray-300 dark:bg-gray-600",
        },
        light: {
        title: "text-white",
        subtitle: "text-gray-200/90",
        divider: "bg-white/70",
        },
        custom: {
        title: "",
        subtitle: "",
        divider: "",
        },
    }

    // Alignment styles
    const alignmentStyles = {
        left: "text-left items-start",
        center: "text-center items-center",
        right: "text-right items-end",
    }

    // Divider width styles
    const dividerWidthStyles = {
        sm: "w-8 sm:w-12",
        md: "w-12 sm:w-16",
        lg: "w-16 sm:w-24",
        full: "w-full",
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
        },
    }

    const dividerVariants = {
        hidden: { width: 0, opacity: 0 },
        visible: {
        width: "100%",
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            delay: 0.2,
        },
        },
    }

    // Custom color styles
    const customColorStyle = customColor
        ? {
            title: { color: customColor },
            subtitle: { color: customColor, opacity: 0.8 },
            divider: { backgroundColor: customColor, opacity: 0.7 },
        }
        : undefined

    const Component = animated ? motion.div : "div"
    const TitleComponent = animated ? motion.h2 : "h2"
    const SubtitleComponent = animated ? motion.p : "p"
    const DividerComponent = animated ? motion.div : "div"

    return (
        <Component
        ref={titleRef}
        className={cn(`flex flex-col ${alignmentStyles[align]}`, className)}
        initial={animated ? "hidden" : undefined}
        animate={animated && isVisible ? "visible" : undefined}
        variants={containerVariants}
        >
        <TitleComponent
            className={cn(variantStyles[variant].title, color !== "custom" && colorStyles[color].title, titleClassName)}
            style={color === "custom" && customColorStyle ? customColorStyle.title : undefined}
            variants={itemVariants}
        >
            {title}
        </TitleComponent>

        {subtitle && (
            <SubtitleComponent
            className={cn(
                variantStyles[variant].subtitle,
                color !== "custom" && colorStyles[color].subtitle,
                "font-light",
                subtitleClassName,
            )}
            style={color === "custom" && customColorStyle ? customColorStyle.subtitle : undefined}
            variants={itemVariants}
            >
            {subtitle}
            </SubtitleComponent>
        )}

        {divider && (
            <DividerComponent
            className={cn(
                "h-px mt-4",
                dividerWidthStyles[dividerWidth],
                !dividerColor && color !== "custom" && colorStyles[color].divider,
            )}
            style={
                dividerColor
                ? { backgroundColor: dividerColor }
                : color === "custom" && customColorStyle
                    ? customColorStyle.divider
                    : undefined
            }
            variants={animated ? dividerVariants : undefined}
            />
        )}
        </Component>
    )
    }

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface ThemeContextValue {
    isDarkMode: boolean
    toggleDarkMode: () => void
    setDarkMode: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
    children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const stored = localStorage.getItem("darkMode")
        if (stored) {
            setIsDarkMode(true)
        }
    }, [])

    useEffect(() => {
        if (!mounted) return

        const html = document.querySelector("html")
        if (isDarkMode) {
            html?.classList.add("dark")
            localStorage.setItem("darkMode", "true")
        } else {
            html?.classList.remove("dark")
            localStorage.removeItem("darkMode")
        }
    }, [isDarkMode, mounted])

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev)
    }

    const setDarkMode = (isDark: boolean) => {
        setIsDarkMode(isDark)
    }

    const value: ThemeContextValue = {
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
    }

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}

import type React from "react"
import { createContext, useContext, useState } from "react"

interface FilterContextValue {
    selectedTags: string[]
    setSelectedTags: (tags: string[]) => void
    addTag: (tag: string) => void
    removeTag: (tag: string) => void
    clearTags: () => void
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined)

interface FilterProviderProps {
    children: React.ReactNode
}

export function FilterProvider({ children }: FilterProviderProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    const addTag = (tag: string) => {
        setSelectedTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]))
    }

    const removeTag = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag))
    }

    const clearTags = () => {
        setSelectedTags([])
    }

    const value: FilterContextValue = {
        selectedTags,
        setSelectedTags,
        addTag,
        removeTag,
        clearTags,
    }

    return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export function useFilter() {
    const context = useContext(FilterContext)
    if (context === undefined) {
        throw new Error("useFilter must be used within a FilterProvider")
    }
    return context
}

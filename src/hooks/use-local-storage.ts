import { useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | null) => void] {
    // Get from local storage then parse stored json or return initialValue
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = (value: T | null) => {
        try {
            setStoredValue(value as T)

            if (value === null) {
                window.localStorage.removeItem(key)
            } else {
                window.localStorage.setItem(key, JSON.stringify(value))
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error)
        }
    }

    return [storedValue, setValue]
}

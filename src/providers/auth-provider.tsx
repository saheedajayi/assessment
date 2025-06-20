import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "../lib/api-client"
import type { User } from "../types/auth"

interface AuthContextValue {
    user: User | null
    token: string | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
    children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem("auth_token")
        if (storedToken) {
            setToken(storedToken)
            apiClient.setAuthToken(storedToken)
            // In a real app,at this point I would validate the token and get user info
            setUser({ username: "admin" }) // Mock user
        }
        setIsLoading(false)
    }, [])

    const login = (newToken: string) => {
        setToken(newToken)
        setUser({ username: "admin" }) // Mock user
        localStorage.setItem("auth_token", newToken)
        apiClient.setAuthToken(newToken)
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem("auth_token")
        apiClient.setAuthToken(null)
    }

    const value: AuthContextValue = {
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}




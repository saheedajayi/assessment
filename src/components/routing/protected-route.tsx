

import type React from "react"
import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../providers/auth-provider"
import { LoadingSpinner } from "../common/loading-spinner"

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login", {
                replace: true,
                state: { from: location.pathname },
            })
        }
    }, [isAuthenticated, isLoading, navigate, location])

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}

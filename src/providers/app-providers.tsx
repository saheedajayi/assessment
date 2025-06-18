import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "./theme-provider"
import { AuthProvider } from "./auth-provider"
import { FilterProvider } from "./filter-provider"
import { ErrorBoundary } from "../components/common/error-boundary"

interface AppProvidersProps {
    children: React.ReactNode
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error: any) => {
                if (error?.response?.status === 401) return false
                return failureCount < 3
            },
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: false,
        },
    },
})

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AuthProvider>
                        <FilterProvider>
                            {children}
                            <Toaster
                                position="top-center"
                                toastOptions={{
                                    duration: 5000,
                                    style: {
                                        background: "hsl(var(--card))",
                                        color: "hsl(var(--card-foreground))",
                                        border: "1px solid hsl(var(--border))",
                                    },
                                }}
                            />
                        </FilterProvider>
                    </AuthProvider>
                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ErrorBoundary>
    )
}

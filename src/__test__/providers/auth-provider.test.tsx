import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider, useAuth } from "../../providers/auth-provider"


// Test component that uses the auth context
const TestComponent = () => {
    const { user, token, isAuthenticated, login, logout } = useAuth()

    return (
        <div>
            <div data-testid="auth-status">{isAuthenticated ? "authenticated" : "not authenticated"}</div>
            <div data-testid="user-info">{user ? user.username : "no user"}</div>
            <div data-testid="token-info">{token ? "has token" : "no token"}</div>
            <button onClick={() => login("test-token")} data-testid="login-button">
                Login
            </button>
            <button onClick={logout} data-testid="logout-button">
                Logout
            </button>
        </div>
    )
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>{children}</AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

describe("AuthProvider", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it("provides initial unauthenticated state", async () => {
        render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>,
        )

        await waitFor(() => {
            expect(screen.getByTestId("auth-status")).toHaveTextContent("not authenticated")
            expect(screen.getByTestId("user-info")).toHaveTextContent("no user")
            expect(screen.getByTestId("token-info")).toHaveTextContent("no token")
        })
    })

    it("handles login correctly", async () => {
        render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>,
        )

        fireEvent.click(screen.getByTestId("login-button"))

        await waitFor(() => {
            expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated")
            expect(screen.getByTestId("user-info")).toHaveTextContent("admin")
            expect(screen.getByTestId("token-info")).toHaveTextContent("has token")
        })

        expect(localStorage.getItem("auth_token")).toBe("test-token")
    })

    it("handles logout correctly", async () => {
        // First login
        render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>,
        )

        fireEvent.click(screen.getByTestId("login-button"))

        await waitFor(() => {
            expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated")
        })

        // Then logout
        fireEvent.click(screen.getByTestId("logout-button"))

        await waitFor(() => {
            expect(screen.getByTestId("auth-status")).toHaveTextContent("not authenticated")
            expect(screen.getByTestId("user-info")).toHaveTextContent("no user")
            expect(screen.getByTestId("token-info")).toHaveTextContent("no token")
        })

        expect(localStorage.getItem("auth_token")).toBeNull()
    })

    it("restores authentication state from localStorage", async () => {
        localStorage.setItem("auth_token", "stored-token")

        render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>,
        )

        await waitFor(() => {
            expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated")
            expect(screen.getByTestId("user-info")).toHaveTextContent("admin")
            expect(screen.getByTestId("token-info")).toHaveTextContent("has token")
        })
    })

    it("throws error when useAuth is used outside provider", () => {
        // Suppress console.error for this test
        const originalError = console.error
        console.error = jest.fn()

        expect(() => {
            render(<TestComponent />)
        }).toThrow("useAuth must be used within an AuthProvider")

        console.error = originalError
    })
})

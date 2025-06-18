import type React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { LoginForm } from "../../../../features/auth/components/login-form"
import { AuthProvider } from "../../../../providers/auth-provider"
import { authService } from "../../../../services/auth"

// Mock the auth service
jest.mock("../../../../services/auth")
const mockAuthService = authService as jest.Mocked<typeof authService>

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}))

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

describe("LoginForm", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("renders login form fields", () => {
        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>,
        )

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
    })

    it("shows validation errors for empty fields", async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>,
        )

        const submitButton = screen.getByRole("button", { name: /sign in/i })
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText("Username is required")).toBeInTheDocument()
            expect(screen.getByText("Password is required")).toBeInTheDocument()
        })
    })

    it("submits form with valid credentials", async () => {
        const user = userEvent.setup()
        mockAuthService.login.mockResolvedValue({ token: "mock-token" })

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>,
        )

        const usernameInput = screen.getByLabelText(/username/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole("button", { name: /sign in/i })

        await user.type(usernameInput, "admin")
        await user.type(passwordInput, "password")
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockAuthService.login).toHaveBeenCalledWith({
                username: "admin",
                password: "password",
            })
        })
    })

    it("shows loading state during submission", async () => {
        const user = userEvent.setup()
        mockAuthService.login.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>,
        )

        const usernameInput = screen.getByLabelText(/username/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole("button", { name: /sign in/i })

        await user.type(usernameInput, "admin")
        await user.type(passwordInput, "password")
        await user.click(submitButton)

        expect(submitButton).toBeDisabled()
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
    })

    it("handles login error", async () => {
        const user = userEvent.setup()
        mockAuthService.login.mockRejectedValue({
            response: { status: 401 },
        })

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>,
        )

        const usernameInput = screen.getByLabelText(/username/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole("button", { name: /sign in/i })

        await user.type(usernameInput, "wrong")
        await user.type(passwordInput, "wrong")
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getAllByText("Invalid credentials")).toHaveLength(2)
        })
    })
})
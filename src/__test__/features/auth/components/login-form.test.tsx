import type React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { LoginForm } from "../../../../features/auth/components/login-form"
import { AuthProvider } from "../../../../providers/auth-provider"
import { authService } from "../../../../services/auth"
import { UserFactory } from "../../../factories/user-factory"
import { jest } from "@jest/globals"

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

// Mock sanitize functions
jest.mock("../../../../lib/sanitize", () => ({
    sanitizeText: jest.fn((text: string) => text), // Return text as-is for testing
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
        const mockUser = UserFactory.createAdmin()
        const loginRequest = UserFactory.createValidLoginRequest()
        const mockToken = "mock-jwt-token"

        // Mock the login response to match what the component expects
        mockAuthService.login.mockResolvedValue({
            token: mockToken,
            user: mockUser,
        })

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>,
        )

        const usernameInput = screen.getByLabelText(/username/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole("button", { name: /sign in/i })

        await user.type(usernameInput, loginRequest.username)
        await user.type(passwordInput, loginRequest.password)
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockAuthService.login).toHaveBeenCalledWith({
                username: loginRequest.username, // sanitizeText returns the same value in tests
                password: loginRequest.password,
            })
        })
    })

    it("shows loading state during submission", async () => {
        const user = userEvent.setup()
        const loginRequest = UserFactory.createValidLoginRequest()

        mockAuthService.login.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>,
        )

        const usernameInput = screen.getByLabelText(/username/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole("button", { name: /sign in/i })

        await user.type(usernameInput, loginRequest.username)
        await user.type(passwordInput, loginRequest.password)
        await user.click(submitButton)

        expect(submitButton).toBeDisabled()
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
    })

    it("handles login error", async () => {
        const user = userEvent.setup()
        const invalidLogin = UserFactory.createInvalidLoginRequest()

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

        await user.type(usernameInput, invalidLogin.username)
        await user.type(passwordInput, invalidLogin.password)
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getAllByText("Invalid credentials")).toHaveLength(2)
        })
    })

    it("calls sanitizeText on username input", async () => {
        const user = userEvent.setup()
        const mockUser = UserFactory.createAdmin()
        const loginRequest = UserFactory.createValidLoginRequest()
        const mockToken = "mock-jwt-token"

        const { sanitizeText } = require("../../../../lib/sanitize")

        mockAuthService.login.mockResolvedValue({
            token: mockToken,
            user: mockUser,
        })

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>,
        )

        const usernameInput = screen.getByLabelText(/username/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole("button", { name: /sign in/i })

        await user.type(usernameInput, loginRequest.username)
        await user.type(passwordInput, loginRequest.password)
        await user.click(submitButton)

        await waitFor(() => {
            expect(sanitizeText).toHaveBeenCalledWith(loginRequest.username)
        })
    })

    it("does not sanitize password input", async () => {
        const user = userEvent.setup()
        const mockUser = UserFactory.createAdmin()
        const loginRequest = UserFactory.createValidLoginRequest()
        const mockToken = "mock-jwt-token"

        mockAuthService.login.mockResolvedValue({
            token: mockToken,
            user: mockUser,
        })

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>,
        )

        const usernameInput = screen.getByLabelText(/username/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole("button", { name: /sign in/i })

        await user.type(usernameInput, loginRequest.username)
        await user.type(passwordInput, loginRequest.password)
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockAuthService.login).toHaveBeenCalledWith({
                username: loginRequest.username,
                password: loginRequest.password,
            })
        })
    })
})

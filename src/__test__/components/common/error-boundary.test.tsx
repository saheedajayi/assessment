import { render, screen } from "@testing-library/react"
import { ErrorBoundary } from "../../../components/common/error-boundary"


// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error("Test error")
    }
    return <div>No error</div>
}

describe("ErrorBoundary", () => {
    // Suppress console.error for these tests
    const originalError = console.error
    beforeAll(() => {
        console.error = jest.fn()
    })
    afterAll(() => {
        console.error = originalError
    })

    it("renders children when there is no error", () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={false} />
            </ErrorBoundary>,
        )

        expect(screen.getByText("No error")).toBeInTheDocument()
    })

    it("renders error UI when there is an error", () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>,
        )

        expect(screen.getByText("Something went wrong")).toBeInTheDocument()
        expect(screen.getByText(/An unexpected error has occurred/)).toBeInTheDocument()
    })

    it("renders custom fallback when provided", () => {
        const customFallback = <div>Custom error message</div>

        render(
            <ErrorBoundary fallback={customFallback}>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>,
        )

        expect(screen.getByText("Custom error message")).toBeInTheDocument()
    })

    it("has try again button that resets error state", () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>,
        )

        const tryAgainButton = screen.getByText("Try Again")
        expect(tryAgainButton).toBeInTheDocument()
    })

    it("has go home button", () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>,
        )

        const goHomeButton = screen.getByText("Go Home")
        expect(goHomeButton).toBeInTheDocument()
    })
})

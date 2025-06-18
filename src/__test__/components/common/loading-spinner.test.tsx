import { render, screen } from "@testing-library/react"
import { LoadingSpinner } from "../../../components/common/loading-spinner"

describe("LoadingSpinner", () => {
    it("renders with default props", () => {
        render(<LoadingSpinner />)
        expect(screen.getByText("Loading...")).toBeInTheDocument()
    })

    it("renders with custom text", () => {
        render(<LoadingSpinner text="Custom loading message" />)
        expect(screen.getByText("Custom loading message")).toBeInTheDocument()
    })

    it("renders without text when text is empty", () => {
        render(<LoadingSpinner text="" />)

        expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    it("applies custom className", () => {
        const { container } = render(<LoadingSpinner className="custom-class" />)

        expect(container.firstChild).toHaveClass("custom-class")
    })

    it("renders different sizes correctly", () => {
        const { rerender } = render(<LoadingSpinner size="sm" />)
        expect(document.querySelector(".h-4")).toBeInTheDocument()

        rerender(<LoadingSpinner size="md" />)
        expect(document.querySelector(".h-8")).toBeInTheDocument()

        rerender(<LoadingSpinner size="lg" />)
        expect(document.querySelector(".h-12")).toBeInTheDocument()
    })
})
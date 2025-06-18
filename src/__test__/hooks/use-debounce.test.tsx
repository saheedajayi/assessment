import { render, act } from "@testing-library/react"
import { useDebounce } from "../../hooks/use-debounce"

// Test component that uses the hook
const TestComponent = ({ value, delay }: { value: string; delay: number }) => {
    const debouncedValue = useDebounce(value, delay)
    return <div data-testid="debounced-value">{debouncedValue}</div>
}

describe("useDebounce", () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it("returns initial value immediately", () => {
        const { getByTestId } = render(<TestComponent value="initial" delay={500} />)
        expect(getByTestId("debounced-value")).toHaveTextContent("initial")
    })

    it("debounces value changes", () => {
        const { getByTestId, rerender } = render(<TestComponent value="initial" delay={500} />)

        // Change value
        rerender(<TestComponent value="changed" delay={500} />)

        // Value should not change immediately
        expect(getByTestId("debounced-value")).toHaveTextContent("initial")

        // Fast-forward time
        act(() => {
            jest.advanceTimersByTime(500)
        })

        // Now value should be updated
        expect(getByTestId("debounced-value")).toHaveTextContent("changed")
    })

    it("resets timer on rapid changes", () => {
        const { getByTestId, rerender } = render(<TestComponent value="initial" delay={500} />)

        // Change value multiple times rapidly
        rerender(<TestComponent value="change1" delay={500} />)

        act(() => {
            jest.advanceTimersByTime(250)
        })

        rerender(<TestComponent value="change2" delay={500} />)

        act(() => {
            jest.advanceTimersByTime(250)
        })

        // Should still show initial value
        expect(getByTestId("debounced-value")).toHaveTextContent("initial")

        // Complete the debounce period
        act(() => {
            jest.advanceTimersByTime(250)
        })

        // Should show the latest value
        expect(getByTestId("debounced-value")).toHaveTextContent("change2")
    })

    it("handles different delay values", () => {
        const { getByTestId, rerender } = render(<TestComponent value="initial" delay={1000} />)

        rerender(<TestComponent value="changed" delay={1000} />)

        // Should not change after 500ms
        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(getByTestId("debounced-value")).toHaveTextContent("initial")

        // Should change after full 1000ms
        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(getByTestId("debounced-value")).toHaveTextContent("changed")
    })
})
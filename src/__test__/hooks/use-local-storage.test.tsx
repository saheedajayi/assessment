import { render, fireEvent, screen } from "@testing-library/react"
import { useLocalStorage } from "../../hooks/use-local-storage"


// Test component that uses the hook
const TestComponent = ({ storageKey, initialValue }: { storageKey: string; initialValue: any }) => {
    const [value, setValue] = useLocalStorage(storageKey, initialValue)

    return (
        <div>
            <div data-testid="current-value">{JSON.stringify(value)}</div>
            <button onClick={() => setValue("updated")} data-testid="update-button">
                Update
            </button>
            <button onClick={() => setValue(null)} data-testid="clear-button">
                Clear
            </button>
        </div>
    )
}

describe("useLocalStorage", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it("returns initial value when no stored value exists", () => {
        render(<TestComponent storageKey="test-key" initialValue="initial" />)

        expect(screen.getByTestId("current-value")).toHaveTextContent('"initial"')
    })

    it("returns stored value when it exists", () => {
        localStorage.setItem("test-key", JSON.stringify("stored"))

        render(<TestComponent storageKey="test-key" initialValue="initial" />)

        expect(screen.getByTestId("current-value")).toHaveTextContent('"stored"')
    })

    it("updates localStorage when value changes", () => {
        render(<TestComponent storageKey="test-key" initialValue="initial" />)

        fireEvent.click(screen.getByTestId("update-button"))

        expect(localStorage.getItem("test-key")).toBe('"updated"')
        expect(screen.getByTestId("current-value")).toHaveTextContent('"updated"')
    })

    it("removes item from localStorage when value is null", () => {
        localStorage.setItem("test-key", JSON.stringify("stored"))

        render(<TestComponent storageKey="test-key" initialValue="initial" />)

        fireEvent.click(screen.getByTestId("clear-button"))

        expect(localStorage.getItem("test-key")).toBeNull()
        expect(screen.getByTestId("current-value")).toHaveTextContent("null")
    })

    it("handles complex objects", () => {
        const complexObject = { name: "test", count: 42, active: true }

        const ComplexTestComponent = () => {
            const [value, setValue] = useLocalStorage("complex-key", complexObject)

            return (
                <div>
                    <div data-testid="complex-value">{JSON.stringify(value)}</div>
                    <button onClick={() => setValue({ ...value, count: 100 })} data-testid="update-complex">
                        Update Complex
                    </button>
                </div>
            )
        }

        render(<ComplexTestComponent />)

        expect(screen.getByTestId("complex-value")).toHaveTextContent(JSON.stringify(complexObject))

        fireEvent.click(screen.getByTestId("update-complex"))

        expect(screen.getByTestId("complex-value")).toHaveTextContent(JSON.stringify({ ...complexObject, count: 100 }))
    })

    it("handles localStorage errors gracefully", () => {
        // Mock localStorage to throw an error
        const originalSetItem = localStorage.setItem
        localStorage.setItem = jest.fn(() => {
            throw new Error("localStorage error")
        })

        // Should not crash
        render(<TestComponent storageKey="test-key" initialValue="initial" />)

        expect(screen.getByTestId("current-value")).toHaveTextContent('"initial"')

        // Restore original localStorage
        localStorage.setItem = originalSetItem
    })
})

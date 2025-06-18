import { jest } from "@jest/globals"
import "@testing-library/jest-dom"

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    readonly root: Element | null = null
    readonly rootMargin: string = "0px"
    readonly thresholds: ReadonlyArray<number> = []

    constructor(
        //@ts-ignore
        private callback: IntersectionObserverCallback,
        //@ts-ignore
        private options?: IntersectionObserverInit,
    ) {}

    //@ts-ignore
    observe(target: Element): void {}
    //@ts-ignore
    unobserve(target: Element): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
        return []
    }
} as any

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    //@ts-ignore
    constructor(private callback: ResizeObserverCallback) {}
    //@ts-ignore
    observe(target: Element, options?: ResizeObserverOptions): void {}
    //@ts-ignore
    unobserve(target: Element): void {}
    disconnect(): void {}
} as any

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

// Mock scrollTo
Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: jest.fn(),
})

// Mock HTMLElement.scrollIntoView
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    writable: true,
    value: jest.fn(),
})

// Mock getComputedStyle
Object.defineProperty(window, "getComputedStyle", {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
        getPropertyValue: jest.fn().mockReturnValue(""),
    })),
})

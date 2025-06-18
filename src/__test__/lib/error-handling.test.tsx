import { AxiosError } from "axios"
import { handleApiError, isNetworkError, getErrorCode } from "../../lib/error-handling"

describe("Error Handling Utils", () => {
    describe("handleApiError", () => {
        it("handles 401 errors", () => {
            const error = new AxiosError("Unauthorized", "401", undefined, undefined, {
                status: 401,
                statusText: "Unauthorized",
                data: {},
                headers: {},
                config: {},
            } as any)

            const result = handleApiError(error)
            expect(result).toBe("Authentication required. Please log in again.")
        })

        it("handles 403 errors", () => {
            const error = new AxiosError("Forbidden", "403", undefined, undefined, {
                status: 403,
                statusText: "Forbidden",
                data: {},
                headers: {},
                config: {},
            } as any)

            const result = handleApiError(error)
            expect(result).toBe("You do not have permission to perform this action.")
        })

        it("handles 404 errors", () => {
            const error = new AxiosError("Not Found", "404", undefined, undefined, {
                status: 404,
                statusText: "Not Found",
                data: {},
                headers: {},
                config: {},
            } as any)

            const result = handleApiError(error)
            expect(result).toBe("The requested resource was not found.")
        })

        it("handles 500+ errors", () => {
            const error = new AxiosError("Internal Server Error", "500", undefined, undefined, {
                status: 500,
                statusText: "Internal Server Error",
                data: {},
                headers: {},
                config: {},
            } as any)

            const result = handleApiError(error)
            expect(result).toBe("A server error occurred. Please try again later.")
        })

        it("handles custom error messages from response", () => {
            const error = new AxiosError("Bad Request", "400", undefined, undefined, {
                status: 400,
                statusText: "Bad Request",
                data: { error: "Custom error message" },
                headers: {},
                config: {},
            } as any)

            const result = handleApiError(error)
            expect(result).toBe("Custom error message")
        })

        it("handles generic Error objects", () => {
            const error = new Error("Generic error")
            const result = handleApiError(error)
            expect(result).toBe("Generic error")
        })

        it("handles unknown error types", () => {
            const error = "string error"
            const result = handleApiError(error)
            expect(result).toBe("An unexpected error occurred. Please try again.")
        })
    })

    describe("isNetworkError", () => {
        it("returns true for network errors", () => {
            const error = new AxiosError("Network Error", "NETWORK_ERROR")
            const result = isNetworkError(error)
            expect(result).toBe(true)
        })

        it("returns false for response errors", () => {
            const error = new AxiosError("Bad Request", "400", undefined, undefined, {
                status: 400,
                statusText: "Bad Request",
                data: {},
                headers: {},
                config: {},
            } as any)

            const result = isNetworkError(error)
            expect(result).toBe(false)
        })

        it("returns false for non-axios errors", () => {
            const error = new Error("Generic error")
            const result = isNetworkError(error)
            expect(result).toBe(false)
        })
    })

    describe("getErrorCode", () => {
        it("returns status code for axios errors with response", () => {
            const error = new AxiosError("Bad Request", "400", undefined, undefined, {
                status: 400,
                statusText: "Bad Request",
                data: {},
                headers: {},
                config: {},
            } as any)

            const result = getErrorCode(error)
            expect(result).toBe(400)
        })

        it("returns null for axios errors without response", () => {
            const error = new AxiosError("Network Error", "NETWORK_ERROR")
            const result = getErrorCode(error)
            expect(result).toBe(null)
        })

        it("returns null for non-axios errors", () => {
            const error = new Error("Generic error")
            const result = getErrorCode(error)
            expect(result).toBe(null)
        })
    })
})

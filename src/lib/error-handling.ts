import { AxiosError } from "axios"

export function handleApiError(error: unknown): string {
    if (error instanceof AxiosError) {
        // Handle specific HTTP status codes
        if (error.response?.status === 401) {
            return "Authentication required. Please log in again."
        }

        if (error.response?.status === 403) {
            return "You do not have permission to perform this action."
        }

        if (error.response?.status === 404) {
            return "The requested resource was not found."
        }

        if (error.response?.status! >= 500) {
            return "A server error occurred. Please try again later."
        }

        // Try to get error message from response
        const message = error.response?.data?.error || error.response?.data?.message
        if (message) {
            return message
        }
    }

    if (error instanceof Error) {
        return error.message
    }

    return "An unexpected error occurred. Please try again."
}

export function isNetworkError(error: unknown): boolean {
    return error instanceof AxiosError && !error.response
}

export function getErrorCode(error: unknown): number | null {
    if (error instanceof AxiosError && error.response) {
        return error.response.status
    }
    return null
}

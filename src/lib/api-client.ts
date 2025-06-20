import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from "axios"

class ApiClient {
    private client: AxiosInstance

    constructor() {
        this.client = axios.create({
            // baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
            baseURL: "http://localhost:3001",
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                return config
            },
            (error) => {
                return Promise.reject(error)
            },
        )

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Handle unauthorized - could trigger logout
                    window.dispatchEvent(new CustomEvent("auth:unauthorized"))
                }

                return Promise.reject(error)
            },
        )
    }

    setAuthToken(token: string | null) {
        if (token) {
            this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`
        } else {
            delete this.client.defaults.headers.common["Authorization"]
        }
    }

    async get<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
        return this.client.get<T>(url, config)
    }

    async post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
        return this.client.post<T>(url, data, config)
    }

    async put<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
        return this.client.put<T>(url, data, config)
    }

    async delete<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
        return this.client.delete<T>(url, config)
    }
}

export const apiClient = new ApiClient()



import { apiClient } from "../lib/api-client"
import type { LoginRequest, LoginResponse } from "../types/auth"

class AuthService {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>("/login", credentials)
        return response.data
    }

    async logout(): Promise<void> {
        // await apiClient.post('/logout')
    }
}

export const authService = new AuthService()




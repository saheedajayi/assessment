import { apiClient } from "../lib/api-client"
import type { RecommendationsDataResponse, RecommendationsFilter, SuccessResponse } from "../types/recommendations"

class RecommendationService {
    async getRecommendations(filter: RecommendationsFilter = {}): Promise<RecommendationsDataResponse> {
        const endpoint = filter.archived ? "/recommendations/archive" : "/recommendations"

        const params: Record<string, any> = {
            limit: filter.limit ?? 20,
        }

        if (filter.search) params.search = filter.search
        if (filter.tags?.length) params.tags = filter.tags.join(",")
        if (filter.cursor) params.cursor = filter.cursor

        const response = await apiClient.get<RecommendationsDataResponse>(endpoint, { params })
        return response.data
    }

    async archive(id: string): Promise<SuccessResponse> {
        const response = await apiClient.post<SuccessResponse>(`/recommendations/${id}/archive`)
        return response.data
    }

    async unarchive(id: string): Promise<SuccessResponse> {
        const response = await apiClient.post<SuccessResponse>(`/recommendations/${id}/unarchive`)
        return response.data
    }
}

export const recommendationService = new RecommendationService()

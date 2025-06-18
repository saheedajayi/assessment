import { recommendationService } from "../../services/recommendations"
import { apiClient } from "../../lib/api-client"
import type { AxiosResponse } from "axios"
import { jest } from "@jest/globals"

// Mock the API client
jest.mock("../../lib/api-client")
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

// Helper function to create complete Axios response objects
const createMockAxiosResponse = (data: any): AxiosResponse<any> => ({
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {
        headers: {} as any,
    },
})

describe("RecommendationService", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("getRecommendations", () => {
        const mockResponse = {
            data: [],
            pagination: {
                cursor: { next: null },
                totalItems: 0,
            },
            availableTags: {
                frameworks: ["CIS AWS"],
                providers: ["AWS"],
                classes: ["COMPUTE_RECOMMENDATION"],
                reasons: ["Security improvement"],
            },
        }

        it("calls correct endpoint for active recommendations", async () => {
            mockApiClient.get.mockResolvedValue(createMockAxiosResponse(mockResponse))

            await recommendationService.getRecommendations({ archived: false })

            expect(mockApiClient.get).toHaveBeenCalledWith("/recommendations", {
                params: { limit: 20 },
            })
        })

        it("calls correct endpoint for archived recommendations", async () => {
            mockApiClient.get.mockResolvedValue(createMockAxiosResponse(mockResponse))

            await recommendationService.getRecommendations({ archived: true })

            expect(mockApiClient.get).toHaveBeenCalledWith("/recommendations/archive", {
                params: { limit: 20 },
            })
        })

        it("includes search parameter when provided", async () => {
            mockApiClient.get.mockResolvedValue(createMockAxiosResponse(mockResponse))

            await recommendationService.getRecommendations({
                search: "test search",
                limit: 10,
            })

            expect(mockApiClient.get).toHaveBeenCalledWith("/recommendations", {
                params: {
                    limit: 10,
                    search: "test search",
                },
            })
        })

        it("includes tags parameter when provided", async () => {
            mockApiClient.get.mockResolvedValue(createMockAxiosResponse(mockResponse))

            await recommendationService.getRecommendations({
                tags: ["AWS", "COMPUTE_RECOMMENDATION"],
            })

            expect(mockApiClient.get).toHaveBeenCalledWith("/recommendations", {
                params: {
                    limit: 20,
                    tags: "AWS,COMPUTE_RECOMMENDATION",
                },
            })
        })

        it("includes cursor parameter when provided", async () => {
            mockApiClient.get.mockResolvedValue(createMockAxiosResponse(mockResponse))

            await recommendationService.getRecommendations({
                cursor: "next-cursor",
            })

            expect(mockApiClient.get).toHaveBeenCalledWith("/recommendations", {
                params: {
                    limit: 20,
                    cursor: "next-cursor",
                },
            })
        })
    })

    describe("archive", () => {
        it("calls correct endpoint for archiving", async () => {
            const mockResponse = { success: true }
            mockApiClient.post.mockResolvedValue(createMockAxiosResponse(mockResponse))

            const result = await recommendationService.archive("rec-001")

            expect(mockApiClient.post).toHaveBeenCalledWith("/recommendations/rec-001/archive")
            expect(result).toEqual(mockResponse)
        })
    })

    describe("unarchive", () => {
        it("calls correct endpoint for unarchiving", async () => {
            const mockResponse = { success: true }
            mockApiClient.post.mockResolvedValue(createMockAxiosResponse(mockResponse))

            const result = await recommendationService.unarchive("rec-001")

            expect(mockApiClient.post).toHaveBeenCalledWith("/recommendations/rec-001/unarchive")
            expect(result).toEqual(mockResponse)
        })
    })
})


import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { recommendationService } from "../../../services/recommendations"
import type { RecommendationsFilter, Recommendation, RecommendationsDataResponse } from "../../../types/recommendations"
import type { InfiniteData } from "@tanstack/react-query"

interface UseRecommendationsOptions {
    archived?: boolean
    search?: string
    tags?: string[]
}

interface TransformedInfiniteData extends InfiniteData<RecommendationsDataResponse, unknown> {
    deduplicatedRecommendations: Recommendation[]
    totalCount: number
}

export function useRecommendations({ archived = false, search = "", tags = [] }: UseRecommendationsOptions = {}) {
    const queryClient = useQueryClient()

    const queryKey = ["recommendations", archived ? "archived" : "active", search, tags.join(",")]

    const query = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => {
            const filter: RecommendationsFilter = {
                archived,
                cursor: pageParam,
                search: search || undefined,
                tags: tags.length > 0 ? tags : undefined,
                limit: 20,
            }
            return recommendationService.getRecommendations(filter)
        },
        getNextPageParam: (lastPage) => lastPage.pagination.cursor.next,
        initialPageParam: undefined as string | undefined,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        select: (data): TransformedInfiniteData => {
            // Deduplicate recommendations across pages
            const allRecommendations: Recommendation[] = []
            const seenIds = new Set<string>()

            data.pages.forEach((page) => {
                page.data.forEach((recommendation) => {
                    if (!seenIds.has(recommendation.recommendationId)) {
                        seenIds.add(recommendation.recommendationId)
                        allRecommendations.push(recommendation)
                    }
                })
            })

            return {
                ...data,
                deduplicatedRecommendations: allRecommendations,
                totalCount: data.pages[0]?.pagination.totalItems ?? 0,
            }
        },
    })

    const removeRecommendation = (recommendationId: string) => {
        queryClient.setQueryData(queryKey, (oldData: any) => {
            if (!oldData) return oldData

            return {
                ...oldData,
                pages: oldData.pages.map((page: any, index: number) => ({
                    ...page,
                    pagination: {
                        ...page.pagination,
                        totalItems: page.pagination.totalItems - (index === 0 ? 1 : 0),
                    },
                    data: page.data.filter((item: any) => item.recommendationId !== recommendationId),
                })),
            }
        })
    }

    const invalidateRecommendations = () => {
        queryClient.invalidateQueries({ queryKey: ["recommendations"] })
    }

    return {
        ...query,
        removeRecommendation,
        invalidateRecommendations,
    }
}


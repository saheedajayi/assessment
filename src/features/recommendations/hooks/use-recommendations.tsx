import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { recommendationService } from "../../../services/recommendations"
import type { RecommendationsFilter } from "../../../types/recommendations"

interface UseRecommendationsOptions {
    archived?: boolean
    search?: string
    tags?: string[]
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


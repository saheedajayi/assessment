import { useQuery } from "@tanstack/react-query"
import { recommendationService } from "../../../services/recommendations"

export function useAvailableTags() {
    return useQuery({
        queryKey: ["available-tags"],
        queryFn: () => recommendationService.getRecommendations({ limit: 0 }),
        select: (data) => data.availableTags,
        staleTime: 10 * 60 * 1000,
    })
}

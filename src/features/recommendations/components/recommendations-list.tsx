import InfiniteScroll from "react-infinite-scroll-component"
import { RecommendationCard } from "./recommendation-card"
import { LoadingSpinner } from "../../../components/common/loading-spinner"
import { AlertCircle, Package } from "lucide-react"
import type { Recommendation } from "../../../types/recommendations"

interface RecommendationsListProps {
    recommendations: Recommendation[]
    isLoading: boolean
    error: Error | null
    hasNextPage: boolean
    onLoadMore: () => void
    onRecommendationClick: (recommendation: Recommendation) => void
    archived?: boolean
}

export function RecommendationsList({
                                        recommendations,
                                        isLoading,
                                        error,
                                        hasNextPage,
                                        onLoadMore,
                                        onRecommendationClick,
                                        archived = false,
                                    }: RecommendationsListProps) {
    if (isLoading && recommendations.length === 0) {
        return <LoadingSpinner text="Loading recommendations..." />
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold mb-2">Failed to load recommendations</h3>
                <p className="text-muted-foreground">{error.message || "An unexpected error occurred"}</p>
            </div>
        )
    }

    if (recommendations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recommendations found</h3>
                <p className="text-muted-foreground">
                    {archived
                        ? "No archived recommendations match your criteria"
                        : "No active recommendations match your criteria"}
                </p>
            </div>
        )
    }

    return (
        <InfiniteScroll
            key={archived ? "archived" : "active"}
            dataLength={recommendations.length}
            next={onLoadMore}
            hasMore={hasNextPage}
            loader={<LoadingSpinner size="sm" text="Loading more..." />}
            endMessage={<p className="text-center text-sm text-muted-foreground py-4">No more recommendations to load</p>}
            className="space-y-4"
            height="100vh"
        >
            {recommendations.map((recommendation) => (
                <RecommendationCard
                    key={recommendation.recommendationId}
                    recommendation={recommendation}
                    onClick={() => onRecommendationClick(recommendation)}
                    archived={archived}
                />
            ))}
        </InfiniteScroll>
    )
}

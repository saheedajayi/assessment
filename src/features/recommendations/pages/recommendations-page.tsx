"use client"

import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Container } from "../../../components/common/container"
import { Button } from "../../../components/ui/button"
import { Archive, Package } from "lucide-react"
import { RecommendationsList } from "../components/recommendations-list"
import { RecommendationsFilters } from "../components/recommendations-filters"
import { useRecommendations } from "../hooks/use-recommendations"
import { useFilter } from "../../../providers/filter-provider"
import type { Recommendation } from "../../../types/recommendations"
import { RecommendationSheet } from "../components/recommendation-sheet.tsx"

interface RecommendationsPageProps {
    archived?: boolean
}

export default function RecommendationsPage({ archived = false }: RecommendationsPageProps) {
    const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null)
    const [searchTerm, setSearchTerm] = useState("")


    const { selectedTags } = useFilter()

    const { data, fetchNextPage, hasNextPage, isLoading, error, removeRecommendation, invalidateRecommendations } =
        useRecommendations({
            archived,
            search: searchTerm,
            tags: selectedTags,
        })

    const recommendations = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) ?? []
    }, [data])

    const totalCount = data?.pages[0]?.pagination.totalItems ?? 0

    const handleRecommendationClick = (recommendation: Recommendation) => {
        setSelectedRecommendation(recommendation)
    }

    const handleCloseModal = () => {
        setSelectedRecommendation(null)
    }

    const handleArchiveToggle = (recommendationId: string) => {

        removeRecommendation(recommendationId)
        setSelectedRecommendation(null)


        setTimeout(() => {
            invalidateRecommendations()
        }, 100)
    }

    return (
        <Container>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{archived ? "Archived " : ""}Recommendations</h1>
                    </div>
                    <Button asChild variant="outline">
                        <Link to={archived ? "/recommendations" : "/recommendations/archive"} data-testid="archive-link">
                            {archived ? <Package className="mr-2 h-4 w-4" /> : <Archive className="mr-2 h-4 w-4" />}
                            {archived ? "Active" : "Archive"}
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    {/* Filters */}
                    <div className="flex-1 sm:max-w-md">
                        <RecommendationsFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                    </div>


                    <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap sm:ml-4">
            <span>
              Showing {recommendations.length} of {totalCount} results
            </span>
                    </div>
                </div>


                <RecommendationsList
                    recommendations={recommendations}
                    isLoading={isLoading}
                    error={error}
                    hasNextPage={hasNextPage}
                    onLoadMore={fetchNextPage}
                    onRecommendationClick={handleRecommendationClick}
                    archived={archived}
                />


                <RecommendationSheet
                    recommendation={selectedRecommendation}
                    isOpen={!!selectedRecommendation}
                    onClose={handleCloseModal}
                    onArchiveToggle={handleArchiveToggle}
                    archived={archived}
                />
            </div>
        </Container>
    )
}

import type React from "react"

import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Package, Archive } from "lucide-react"
import { ProviderIcon } from "./provider-icon"
import { ValueScore } from "./value-score"
import { cn } from "../../../lib/utils"
import type { Recommendation } from "../../../types/recommendations"

interface RecommendationCardProps {
    recommendation: Recommendation
    onClick: () => void
    archived?: boolean
    onQuickArchive?: (id: string) => void
}

export function RecommendationCard({
                                       recommendation,
                                       onClick,
                                       archived = false,
                                       onQuickArchive,
                                   }: RecommendationCardProps) {
    const valueScore = Math.floor((recommendation.score / 100) * 4)

    const handleQuickArchive = (e: React.MouseEvent) => {
        e.stopPropagation()
        onQuickArchive?.(recommendation.recommendationId)
    }

    return (
        <Card
            className={cn("cursor-pointer transition-all hover:shadow-lg", "border border-border hover:border-primary/50")}
            onClick={onClick}
            data-testid="recommendation-card"
        >
            <CardContent className="p-0">
                <div className="flex">
                    {/* Icon Section */}
                    <div
                        className={cn(
                            "flex items-center justify-center w-16 lg:w-32 rounded-l-lg",
                            archived ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground",
                        )}
                    >
                        <Package className="h-6 w-6" />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                            {/* Main Content */}
                            <div className="flex-1 space-y-3">
                                {/* Title and Providers */}
                                <div className="flex items-start gap-3">
                                    <h3 className="font-semibold text-base lg:text-lg line-clamp-2 flex-1">{recommendation.title}</h3>
                                    <div className="flex gap-1">
                                        {recommendation.provider.map((provider, idx) => (
                                            <ProviderIcon key={idx} provider={provider} />
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-muted-foreground text-sm line-clamp-2">{recommendation.description}</p>

                                {/* Frameworks */}
                                <div className="flex flex-wrap gap-2">
                                    {recommendation.frameworks.slice(0, 2).map((framework, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                            {framework.name}
                                        </Badge>
                                    ))}
                                    {recommendation.frameworks.length > 2 && (
                                        <Badge variant="secondary" className="text-xs">
                                            +{recommendation.frameworks.length - 2}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Stats and Actions Section */}
                            <div className="lg:w-48 bg-muted/50 rounded-lg p-4 space-y-3">
                                <div>
                                    <h4 className="font-medium text-sm">Impact Assessment</h4>
                                    <p className="text-xs text-muted-foreground">
                                        ~{recommendation.impactAssessment.totalViolations} violations/month
                                    </p>
                                </div>

                                <hr className="border-border" />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Value Score</span>
                                    <ValueScore score={valueScore} />
                                </div>

                                {!archived && onQuickArchive && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleQuickArchive}
                                        data-testid="quick-archive-button"
                                        className="w-full"
                                    >
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archive
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../../components/ui/sheet"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Separator } from "../../../components/ui/separator"
import {
    Package,
    ExternalLink,
    Archive,
    ArchiveRestore,
    Settings,
    BarChart3,
    BookOpen,
    AlertTriangle,
    Loader2,
} from "lucide-react"
import { ProviderIcon } from "./provider-icon"
import { ValueScore } from "./value-score"
import { useRecommendationActions } from "../hooks/use-recommendation-actions"
import { getProviderName } from "../../../lib/providers"
import type { Recommendation } from "../../../types/recommendations"
import { ScrollArea } from "../../../components/ui/scrollarea.tsx"

interface RecommendationSheetProps {
    recommendation: Recommendation | null
    isOpen: boolean
    onClose: () => void
    onArchiveToggle: (recommendationId: string) => void
    archived?: boolean
}

export function RecommendationSheet({
                                        recommendation,
                                        isOpen,
                                        onClose,
                                        onArchiveToggle,
                                        archived = false,
                                    }: RecommendationSheetProps) {
    const { archiveRecommendation, unarchiveRecommendation } = useRecommendationActions()
    const [isToggling, setIsToggling] = useState(false)

    if (!recommendation) return null

    const handleArchiveToggle = async () => {
        setIsToggling(true)
        try {
            if (archived) {
                await unarchiveRecommendation(recommendation.recommendationId)
            } else {
                await archiveRecommendation(recommendation.recommendationId)
            }
            onArchiveToggle(recommendation.recommendationId)
        } catch (error) {
            // Error handling is done in the hook
        } finally {
            setIsToggling(false)
        }
    }

    const valueScore = Math.floor((recommendation.score / 100) * 4)

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-4xl p-0" data-testid="recommendation-sheet">
                <ScrollArea className="h-full">
                    <div className="p-6">
                        <SheetHeader className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="h-16 w-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                                    <Package className="h-8 w-8" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <SheetTitle className="text-xl leading-tight">{recommendation.title}</SheetTitle>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">Value Score:</span>
                                            <ValueScore score={valueScore} />
                                        </div>
                                        {recommendation.provider.map((provider, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <ProviderIcon provider={provider} />
                                                <span className="text-sm font-medium">{getProviderName(provider)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="mt-6 space-y-6">
                            {/* Frameworks */}
                            <div className="flex flex-wrap gap-2">
                                {recommendation.frameworks.map((framework, idx) => (
                                    <Badge key={idx} variant="secondary">
                                        {framework.name}
                                    </Badge>
                                ))}
                            </div>

                            <Separator />

                            {/* Description */}
                            <div>
                                <p className="text-muted-foreground leading-relaxed">{recommendation.description}</p>
                            </div>

                            {/* Resources */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    <p className="font-semibold text-xl">Resources Enforced by Policy</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recommendation.affectedResources.map((resource, idx) => (
                                        <Badge key={idx} variant="outline">
                                            {resource.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Reasons */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    <p className="font-semibold text-xl">Reasons</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recommendation.reasons.map((reason, idx) => (
                                        <Badge key={idx} variant="outline">
                                            {reason}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Impact Assessment */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    <p className="font-semibold text-xl">Impact Assessment</p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-muted rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm">Overall</span>
                                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">Violations</span>
                                            <span className="font-semibold">{recommendation.totalHistoricalViolations}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm">Most Impacted Scope</span>
                                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold">{recommendation.impactAssessment.mostImpactedScope.name}</span>
                                                <span className="font-semibold">{recommendation.impactAssessment.mostImpactedScope.count}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                ({recommendation.impactAssessment.mostImpactedScope.type})
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Further Reading */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    <p className="font-semibold text-xl">Further Reading</p>
                                </div>
                                <div className="space-y-2">
                                    {recommendation.furtherReading.map((reading, idx) => (
                                        <a
                                            key={idx}
                                            href={reading.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-primary hover:underline"
                                        >
                                            <span>{reading.name}</span>
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t">
                            <Button variant="outline" onClick={handleArchiveToggle} disabled={isToggling}>
                                {isToggling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {archived ? (
                                    <>
                                        <ArchiveRestore className="mr-2 h-4 w-4" />
                                        Unarchive
                                    </>
                                ) : (
                                    <>
                                        <Archive className="mr-2 h-4 w-4" />
                                        Archive
                                    </>
                                )}
                            </Button>
                            <Button>
                                <Settings className="mr-2 h-4 w-4" />
                                Configure Policy
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
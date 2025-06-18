import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { recommendationService } from "../../../services/recommendations"
import { handleApiError } from "../../../lib/error-handling"

export function useRecommendationActions() {
    const archiveMutation = useMutation({
        mutationFn: (id: string) => recommendationService.archive(id),
        onSuccess: () => {
            toast.success("Recommendation archived successfully")
        },
        onError: (error) => {
            toast.error(handleApiError(error))
        },
    })

    const unarchiveMutation = useMutation({
        mutationFn: (id: string) => recommendationService.unarchive(id),
        onSuccess: () => {
            toast.success("Recommendation unarchived successfully")
        },
        onError: (error) => {
            toast.error(handleApiError(error))
        },
    })

    return {
        archiveRecommendation: archiveMutation.mutateAsync,
        unarchiveRecommendation: unarchiveMutation.mutateAsync,
        isArchiving: archiveMutation.isPending,
        isUnarchiving: unarchiveMutation.isPending,
    }
}

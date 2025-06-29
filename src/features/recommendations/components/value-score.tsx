interface ValueScoreProps {
    score: number
    maxScore?: number
}

export function ValueScore({ score, maxScore = 4 }: ValueScoreProps) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: maxScore }, (_, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${i < score ? "bg-primary" : "bg-muted-foreground/30"}`} />
            ))}
        </div>
    )
}
